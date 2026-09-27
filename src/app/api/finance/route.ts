import { NextResponse } from 'next/server';
import {
  FINANCE_CSV_URL,
  parseFinanceCSV,
  calculateFinanceSummary,
  FALLBACK_TRANSACTIONS,
} from '@/lib/finance';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const cacheBusterUrl = `${FINANCE_CSV_URL}&_cb=${Date.now()}`;
    const res = await fetch(cacheBusterUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });

    if (!res.ok) {
      console.warn(`[Finance API] Failed to fetch CSV sheet: HTTP ${res.status}`);
      const summary = calculateFinanceSummary(FALLBACK_TRANSACTIONS);
      return NextResponse.json(
        {
          success: true,
          transactions: FALLBACK_TRANSACTIONS,
          summary,
          source: 'fallback',
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            'Cache-Control': 'no-store, max-age=0, must-revalidate',
          },
        }
      );
    }

    const csvText = await res.text();
    const transactions = parseFinanceCSV(csvText);
    const summary = calculateFinanceSummary(
      transactions.length > 0 ? transactions : FALLBACK_TRANSACTIONS
    );

    return NextResponse.json(
      {
        success: true,
        transactions: transactions.length > 0 ? transactions : FALLBACK_TRANSACTIONS,
        summary,
        source: transactions.length > 0 ? 'live' : 'fallback',
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
    console.error('[Finance API Error]:', error);
    const summary = calculateFinanceSummary(FALLBACK_TRANSACTIONS);
    return NextResponse.json(
      {
        success: true,
        transactions: FALLBACK_TRANSACTIONS,
        summary,
        source: 'fallback',
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      }
    );
  }
}
