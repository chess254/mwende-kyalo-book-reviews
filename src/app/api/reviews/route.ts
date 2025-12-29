import { NextResponse } from 'next/server';

const WP_API = 'https://public-api.wordpress.com/rest/v1.1/sites/mwendekyalobookreviews.wordpress.com/posts/';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const perPage = '100'; // Max per request

  try {
    const res = await fetch(`${WP_API}?number=${perPage}&page=${page}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}