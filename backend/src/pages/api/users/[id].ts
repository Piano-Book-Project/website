import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { requireAnyPermission, PERMISSIONS } from '../../../utils/auth';
import { securityHeaders, rateLimit, adminOnly, corsMiddleware } from '../../../utils/security';

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const userId = parseInt(id as string);

    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
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
                },
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    } else if (req.method === 'PUT') {
        try {
            const { username, nickname, password, role } = req.body;

            // 필수 필드 검증
            if (!username || !nickname) {
                return res.status(400).json({ error: 'Username and nickname are required' });
            }

            // 기존 사용자 확인
            const existingUser = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            // 업데이트할 데이터 준비
            const updateData: any = {
                username,
                nickname,
                role: role || existingUser.role,
            };

            // 비밀번호가 제공된 경우에만 해시화하여 업데이트
            if (password && password.trim() !== '') {
                updateData.password = await bcrypt.hash(password, 12);
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    username: true,
                    nickname: true,
                    role: true,
                    lastLoginAt: true,
                    createdAt: true,
                },
            });

            res.status(200).json(updatedUser);
        } catch (error: any) {
            if (error.code === 'P2002') {
                res.status(400).json({ error: 'Username already exists' });
            } else {
                console.error('Error updating user:', error);
                res.status(500).json({ error: 'Failed to update user' });
            }
        }
    } else if (req.method === 'DELETE') {
        try {
            // 기존 사용자 확인
            const existingUser = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            // 사용자 삭제
            await prisma.user.delete({
                where: { id: userId },
            });

            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// 보안 미들웨어와 권한 체크를 적용한 핸들러 내보내기
export default corsMiddleware(
    securityHeaders(
        rateLimit(
            adminOnly(
                requireAnyPermission([
                    PERMISSIONS.USERS_READ,
                    PERMISSIONS.USERS_UPDATE,
                    PERMISSIONS.USERS_DELETE
                ])(handler)
            )
        )
    )
); 