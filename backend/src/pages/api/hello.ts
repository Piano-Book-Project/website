// 타입 정의 (직접 작성)
type NextApiRequest = {
    method?: string;
    body?: any;
    query: { [key: string]: string | string[] };
    headers: { [key: string]: string | string[] | undefined };
};
type NextApiResponse = {
    status: (code: number) => NextApiResponse;
    json: (body: any) => void;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({ message: 'Hello from Next.js API!' });
} 