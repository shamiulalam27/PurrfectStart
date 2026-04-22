import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type BoundingBox = [number, number, number, number]; // [south, north, west, east]

type NominatimResult = {
  place_id: number | string;
  display_name: string;
  lat: string;
  lon: string;
  boundingbox?: [string, string, string, string];
  class?: string;
  type?: string;
  geojson?: unknown;
};

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

function toNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function mapResult(r: NominatimResult): OSMResult | null {
  const lat = toNumber(r.lat);
  const lon = toNumber(r.lon);
  if (lat === null || lon === null) return null;

  let boundingbox: BoundingBox | undefined;
  if (r.boundingbox && r.boundingbox.length === 4) {
    const south = toNumber(r.boundingbox[0]);
    const north = toNumber(r.boundingbox[1]);
    const west = toNumber(r.boundingbox[2]);
    const east = toNumber(r.boundingbox[3]);
    if (south !== null && north !== null && west !== null && east !== null) {
      boundingbox = [south, north, west, east];
    }
  }

  return {
    place_id: String(r.place_id),
    display_name: r.display_name,
    lat,
    lon,
    boundingbox,
    class: r.class,
    type: r.type,
    geojson: r.geojson,
  };
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const placeId = url.searchParams.get('place_id')?.trim();

  if (!placeId) {
    return NextResponse.json({ result: null }, { status: 400 });
  }

  const host = request.headers.get('host') ?? 'localhost';
  const userAgent = `PurrfectStart Vet Finder (+https://${host})`;

  const nominatimUrl = new URL('https://nominatim.openstreetmap.org/lookup');
  nominatimUrl.searchParams.set('place_ids', placeId);
  nominatimUrl.searchParams.set('format', 'jsonv2');
  nominatimUrl.searchParams.set('addressdetails', '0');
  nominatimUrl.searchParams.set('polygon_geojson', '1');

  const res = await fetch(nominatimUrl.toString(), {
    headers: {
      'User-Agent': userAgent,
      Referer: `https://${host}/vet-finder`,
      Accept: 'application/json',
    },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!res.ok) {
    return NextResponse.json({ result: null, error: 'Upstream lookup failed' }, { status: 502 });
  }

  const raw: unknown = await res.json();
  const list = Array.isArray(raw) ? (raw as NominatimResult[]) : [];
  const first = list[0] ? mapResult(list[0]) : null;

  return NextResponse.json(
    { result: first },
    {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=86400',
      },
    },
  );
}
