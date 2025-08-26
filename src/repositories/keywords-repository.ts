import prisma from '../config/db';
import { GetKeywordsQuery, KeywordList } from '../types/keyword-type';
import { Paged } from '../types/project-type';

export class KeywordsRepository {
  async findKeywords(query: GetKeywordsQuery): Promise<Paged<KeywordList>> {
    const page = Math.max(1, Number(query.page || 1));
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize || 20)));
    const skip = (page - 1) * pageSize;

    const where = {
      ...(query.q ? { name: { contains: query.q, mode: 'insensitive' as const } } : {}),
    };

    const sort = (query.sort ?? 'createdAt') as 'name' | 'createdAt';
    const order = (query.order ?? 'desc') as 'asc' | 'desc';

    const [total, rows] = await Promise.all([
      prisma.keyword.count({ where }),
      prisma.keyword.findMany({
        where,
        orderBy: { [sort]: order },
        skip,
        take: pageSize,
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      }),
    ]);

    const mapped: KeywordList[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      createdAt: r.createdAt.toISOString(),
    }));

    return { page, pageSize, total, rows: mapped };
  }
}
