import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../server/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-very-secret-key';
const REFRESH_SECRET = 'your-very-refresh-secret';

export async function POST(req: NextRequest) {
  try {
    const { id, pw } = await req.json();
    if (!id || !pw) {
      return NextResponse.json(
        { success: false, error: '아이디와 비밀번호를 입력하세요.' },
        { status: 400 },
      );
    }
    const admin = await prisma.admin.findUnique({ where: { username: id } });
    if (!admin || admin.password !== pw) {
      return NextResponse.json(
        { success: false, error: '아이디 또는 비밀번호가 틀립니다.' },
        { status: 401 },
      );
    }
    // Access Token (만료 15분)
    const accessToken = jwt.sign(
      { id: admin.id, username: admin.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '15m' },
    );
    // Refresh Token (만료 30일)
    const refreshToken = jwt.sign(
      { id: admin.id, username: admin.username, role: 'admin' },
      REFRESH_SECRET,
      { expiresIn: '30d' },
    );
    // DB에 refreshToken 저장
    await prisma.admin.update({ where: { id: admin.id }, data: { refreshToken } });
    // 쿠키로 저장
    const res = NextResponse.json({ success: true, accessToken, refreshToken });
    res.headers.set(
      'Set-Cookie',
      `admin_token=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=900`,
    ); // 15분
    res.headers.append(
      'Set-Cookie',
      `refresh_token=${refreshToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`,
    ); // 30일
    return res;
  } catch (e) {
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
