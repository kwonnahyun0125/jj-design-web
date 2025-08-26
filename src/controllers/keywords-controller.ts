import { Request, Response } from 'express';
import { KeywordsRepository } from '../repositories/keywords-repository';
import { GetKeywordsQuery } from '../types/keyword-type';

const repo = new KeywordsRepository();

export async function getKeywords(req: Request, res: Response) {
  try {
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 20);
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;

    const sortRaw = (req.query.sort as string) || 'createdAt';
    const orderRaw = (req.query.order as string) || 'desc';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sort = (['name', 'createdAt'] as const).includes(sortRaw as any)
      ? (sortRaw as 'name' | 'createdAt')
      : 'createdAt';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const order = (['asc', 'desc'] as const).includes(orderRaw as any)
      ? (orderRaw as 'asc' | 'desc')
      : 'desc';

    const query: GetKeywordsQuery = { page, pageSize, q, sort, order };
    const result = await repo.findKeywords(query);
    res.json(result);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // 로깅 필요 시 추가
    res.status(500).json({ message: 'INTERNAL_SERVER_ERROR' });
  }
}
