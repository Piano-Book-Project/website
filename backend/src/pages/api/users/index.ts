import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { requirePermission, PERMISSIONS } from '../../../utils/auth';
import { securityHeaders, rateLimit, adminOnly, corsMiddleware } from '../../../utils/security';

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { search, role } = req.query;

            let whereClause: any = {};

            // 검색 조건
            if (search) {
                whereClause.OR = [
                    { username: { contains: search as string } },
                    { nickname: { contains: search as string } },
                ];
            }

            // 권한 필터
            if (role && role !== 'all') {
                whereClause.role = role;
            }

            console.log('Prisma query whereClause:', whereClause);

            const users = await prisma.user.findMany({
                where: whereClause,
                select: {
                    id: true,
                    username: true,
                    nickname: true,
                    role: true,
                    lastLoginAt: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            console.log('Found users:', users);
            res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users - Full error:', error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            res.status(500).json({ error: 'Failed to fetch users', details: error instanceof Error ? error.message : 'Unknown error' });
        }
    } else if (req.method === 'POST') {
        try {
            const { username, nickname, password, role } = req.body;

            // 필수 필드 검증
            if (!username || !nickname || !password) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // 비밀번호 해시화
            const hashedPassword = await bcrypt.hash(password, 12);

            const user = await prisma.user.create({
                data: {
                    username,
                    nickname,
                    password: hashedPassword,
                    role: role || 'user',
                },
                select: {
                    id: true,
                    username: true,
                    nickname: true,
                    role: true,
                    lastLoginAt: true,
                    createdAt: true,
                },
            });

            res.status(201).json(user);
        } catch (error: any) {
            if (error.code === 'P2002') {
                res.status(400).json({ error: 'Username already exists' });
            } else {
                console.error('Error creating user:', error);
                res.status(500).json({ error: 'Failed to create user' });
            }
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// 보안 미들웨어와 권한 체크를 적용한 핸들러 내보내기
export default corsMiddleware(
    securityHeaders(
        rateLimit(
            adminOnly(
                requirePermission(PERMISSIONS.USERS_READ)(handler)
            )
        )
    )
); 