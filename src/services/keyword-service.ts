import prisma from '../config/db';

export default class KeywordService {
  static async getKeywordList() {
    // 이름 기준 정렬, 필요한 필드만 반환
    return prisma.keyword.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }
}
