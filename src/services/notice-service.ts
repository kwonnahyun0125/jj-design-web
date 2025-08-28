import { NoticeRepository } from '../repositories/notice-repository';
import { BadRequestError, NotFoundError } from '../types/error-type';
import { CreateNoticeDto, GetNoticesQuery, UpdateNoticeDto } from '../types/notice-type';

export class NoticeService {
  private NoticeRepository = new NoticeRepository();

  async createNotice(data: CreateNoticeDto) {
    if (!data.title) throw new BadRequestError('제목을 입력하세요.');
    if (!data.content) throw new BadRequestError('내용을 입력하세요.');

    return this.NoticeRepository.createNotice({
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl ?? null,
    });
  }

  async getNotices(query: GetNoticesQuery) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);

    const orderBy: 'createdAt' | 'updatedAt' = ['createdAt', 'updatedAt'].includes(
      query.orderBy ?? ''
    )
      ? query.orderBy!
      : 'createdAt';

    const order: 'asc' | 'desc' = ['asc', 'desc'].includes(query.order ?? '')
      ? query.order!
      : 'desc';

    const isDeleted = typeof query.isDeleted === 'boolean' ? query.isDeleted : undefined;
    const search = typeof query.search === 'string' ? query.search : undefined;

    return this.NoticeRepository.findNoticeMany({
      page,
      limit,
      orderBy,
      order,
      isDeleted,
      search,
    });
  }

  async getNoticeDetail(noticeId: number) {
    const notice = await this.NoticeRepository.findNoticeDetail(noticeId);
    if (!notice) throw new NotFoundError('공지사항을 찾을 수 없습니다.');
    return notice;
  }

  async updateNotice(noticeId: number, data: UpdateNoticeDto) {
    const notice = await this.NoticeRepository.findNoticeById(noticeId);
    if (!notice || notice.isDeleted) throw new NotFoundError('공지사항을 찾을 수 없습니다.');

    return this.NoticeRepository.updateNotice(noticeId, data);
  }

  async deleteNotice(noticeId: number) {
    const notice = await this.NoticeRepository.findNoticeById(noticeId);
    if (!notice || notice.isDeleted) throw new NotFoundError('공지사항을 찾을 수 없습니다.');
    return this.NoticeRepository.softDelete(noticeId);
  }
}
