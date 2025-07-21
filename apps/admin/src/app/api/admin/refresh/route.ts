import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../server/prisma';

const JWT_SECRET = 'your-very-secret-key';
const REFRESH_SECRET = 'your-very-refresh-secret';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refresh_token')?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: '리프레시 토큰이 없습니다.' },
        { status: 401 },
      );
    }
    // 토큰 검증 및 payload 추출
    let payload: JwtPayload;
    try {
      payload = jwt.verify(refreshToken, REFRESH_SECRET) as JwtPayload;
    } catch {
      return NextResponse.json(
        { success: false, error: '리프레시 토큰이 유효하지 않습니다.' },
        { status: 401 },
      );
    }
    // DB의 refreshToken과 일치하는지 확인
    const admin = await prisma.admin.findUnique({ where: { id: payload.id } });
    if (!admin || admin.refreshToken !== refreshToken) {
      return NextResponse.json(
        { success: false, error: '리프레시 토큰이 일치하지 않습니다.' },
        { status: 401 },
      );
    }
    // 새 Access Token 발급
    const accessToken = jwt.sign(
      { id: admin.id, username: admin.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '15m' },
    );
    const res = NextResponse.json({ success: true, accessToken });
    res.headers.set(
      'Set-Cookie',
      `admin_token=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=900`,
    ); // 15분
    return res;
  } catch (e) {
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
