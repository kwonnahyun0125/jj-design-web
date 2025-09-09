import { Prisma } from '@prisma/client';
import { ShowroomRepository } from '../repositories/showroom.repository';
import { NotFoundError, BadRequestError } from '../types/error-type';
import { normalizePageParams } from '../utils/pagination';
import type {
  CreateShowroomInput,
  UpdateShowroomInput,
  ListShowroomQuery,
  ShowroomDetailDto,
  ShowroomListItemDto,
  ShowroomListRecord,
} from '../types/showroom.type';

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
  it: Pick<
    ShowroomListRecord,
    'weeklyOpenDays' | 'weeklyCloseDays' | 'openMinutes' | 'closeMinutes'
  >,
  dayIndex = new Date().getDay()
): boolean => {
  const day = WEEKDAYS[dayIndex];
  const openDays = parseCsv(it.weeklyOpenDays);
  const closeDays = parseCsv(it.weeklyCloseDays);
  if (!openDays.has(day) || closeDays.has(day)) return false;
  if (it.openMinutes == null || it.closeMinutes == null) return false;

  const now = new Date();
  const nowM = now.getHours() * 60 + now.getMinutes();
  const o = it.openMinutes!,
    c = it.closeMinutes!;
  return c > o ? nowM >= o && nowM < c : nowM >= o || nowM < c;
};

const toDetailDto = (
  show: NonNullable<Awaited<ReturnType<ShowroomRepository['findShowroomById']>>>
): ShowroomDetailDto => ({
  id: show.id,
  name: show.name,
  address: show.address,
  phoneNumber: show.phoneNumber ?? null,
  description: show.description ?? null,
  introText: show.introText ?? null,
  mapUrl: show.mapUrl ?? null,
  coverImageUrl: show.imageUrl ?? null,
  hours: {
    open: toHHMM(show.openMinutes),
    close: toHHMM(show.closeMinutes),
    weeklyOpenDays: show.weeklyOpenDays ?? null,
    weeklyCloseDays: show.weeklyCloseDays ?? null,
  },
  spaces:
    show.showroomImages?.map((si) => ({
      imageUrl: si.image.url,
      title: null,
      description: null,
    })) ?? [],
  createdAt: show.createdAt,
  updatedAt: show.updatedAt,
});

export class ShowroomService {
  private showroomRepository = new ShowroomRepository();

  async createShowroom(data: CreateShowroomInput) {
    const dup = await this.showroomRepository.findShowroomByName(data.name);
    if (dup) throw new BadRequestError('Showroom name already exists');
    return await this.showroomRepository.createShowroom(data);
  }

  async getShowrooms(query: ListShowroomQuery) {
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

    const { items, total } = await this.showroomRepository.listShowrooms({
      where,
      skip,
      take,
      orderBy,
    });
    const dayIdx = new Date().getDay();

    const filtered = (items as ShowroomListRecord[]).filter((it) =>
      query.openNow ? isOpenNow(it, dayIdx) : true
    );
    const shaped: ShowroomListItemDto[] = filtered.map((it) => ({
      id: it.id,
      name: it.name,
      address: it.address,
      coverImageUrl: it.imageUrl ?? null,
      todayHoursText:
        it.openMinutes == null || it.closeMinutes == null
          ? null
          : `${toHHMM(it.openMinutes)} - ${toHHMM(it.closeMinutes)}`,
    }));

    return { page, pageSize, total: query.openNow ? shaped.length : total, items: shaped };
  }

  async getShowroomById(id: number): Promise<ShowroomDetailDto> {
    const showroom = await this.showroomRepository.findShowroomById(id);
    if (!showroom) throw new NotFoundError('Showroom not found');
    return toDetailDto(showroom);
  }

  async updateShowroom(id: number, data: UpdateShowroomInput) {
    const showroom = await this.showroomRepository.findShowroomById(id);
    if (!showroom) throw new NotFoundError('Showroom not found');
    return await this.showroomRepository.updateShowroom(id, data);
  }

  async deleteShowroom(id: number) {
    const showroom = await this.showroomRepository.findShowroomById(id);
    if (!showroom) throw new NotFoundError('Showroom not found');
    return await this.showroomRepository.softDeleteShowroom(id);
  }
}
