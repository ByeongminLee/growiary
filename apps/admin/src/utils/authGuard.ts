import { NextResponse } from 'next/server';

function authGuard(authHeader: string | null) {
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const API_AUTHORIZATION_KEY = process.env.API_AUTHORIZATION_KEY ?? '';

  if (!API_AUTHORIZATION_KEY) {
    return NextResponse.json(
      { error: 'NOT FOUND API AUTHORIZATION KEY' },
      { status: 401 },
    );
  }

  if (authHeader !== `Bearer ${API_AUTHORIZATION_KEY}`) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 403 });
  }
}

export default authGuard;
