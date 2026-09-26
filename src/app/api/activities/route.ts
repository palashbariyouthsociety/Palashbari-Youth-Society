import { NextResponse } from 'next/server';
import {
  CSV_URL,
  parseCSV,
  transformRowsToActivities,
  FALLBACK_ACTIVITIES,
} from '@/lib/activities';

// Set dynamic revalidation
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const res = await fetch(CSV_URL, {
      next: { revalidate: 60 },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      console.warn(`Failed to fetch CSV, status: ${res.status}`);
      return NextResponse.json({
        activities: FALLBACK_ACTIVITIES,
        source: 'fallback',
        timestamp: new Date().toISOString(),
      });
    }

    const csvText = await res.text();
    const rows = parseCSV(csvText);
    const activities = transformRowsToActivities(rows);

    if (activities.length === 0) {
      return NextResponse.json({
        activities: FALLBACK_ACTIVITIES,
        source: 'fallback',
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      activities,
      source: 'live',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching activities CSV:', error);
    return NextResponse.json({
      activities: FALLBACK_ACTIVITIES,
      source: 'fallback',
      timestamp: new Date().toISOString(),
    });
  }
}
