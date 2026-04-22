'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './page.module.css';

type BoundingBox = [number, number, number, number]; // [south, north, west, east]

type OSMResult = {
  place_id: string;
  display_name: string;
  lat: number;
  lon: number;
  boundingbox?: BoundingBox;
  class?: string;
  type?: string;
  geojson?: unknown;
};

type OSMVet = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  phone?: string;
  openingHours?: string;
};

const VetFinderMap = dynamic(() => import('./VetFinderMap'), { ssr: false });

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debouncedValue;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function calculateSearchRadiusMeters(place: Pick<OSMResult, 'boundingbox' | 'lat'>) {
  if (!place.boundingbox) return 10000;
  const [south, north, west, east] = place.boundingbox;

  const latSpan = Math.abs(north - south);
  const lonSpan = Math.abs(east - west);

  const latMeters = latSpan * 111_000;
  const lonMeters = lonSpan * 111_000 * Math.cos((place.lat * Math.PI) / 180);

  const approxRadius = Math.max(latMeters, lonMeters) / 2;
  return clampNumber(Math.round(approxRadius * 1.2), 5000, 50000);
}

function isVetResult(result: Pick<OSMResult, 'class' | 'type'>) {
  return result.class === 'amenity' && result.type === 'veterinary';
}

function getPrimaryLabel(displayName: string) {
  const firstComma = displayName.indexOf(',');
  if (firstComma === -1) return displayName;
  return displayName.slice(0, firstComma);
}

export default function VetFinderClient() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 250);

  const [suggestions, setSuggestions] = useState<OSMResult[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const [selectedPlace, setSelectedPlace] = useState<OSMResult | null>(null);
  const [selectedVet, setSelectedVet] = useState<OSMVet | null>(null);
  const [nearbyVets, setNearbyVets] = useState<OSMVet[]>([]);

  const [searching, setSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setSuggestionsOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const q = debouncedQuery.trim();
      if (q.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setSuggestionsLoading(true);
        const res = await fetch(`/api/osm/search?q=${encodeURIComponent(q)}&limit=6`);
        if (!res.ok) throw new Error('Failed to fetch suggestions');
        const data: { results: OSMResult[] } = await res.json();
        setSuggestions(data.results);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    };

    void fetchSuggestions();
  }, [debouncedQuery]);

  const titleText = useMemo(() => {
    if (selectedVet) return 'Vet location on map';
    if (selectedPlace) return `Vets near ${getPrimaryLabel(selectedPlace.display_name)}`;
    return 'Search a location to see vets nearby';
  }, [selectedPlace, selectedVet]);

  const runLocationSearch = async (place: OSMResult) => {
    setErrorMessage(null);
    setSelectedVet(null);

    try {
      setSearching(true);
      const radius = calculateSearchRadiusMeters(place);
      const res = await fetch(
        `/api/osm/vets?lat=${encodeURIComponent(String(place.lat))}&lon=${encodeURIComponent(String(place.lon))}&radius=${encodeURIComponent(String(radius))}`,
      );
      if (!res.ok) throw new Error('Failed to fetch nearby vets');
      const data: { vets: OSMVet[] } = await res.json();
      setNearbyVets(data.vets);
    } catch {
      setNearbyVets([]);
      setErrorMessage('Could not load nearby vets for that location.');
    } finally {
      setSearching(false);
    }
  };

  const selectSuggestion = async (suggestion: OSMResult) => {
    setQuery(suggestion.display_name);
    setSuggestionsOpen(false);

    if (isVetResult(suggestion)) {
      const vet: OSMVet = {
        id: suggestion.place_id,
        name: getPrimaryLabel(suggestion.display_name),
        lat: suggestion.lat,
        lon: suggestion.lon,
        address: suggestion.display_name,
      };

      setSelectedPlace(null);
      setSelectedVet(vet);
      setNearbyVets([vet]);
      return;
    }

    try {
      setSearching(true);
      setErrorMessage(null);

      const lookupRes = await fetch(`/api/osm/lookup?place_id=${encodeURIComponent(suggestion.place_id)}`);
      const lookupData: { result: OSMResult | null } = await lookupRes.json();

      const placeWithGeo = lookupData.result ?? suggestion;
      setSelectedPlace(placeWithGeo);
      await runLocationSearch(placeWithGeo);
    } catch {
      setSelectedPlace(suggestion);
      await runLocationSearch(suggestion);
    } finally {
      setSearching(false);
    }
  };

  const submitSearch = async () => {
    const q = query.trim();
    if (!q) return;

    setSuggestionsOpen(false);
    setErrorMessage(null);

    try {
      setSearching(true);

      const res = await fetch(`/api/osm/search?q=${encodeURIComponent(q)}&limit=1&polygon=1`);
      if (!res.ok) throw new Error('Search failed');
      const data: { results: OSMResult[] } = await res.json();

      const best = data.results[0];
      if (!best) {
        setSelectedPlace(null);
        setSelectedVet(null);
        setNearbyVets([]);
        setErrorMessage('No results found for that search.');
        return;
      }

      if (isVetResult(best)) {
        const vet: OSMVet = {
          id: best.place_id,
          name: getPrimaryLabel(best.display_name),
          lat: best.lat,
          lon: best.lon,
          address: best.display_name,
        };
        setSelectedPlace(null);
        setSelectedVet(vet);
        setNearbyVets([vet]);
        return;
      }

      setSelectedPlace(best);
      await runLocationSearch(best);
    } catch {
      setErrorMessage('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image
            src="https://images.unsplash.com/photo-1628009368231-7bb7cbcb8122?q=80&w=2000&auto=format&fit=crop"
            alt="Veterinary clinic"
            fill
            className={styles.heroImage}
            priority
          />
          <div className={styles.heroOverlay}></div>
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.glassCard}>
            <h1 className={styles.title}>Find Trusted Veterinary Care</h1>
            <p className={styles.subtitle}>
              Your cat&apos;s health is paramount. Search by postcode, city, or vet name — powered by OpenStreetMap.
            </p>

            <div ref={containerRef} className={styles.searchWrapper}>
              <form
                className={styles.searchForm}
                onSubmit={(e) => {
                  e.preventDefault();
                  void submitSearch();
                }}
              >
                <div className={styles.searchInputGroup}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>

                  <input
                    className={styles.searchInput}
                    type="text"
                    value={query}
                    placeholder="Search location or vet name…"
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSuggestionsOpen(true);
                    }}
                    onFocus={() => setSuggestionsOpen(true)}
                    aria-label="Search location or vet"
                    autoComplete="off"
                  />
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary ${styles.searchBtn}`}
                  disabled={searching || !query.trim()}
                >
                  {searching ? 'Searching…' : 'Search'}
                </button>
              </form>

              {suggestionsOpen && (suggestionsLoading || suggestions.length > 0) && (
                <div className={styles.suggestionsPanel} role="listbox" aria-label="Search suggestions">
                  {suggestionsLoading ? (
                    <div className={styles.suggestionLoading}>Loading suggestions…</div>
                  ) : (
                    suggestions.map((s) => (
                      <button
                        key={s.place_id}
                        type="button"
                        className={styles.suggestionItem}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => void selectSuggestion(s)}
                      >
                        {s.display_name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map + Results */}
      <section className={styles.directorySection}>
        <div className="container">
          <div className={styles.directoryHeader}>
            <h2>{titleText}</h2>
            <div className={styles.resultsMeta}>
              {selectedPlace && !selectedVet && (
                <span className={styles.resultsCount}>{nearbyVets.length} vet(s) found</span>
              )}
              {selectedVet && <span className={styles.resultsCount}>1 vet found</span>}
            </div>
          </div>

          <div className={styles.mapWrapper}>
            <VetFinderMap place={selectedPlace} vets={nearbyVets} selectedVet={selectedVet} />
          </div>

          {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

          {selectedPlace && !selectedVet && nearbyVets.length > 0 && (
            <div className={styles.directoryGrid}>
              {nearbyVets.map((vet) => (
                <div key={vet.id} className={styles.vetCard}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.vetName}>{vet.name}</h3>
                      <div className={styles.vetSpecialty}>Veterinary clinic</div>
                    </div>
                  </div>

                  <div className={styles.contactInfo}>
                    {vet.address && (
                      <div className={styles.infoRow}>
                        <svg
                          className={styles.infoIcon}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{vet.address}</span>
                      </div>
                    )}

                    {vet.phone && (
                      <div className={styles.infoRow}>
                        <svg
                          className={styles.infoIcon}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <span>{vet.phone}</span>
                      </div>
                    )}

                    {vet.openingHours && (
                      <div className={styles.infoRow}>
                        <svg
                          className={styles.infoIcon}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{vet.openingHours}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={styles.ctaBox}>
            <h3>Are you a registered veterinary professional?</h3>
            <p>
              Claim your practice profile or register your clinic to connect with thousands of responsible cat owners in your area.
            </p>
            <button className="btn" style={{ background: 'white', color: 'var(--secondary-color)' }}>
              Register Clinic
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
