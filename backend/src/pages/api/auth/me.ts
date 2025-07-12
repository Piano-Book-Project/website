import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token' });
    }
    const token = auth.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(401).json({ error: 'Invalid user' });
        return res.status(200).json({ id: user.id, username: user.username, role: user.role });
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
} 