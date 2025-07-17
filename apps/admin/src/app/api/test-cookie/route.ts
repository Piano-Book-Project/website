import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.json({ ok: true });
  res.headers.set('Set-Cookie', 'test_cookie=hello; Path=/; HttpOnly; SameSite=Lax; Max-Age=600');
  return res;
}
