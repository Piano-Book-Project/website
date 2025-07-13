import { NextApiRequest, NextApiResponse } from 'next';
import { specs } from '../../utils/swagger';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(specs);
} 