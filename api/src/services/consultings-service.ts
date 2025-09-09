import { Request } from 'express';
import prisma from '../config/db';
import { BadRequestError } from '../types/error-type';
import { ConsultingStatus, ConsultingType } from '@prisma/client';

export const createConsulting = async (req: Request) => {
  const { name, phone, address, type, size, budget, preferredDate, note, isAgreeTerms } = req.body;

  if (
    !name?.trim() ||
    !phone?.trim() ||
    !address?.trim() ||
    !type ||
    !size?.trim() ||
    !budget?.trim() ||
    !preferredDate
  ) {
    throw new BadRequestError('Invalid request body');
  }

  if (!(type in ConsultingType)) {
    throw new BadRequestError('Invalid consulting type');
  }

  const parsedPreferredDate = new Date(preferredDate);
  if (isNaN(parsedPreferredDate.getTime())) {
    throw new BadRequestError('Invalid date format');
  }

  return await prisma.consulting.create({
    data: {
      name,
      phone,
      address,
      type,
      size,
      budget,
      preferredDate: parsedPreferredDate,
      note: note ?? null,
      isAgreeTerms: Boolean(isAgreeTerms),
    },
  });
};

export const getConsultingList = async (req: Request) => {
  const { page, size, keyword, sort } = req.query;

  const take = size ? parseInt(size as string, 10) || 10 : 10;
  const skip = page ? (parseInt(page as string, 10) - 1) * take : 0;
  const orderBy =
    (sort as string) === 'oldest' ? { createdAt: 'asc' as const } : { createdAt: 'desc' as const };

  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword as string, mode: 'insensitive' as const } },
          { phone: { contains: keyword as string, mode: 'insensitive' as const } },
          { address: { contains: keyword as string, mode: 'insensitive' as const } },
          { type: { equals: keyword as ConsultingType } },
        ],
      }
    : {};

  const list = await prisma.consulting.findMany({
    where,
    take,
    skip,
    orderBy,
  });

  const totalCount = await prisma.consulting.count({
    where,
  });

  return {
    totalCount,
    list,
  };
};

export const updateConsulting = async (req: Request) => {
  const { id } = req.params;
  const { status, note } = req.body;

  if (!id) {
    throw new BadRequestError();
  }

  if (!(status in ConsultingStatus)) {
    throw new BadRequestError();
  }

  return await prisma.consulting.update({
    where: { id: Number(id) },
    data: {
      status: status ?? ConsultingStatus.UNCHECKED,
      note: note ?? null,
    },
  });
};

export const deleteConsulting = async (req: Request) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError();
  }

  return await prisma.consulting.delete({
    where: { id: Number(id) },
  });
};

export const getConsultingDetail = async (req: Request) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError();
  }

  return await prisma.consulting.findUnique({
    where: { id: Number(id) },
  });
};
