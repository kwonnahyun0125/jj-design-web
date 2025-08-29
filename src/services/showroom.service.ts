import type { Prisma } from '@prisma/client';
import { ShowroomRepository } from '../repositories/showroom.repository';
import { BadRequestError, NotFoundError } from '../types/error-type';
import { normalizePageParams } from '../utils/pagination';
import type {
  CreateShowroomInput,
  UpdateShowroomInput,
  ListShowroomQuery,
} from '../types/showroom.schema';

// eslint-disable-next-line @typescript-eslint/naming-convention
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const toHHMM = (mins: number | null | undefined): string | null => {
  if (mins == null) return null;
  const h = String(Math.floor(mins / 60)).padStart(2, '0');
  const m = String(mins % 60).padStart(2, '0');
  return `${h}:${m}`;
};

const parseCsv = (csv?: string | null): Set<string> =>
  new Set(
    (csv ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  );

const isOpenNow = (
  it: {
    weeklyOpenDays?: string | null;
    weeklyCloseDays?: string | null;
    openMinutes?: number | null;
    closeMinutes?: number | null;
  },
  dayIndex = new Date().getDay()
): boolean => {
  const day = WEEKDAYS[dayIndex];
  const openDays = parseCsv(it.weeklyOpenDays);
  const closeDays = parseCsv(it.weeklyCloseDays);
  if (!openDays.has(day) || closeDays.has(day)) return false;
  if (it.openMinutes == null || it.closeMinutes == null) return false;

  const now = new Date();
  const nowM = now.getHours() * 60 + now.getMinutes();
  const o = it.openMinutes!;
  const c = it.closeMinutes!;
  // 일반/야간 영업 모두 처리
  return c > o ? nowM >= o && nowM < c : nowM >= o || nowM < c;
};

// 레포 list select와 맞춘 레코드 타입
type ShowroomListRecord = {
  id: number;
  name: string;
  address: string;
  imageUrl: string | null;
  openMinutes: number | null;
  closeMinutes: number | null;
  weeklyOpenDays: string | null;
  weeklyCloseDays: string | null;
};

export class ShowroomService {
  static async create(input: CreateShowroomInput) {
    const dup = await ShowroomRepository.findUniqueByName(input.name);
    if (dup) throw new BadRequestError('Showroom name already exists');

    const created = await ShowroomRepository.create({ ...input });
    const detail = await ShowroomRepository.findById(created.id);
    if (!detail) throw new NotFoundError('Showroom not found');
    return shapeDetail(detail);
  }

  static async update(id: number, input: UpdateShowroomInput) {
    const existing = await ShowroomRepository.findById(id);
    if (!existing) throw new NotFoundError('Showroom not found');

    await ShowroomRepository.update(id, {
      name: input.name ?? existing.name,
      address: input.address ?? existing.address,
      phoneNumber: input.phoneNumber ?? existing.phoneNumber,
      description: input.description ?? existing.description,
      introText: input.introText ?? existing.introText,
      mapUrl: input.mapUrl ?? existing.mapUrl,
      imageUrl: input.imageUrl ?? existing.imageUrl,
      openMinutes: input.openMinutes ?? existing.openMinutes,
      closeMinutes: input.closeMinutes ?? existing.closeMinutes,
      weeklyOpenDays: input.weeklyOpenDays ?? existing.weeklyOpenDays,
      weeklyCloseDays: input.weeklyCloseDays ?? existing.weeklyCloseDays,
    });

    const detail = await ShowroomRepository.findById(id);
    if (!detail) throw new NotFoundError('Showroom not found');
    return shapeDetail(detail);
  }

  static async remove(id: number) {
    const existing = await ShowroomRepository.findById(id);
    if (!existing) throw new NotFoundError('Showroom not found');
    await ShowroomRepository.softDelete(id);
    return { ok: true };
  }

  static async getById(id: number) {
    const detail = await ShowroomRepository.findById(id);
    if (!detail) throw new NotFoundError('Showroom not found');
    return shapeDetail(detail);
  }

  static async list(query: ListShowroomQuery) {
    const { skip, take, page, pageSize } = normalizePageParams({
      page: query.page,
      pageSize: query.pageSize,
      maxPageSize: 100,
    });

    const where: Prisma.ShowroomWhereInput = { isDeleted: false };
    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: 'insensitive' } },
        { address: { contains: query.q, mode: 'insensitive' } },
        { description: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    let orderBy: Prisma.ShowroomOrderByWithRelationInput = { createdAt: 'desc' };
    if (query.sort === 'name_asc') orderBy = { name: 'asc' };
    if (query.sort === 'name_desc') orderBy = { name: 'desc' };
    if (query.sort === 'recent') orderBy = { createdAt: 'desc' };

    const { items, total } = await ShowroomRepository.list({ where, skip, take, orderBy });

    const dayIdx = new Date().getDay();
    const filtered = (items as ShowroomListRecord[]).filter((it) =>
      query.openNow ? isOpenNow(it, dayIdx) : true
    );

    const shaped = filtered.map((it) => ({
      id: it.id,
      name: it.name,
      address: it.address,
      coverImageUrl: it.imageUrl ?? null,
      todayHoursText:
        it.openMinutes == null || it.closeMinutes == null
          ? null
          : `${toHHMM(it.openMinutes)} - ${toHHMM(it.closeMinutes)}`,
    }));

    return {
      page,
      pageSize,
      total: query.openNow ? shaped.length : total,
      items: shaped,
    };
  }
}

const shapeDetail = (
  show: NonNullable<Awaited<ReturnType<typeof ShowroomRepository.findById>>>
) => ({
  id: show.id,
  name: show.name,
  introText: show.introText,
  description: show.description,
  address: show.address,
  phoneNumber: show.phoneNumber,
  mapUrl: show.mapUrl,
  coverImageUrl: show.imageUrl ?? null,
  hours: {
    open: toHHMM(show.openMinutes),
    close: toHHMM(show.closeMinutes),
    weeklyOpenDays: show.weeklyOpenDays, // "Mon,Tue,Wed..."
    weeklyCloseDays: show.weeklyCloseDays,
  },
  spaces: show.showroomImages.map((si) => ({
    imageUrl: si.image.url,
    title: null,
    description: null,
  })),
  services: [
    { code: 'APT', name: '아파트 전문', description: '오랜 경험의 아파트 전문성', iconUrl: null },
    {
      code: 'HOUSE',
      name: '전원주택·노후주택',
      description: '공간을 새롭게 재구성',
      iconUrl: null,
    },
    { code: 'RETAIL', name: '상업공간', description: '공간별 전략과 경험 설계', iconUrl: null },
    {
      code: 'BRANDING',
      name: '브랜딩·스타일링',
      description: '아이덴티티가 녹아든 디테일',
      iconUrl: null,
    },
  ],
});
