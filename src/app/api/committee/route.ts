import { NextResponse } from 'next/server';
import { COMMITTEE_CSV_URL, parseCommitteeCSV, FALLBACK_COMMITTEE } from '@/lib/committee';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Add cache busting param
    const cacheBusterUrl = `${COMMITTEE_CSV_URL}&_cb=${Date.now()}`;
    const res = await fetch(cacheBusterUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });

    if (!res.ok) {
      console.warn(`[Committee API] Failed to fetch sheet: HTTP ${res.status}`);
      return NextResponse.json(
        {
          success: true,
          members: FALLBACK_COMMITTEE,
          total: FALLBACK_COMMITTEE.length,
          source: 'fallback',
        },
        {
          headers: {
            'Cache-Control': 'no-store, max-age=0, must-revalidate',
          },
        }
      );
    }

    const csvText = await res.text();
    const members = parseCommitteeCSV(csvText);

    return NextResponse.json(
      {
        success: true,
        members,
        total: members.length,
        source: 'live',
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error) {
    console.error('[Committee API Error]:', error);
    return NextResponse.json(
      {
        success: true,
        members: FALLBACK_COMMITTEE,
        total: FALLBACK_COMMITTEE.length,
        source: 'fallback',
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      }
    );
  }
}
