import { z } from 'zod';

// 목록 조회 API 쿼리 파라미터
export const listQuerySchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  q: z.string().optional(),
  sort: z.enum(['recent', 'name_asc', 'name_desc']).optional(),
  openNow: z.coerce.boolean().optional(),
});

// 생성 및 수정 공통 스키마
export const createShowroomSchema = z.object({
  name: z.string().min(1).max(255),
  address: z.string().min(1).max(255),
  phoneNumber: z.string().max(20).optional().nullable(),
  description: z.string().optional().nullable(),
  introText: z.string().optional().nullable(),
  mapUrl: z.string().url().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  openMinutes: z.number().int().min(0).max(1440).optional().nullable(),
  closeMinutes: z.number().int().min(0).max(1440).optional().nullable(),
  weeklyOpenDays: z.string().optional().nullable(),
  weeklyCloseDays: z.string().optional().nullable(),
});

export const updateShowroomSchema = createShowroomSchema.partial();

export type ListShowroomQuery = z.infer<typeof listQuerySchema>;
export type CreateShowroomInput = z.infer<typeof createShowroomSchema>;
export type UpdateShowroomInput = z.infer<typeof updateShowroomSchema>;

// 목록 조회 API 응답 형태
export type ShowroomListItemDto = {
  id: number;
  name: string;
  address: string;
  coverImageUrl: string | null;
  todayHoursText: string | null;
};

// 공간 이미지
export type ShowroomSpaceDto = {
  imageUrl: string;
  title: string | null;
  description: string | null;
};

// 상세 조회 API 응답 형태
export type ShowroomDetailDto = {
  id: number;
  name: string;
  address: string;
  phoneNumber: string | null;
  description: string | null;
  introText: string | null;
  mapUrl: string | null;
  coverImageUrl: string | null;
  hours: {
    open: string | null;
    close: string | null;
    weeklyOpenDays: string | null;
    weeklyCloseDays: string | null;
  };
  spaces: ShowroomSpaceDto[];
  createdAt: Date;
  updatedAt: Date;
};

// DB에서 조회되는 데이터 형태
export type ShowroomListRecord = {
  id: number;
  name: string;
  address: string;
  imageUrl: string | null;
  openMinutes: number | null;
  closeMinutes: number | null;
  weeklyOpenDays: string | null;
  weeklyCloseDays: string | null;
};
