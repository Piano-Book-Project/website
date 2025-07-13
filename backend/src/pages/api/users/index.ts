import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { applySecurityMiddleware } from '../../../utils/security';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 사용자 목록 조회
 *     description: 검색 조건과 권한 필터를 적용하여 사용자 목록을 조회합니다.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 사용자명 또는 닉네임으로 검색
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [all, super_admin, admin, moderator, user]
 *         description: 권한별 필터링
 *     responses:
 *       200:
 *         description: 사용자 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: 새 사용자 생성
 *     description: 새로운 사용자를 생성합니다.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, nickname, password]
 *             properties:
 *               username:
 *                 type: string
 *                 description: 로그인용 사용자명
 *               nickname:
 *                 type: string
 *                 description: 표시용 닉네임
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *               role:
 *                 type: string
 *                 enum: [super_admin, admin, moderator, user]
 *                 default: admin
 *                 description: 사용자 권한
 *     responses:
 *       201:
 *         description: 사용자 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       405:
 *         description: 허용되지 않은 메서드
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { search, role } = req.query;

            const where: any = {};

            if (search) {
                // 검색어 길이 및 타입 유효성 검사 (1~30자, 문자열)
                if (typeof search !== 'string' || search.length < 1 || search.length > 30) {
                    return res.status(400).json({ code: 'INVALID_SEARCH', message: '검색어는 1~30자 이내의 문자열로 입력해 주세요.' });
                }
                where.OR = [
                    { username: { contains: search as string, mode: 'insensitive' } },
                    { nickname: { contains: search as string, mode: 'insensitive' } },
                ];
            }

            if (role && role !== 'all') {
                // sysadmin 역할은 super_admin과 동일하게 취급
                if (role === 'sysadmin') {
                    where.role = 'super_admin';
                } else {
                    where.role = role;
                }
            }

            const users = await prisma.user.findMany({
                where,
                select: {
                    id: true,
                    username: true,
                    nickname: true,
                    role: true,
                    lastLoginAt: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: {
                    createdAt: 'asc',
                },
            });

            return res.status(200).json({ code: 'SUCCESS', data: users });
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ code: 'SERVER_ERROR', message: 'Failed to fetch users', detail: error instanceof Error ? error.message : String(error) });
        }
    } else if (req.method === 'POST') {
        try {
            const { username, nickname, password, role } = req.body;

            if (!username || !nickname || !password) {
                return res.status(400).json({ code: 'MISSING_FIELDS', message: 'Missing required fields' });
            }

            // 중복 사용자명 체크
            const existingUser = await prisma.user.findUnique({
                where: { username },
            });

            if (existingUser) {
                return res.status(400).json({ code: 'USERNAME_EXISTS', message: 'Username already exists' });
            }

            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash(password, 12);

            const user = await prisma.user.create({
                data: {
                    username,
                    nickname,
                    password: hashedPassword,
                    // sysadmin 역할은 super_admin으로 저장
                    role: role === 'sysadmin' ? 'super_admin' : (role || 'admin'),
                },
                select: {
                    id: true,
                    username: true,
                    nickname: true,
                    role: true,
                    lastLoginAt: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            return res.status(201).json({ code: 'SUCCESS', data: user });
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ code: 'SERVER_ERROR', message: 'Failed to create user', detail: error instanceof Error ? error.message : String(error) });
        }
    } else {
        return res.status(405).json({ code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' });
    }
}

export default applySecurityMiddleware(handler); 