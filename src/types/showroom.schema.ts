import { z } from 'zod';

export const listQuerySchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  q: z.string().optional(),
  sort: z.enum(['recent', 'name_asc', 'name_desc']).optional(),
  openNow: z.coerce.boolean().optional(),
});

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
  weeklyOpenDays: z.string().optional().nullable(), // "Mon,Tue,Wed"
  weeklyCloseDays: z.string().optional().nullable(),
});

export const updateShowroomSchema = createShowroomSchema.partial();

// 타입 alias (서비스/레포에서 사용)
export type ListShowroomQuery = z.infer<typeof listQuerySchema>;
export type CreateShowroomInput = z.infer<typeof createShowroomSchema>;
export type UpdateShowroomInput = z.infer<typeof updateShowroomSchema>;
