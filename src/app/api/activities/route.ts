import { NextResponse } from 'next/server';
import {
  CSV_URL,
  parseCSV,
  transformRowsToActivities,
  FALLBACK_ACTIVITIES,
} from '@/lib/activities';

// Force real-time execution with ZERO server-side caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Append timestamp cache-buster to bypass Google Sheet CDN caching
    const cacheBusterUrl = `${CSV_URL}&_cb=${Date.now()}`;

    const res = await fetch(cacheBusterUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        Pragma: 'no-cache',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      console.warn(`Failed to fetch CSV, status: ${res.status}`);
      return NextResponse.json(
        {
          activities: FALLBACK_ACTIVITIES,
          source: 'fallback',
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      );
    }

    const csvText = await res.text();
    const rows = parseCSV(csvText);
    const activities = transformRowsToActivities(rows);

    if (activities.length === 0) {
      return NextResponse.json(
        {
          activities: FALLBACK_ACTIVITIES,
          source: 'fallback',
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      );
    }

    return NextResponse.json(
      {
        activities,
        source: 'live',
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching activities CSV:', error);
    return NextResponse.json(
      {
        activities: FALLBACK_ACTIVITIES,
        source: 'fallback',
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  }
}
