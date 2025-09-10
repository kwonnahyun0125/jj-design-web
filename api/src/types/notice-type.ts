export interface RequestNoticeDto {
  title: string;
  content: string;
}
export interface GetNoticesQuery {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
  isDeleted?: boolean;
}

export interface NoticeListItem {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string | null;
}

export interface NoticeDetail extends NoticeListItem {
  content: string;
}
