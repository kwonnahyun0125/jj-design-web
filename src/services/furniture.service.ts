import { Prisma } from '@prisma/client';
import { FurnitureRepository } from '../repositories/furniture.repository';
import { NotFoundError, BadRequestError } from '../types/error-type';
import { normalizePageParams } from '../utils/pagination';
import type {
  CreateFurnitureInput,
  UpdateFurnitureInput,
  ListFurnitureQuery,
  FurnitureDetailDto,
  FurnitureListItemDto,
  FurnitureListRecord,
} from '../types/furniture.type';

const toDetailDto = (
  f: NonNullable<Awaited<ReturnType<FurnitureRepository['findFurnitureById']>>>
): FurnitureDetailDto => ({
  id: f.id,
  name: f.name,
  address: f.address,
  phoneNumber: f.phoneNumber ?? null,
  description: f.description ?? null,
  introText: f.introText ?? null,
  coverImageUrl: f.imageUrl ?? null,
  images: f.furnitureImages?.map((fi) => ({ imageUrl: fi.image.url })) ?? [],
  createdAt: f.createdAt,
  updatedAt: f.updatedAt,
});

export class FurnitureService {
  private furnitureRepository = new FurnitureRepository();

  async createFurniture(data: CreateFurnitureInput) {
    // showroom.service.ts 형식과 동일하게 '이름 중복' 선검사
    const dup = await this.furnitureRepository.findFurnitureByName(data.name);
    if (dup) throw new BadRequestError('Furniture name already exists');
    return await this.furnitureRepository.createFurniture(data);
  }

  async getFurnitures(query: ListFurnitureQuery) {
    const { skip, take, page, pageSize } = normalizePageParams({
      page: query.page,
      pageSize: query.pageSize,
      maxPageSize: 100,
    });

    const where: Prisma.FurnitureWhereInput = { isDeleted: false };
    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: 'insensitive' } },
        { address: { contains: query.q, mode: 'insensitive' } },
        { description: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    let orderBy: Prisma.FurnitureOrderByWithRelationInput = { createdAt: 'desc' };
    if (query.sort === 'name_asc') orderBy = { name: 'asc' };
    if (query.sort === 'name_desc') orderBy = { name: 'desc' };
    if (query.sort === 'recent') orderBy = { createdAt: 'desc' };

    const { items, total } = await this.furnitureRepository.listFurnitures({
      where,
      skip,
      take,
      orderBy,
    });

    const shaped: FurnitureListItemDto[] = (items as FurnitureListRecord[]).map((it) => ({
      id: it.id,
      name: it.name,
      address: it.address,
      coverImageUrl: it.imageUrl ?? null,
    }));

    return { page, pageSize, total, items: shaped };
  }

  async getFurnitureById(id: number): Promise<FurnitureDetailDto> {
    const f = await this.furnitureRepository.findFurnitureById(id);
    if (!f) throw new NotFoundError('Furniture not found');
    return toDetailDto(f);
  }

  async updateFurniture(id: number, data: UpdateFurnitureInput) {
    const f = await this.furnitureRepository.findFurnitureById(id);
    if (!f) throw new NotFoundError('Furniture not found');
    return await this.furnitureRepository.updateFurniture(id, data);
  }

  async deleteFurniture(id: number) {
    const f = await this.furnitureRepository.findFurnitureById(id);
    if (!f) throw new NotFoundError('Furniture not found');
    return await this.furnitureRepository.softDeleteFurniture(id);
  }
}
