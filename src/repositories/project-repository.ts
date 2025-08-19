import db from '../config/db';
import { Prisma } from '../generated/prisma';

export class ProjectRepository {
  async createProject(data: Prisma.ProjectCreateInput) {
    return await db.project.create({ data });
  }
}
