import prisma from '../config/db';

export const getUserByUsercode = async (usercode: string) =>
  await prisma.admin.findUnique({
    where: {
      usercode: usercode,
      isDeleted: false,
    },
  });
