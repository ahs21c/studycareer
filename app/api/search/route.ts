import { NextRequest, NextResponse } from 'next/server'
import { searchCompanies } from '@/lib/supabase/queries'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')
  if (!query || query.length < 2) return NextResponse.json([])
  try {
    const data = await searchCompanies(query, 8)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
