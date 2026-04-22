import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type OverpassElement = {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type OverpassResponse = {
  elements?: OverpassElement[];
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

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatAddress(tags: Record<string, string> | undefined) {
  if (!tags) return undefined;

  const full = tags['addr:full'];
  if (full) return full;

  const street = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ').trim();
  const city = tags['addr:city'] || tags['addr:town'] || tags['addr:village'];
  const postcode = tags['addr:postcode'];

  const parts = [street, city, postcode].filter(Boolean);
  if (parts.length > 0) return parts.join(', ');

  return undefined;
}

function getPhone(tags: Record<string, string> | undefined) {
  if (!tags) return undefined;
  return tags['phone'] || tags['contact:phone'] || tags['mobile'] || tags['contact:mobile'];
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const lat = Number(url.searchParams.get('lat'));
  const lon = Number(url.searchParams.get('lon'));
  const radius = clampNumber(Number(url.searchParams.get('radius') ?? '10000') || 10000, 1000, 50000);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ vets: [], error: 'Invalid coordinates' }, { status: 400 });
  }

  const host = request.headers.get('host') ?? 'localhost';
  const userAgent = `PurrfectStart Vet Finder (+https://${host})`;

  const query = `
[out:json][timeout:25];
(
  node["amenity"="veterinary"](around:${radius},${lat},${lon});
  way["amenity"="veterinary"](around:${radius},${lat},${lon});
  relation["amenity"="veterinary"](around:${radius},${lat},${lon});
);
out center tags;
`;

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: {
      'User-Agent': userAgent,
      Referer: `https://${host}/vet-finder`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Accept: 'application/json',
    },
    body: new URLSearchParams({ data: query }),
    next: { revalidate: 60 * 60 },
  });

  if (!res.ok) {
    return NextResponse.json({ vets: [], error: 'Upstream vets search failed' }, { status: 502 });
  }

  const raw: unknown = await res.json();
  const data = raw as OverpassResponse;
  const elements = Array.isArray(data.elements) ? data.elements : [];

  const vets: OSMVet[] = [];

  for (const el of elements) {
    const coords = el.type === 'node' ? { lat: el.lat, lon: el.lon } : el.center;
    const candidateLat = coords?.lat;
    const candidateLon = coords?.lon;
    if (
      typeof candidateLat !== 'number' ||
      typeof candidateLon !== 'number' ||
      !Number.isFinite(candidateLat) ||
      !Number.isFinite(candidateLon)
    ) {
      continue;
    }

    const tags = el.tags;
    const name = tags?.name?.trim() || 'Veterinary clinic';

    vets.push({
      id: `${el.type}/${el.id}`,
      name,
      lat: candidateLat,
      lon: candidateLon,
      address: formatAddress(tags),
      phone: getPhone(tags),
      openingHours: tags?.opening_hours,
    });
  }

  // Keep response reasonably small for UI + API friendliness.
  const limited = vets.slice(0, 60);

  return NextResponse.json(
    { vets: limited },
    {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=3600',
      },
    },
  );
}
