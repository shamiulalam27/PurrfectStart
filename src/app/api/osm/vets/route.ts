import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
// Vercel-specific: allow this route more time when the provider is slow.
// (Actual max depends on plan, but exporting this is harmless elsewhere.)
export const maxDuration = 30;

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

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.nchc.org.tw/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
] as const;

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

async function fetchOverpass(
  endpoint: string,
  query: string,
  headers: Record<string, string>,
  timeoutMs: number,
): Promise<{ ok: true; data: OverpassResponse } | { ok: false; status?: number; error: string }> {
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
      },
      body: new URLSearchParams({ data: query }),
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!res.ok) {
      const snippet = (await res.text()).slice(0, 300);
      return {
        ok: false,
        status: res.status,
        error: snippet || `Overpass returned HTTP ${res.status}`,
      };
    }

    const raw: unknown = await res.json();
    return { ok: true, data: raw as OverpassResponse };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { ok: false, error: message };
  } finally {
    clearTimeout(timeoutHandle);
  }
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

  const upstreamHeaders = {
    'User-Agent': userAgent,
    Referer: `https://${host}/vet-finder`,
  };

  const attempts: Array<{ endpoint: string; status?: number; error?: string }> = [];
  let data: OverpassResponse | null = null;

  // Vercel serverless + public Overpass can be flaky (timeouts / 429 / IP blocks).
  // Try a few well-known public instances quickly.
  for (const endpoint of OVERPASS_ENDPOINTS) {
    const result = await fetchOverpass(endpoint, query, upstreamHeaders, 9000);
    if (result.ok) {
      data = result.data;
      break;
    }
    attempts.push({ endpoint, status: result.status, error: result.error });
  }

  if (!data) {
    return NextResponse.json(
      {
        vets: [],
        error: 'Could not reach the OpenStreetMap vet provider. Please try again shortly.',
        debug: {
          attempts: attempts.map((a) => ({ endpoint: a.endpoint, status: a.status })),
        },
      },
      { status: 502 },
    );
  }

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
