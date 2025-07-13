import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { applySecurityMiddleware } from '../../../utils/security';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: 사용자 상세 조회
 *     description: 특정 사용자의 상세 정보를 조회합니다.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 사용자 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: 사용자 정보 수정
 *     description: 특정 사용자의 정보를 수정합니다.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 로그인용 사용자명
 *               nickname:
 *                 type: string
 *                 description: 표시용 닉네임
 *               password:
 *                 type: string
 *                 description: 비밀번호 (선택사항)
 *               role:
 *                 type: string
 *                 enum: [super_admin, admin, moderator, user]
 *                 description: 사용자 권한
 *     responses:
 *       200:
 *         description: 사용자 수정 성공
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
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: 사용자 삭제
 *     description: 특정 사용자를 삭제합니다.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 사용자 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const userId = parseInt(id as string);

    if (isNaN(userId)) {
        return res.status(400).json({ code: 'INVALID_ID', message: 'Invalid user ID' });
    }

    if (req.method === 'GET') {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
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

            if (!user) {
                return res.status(404).json({ code: 'NOT_FOUND', message: 'User not found' });
            }

            return res.status(200).json({ code: 'SUCCESS', data: user });
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({ code: 'SERVER_ERROR', message: 'Failed to fetch user', detail: error instanceof Error ? error.message : String(error) });
        }
    } else if (req.method === 'PUT') {
        try {
            const { username, nickname, password, role } = req.body;

            if (!username || !nickname) {
                return res.status(400).json({ code: 'MISSING_FIELDS', message: 'Username and nickname are required' });
            }

            // 기존 사용자 확인
            const existingUser = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!existingUser) {
                return res.status(404).json({ code: 'NOT_FOUND', message: 'User not found' });
            }

            // 중복 사용자명 체크 (자신 제외)
            if (username !== existingUser.username) {
                const duplicateUser = await prisma.user.findUnique({
                    where: { username },
                });

                if (duplicateUser) {
                    return res.status(400).json({ code: 'USERNAME_EXISTS', message: 'Username already exists' });
                }
            }

            const updateData: any = {
                username,
                nickname,
                // sysadmin 역할은 super_admin으로 저장
                role: role === 'sysadmin' ? 'super_admin' : (role || existingUser.role),
            };

            // 비밀번호가 제공된 경우에만 업데이트
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 12);
                updateData.password = hashedPassword;
            }

            const user = await prisma.user.update({
                where: { id: userId },
                data: updateData,
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

            return res.status(200).json({ code: 'SUCCESS', data: user });
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ code: 'SERVER_ERROR', message: 'Failed to update user', detail: error instanceof Error ? error.message : String(error) });
        }
    } else if (req.method === 'DELETE') {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                return res.status(404).json({ code: 'NOT_FOUND', message: 'User not found' });
            }

            await prisma.user.delete({
                where: { id: userId },
            });

            return res.status(200).json({ code: 'SUCCESS', message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ code: 'SERVER_ERROR', message: 'Failed to delete user', detail: error instanceof Error ? error.message : String(error) });
        }
    } else {
        return res.status(405).json({ code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' });
    }
}

export default applySecurityMiddleware(handler); 