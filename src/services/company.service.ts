import { Request } from 'express';
import prisma from '../config/db';

export const getCompany = async (_req: Request) => {
  const companyId = 1;

  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  return company;
};

export const updateCompany = async (req: Request) => {
  const companyId = 1;
  const { name, address, phone, owner, email, business, naver, instagram } = req.body;

  const company = await prisma.company.update({
    where: { id: companyId },
    data: {
      name,
      address,
      phone,
      owner,
      email,
      business,
      naver,
      instagram,
    },
  });

  return company;
};
