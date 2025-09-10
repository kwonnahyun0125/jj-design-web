import { z } from 'zod';

export const listFurnitureQuerySchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  q: z.string().optional(),
  sort: z.enum(['recent', 'name_asc', 'name_desc']).optional(),
});

// 생성 및 수정 공통 스키마
export const createFurnitureSchema = z.object({
  name: z.string().min(1).max(255),
  address: z.string().min(1).max(255),
  phoneNumber: z.string().max(20).optional().nullable(),
  description: z.string().optional().nullable(),
  introText: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
});

export const updateFurnitureSchema = createFurnitureSchema.partial();

export type ListFurnitureQuery = z.infer<typeof listFurnitureQuerySchema>;
export type CreateFurnitureInput = z.infer<typeof createFurnitureSchema>;
export type UpdateFurnitureInput = z.infer<typeof updateFurnitureSchema>;

// API 응답에 사용하는 타입
export type FurnitureListItemDto = {
  id: number;
  name: string;
  address: string;
  coverImageUrl: string | null;
};

export type FurnitureImageDto = { imageUrl: string };

// 상세조회 API 응답에 사용하는 타입
export type FurnitureDetailDto = {
  id: number;
  name: string;
  address: string;
  phoneNumber: string | null;
  description: string | null;
  introText: string | null;
  coverImageUrl: string | null;
  images: FurnitureImageDto[];
  createdAt: Date;
  updatedAt: Date;
};

// DB에서 직접 사용하는 타입
export type FurnitureListRecord = {
  id: number;
  name: string;
  address: string;
  imageUrl: string | null;
};
