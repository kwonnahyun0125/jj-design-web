/* eslint-disable @typescript-eslint/naming-convention */
export const ProjectTypeEnum = {
  RESIDENCE: 'RESIDENCE',
  MERCANTILE: 'MERCANTILE',
  ARCHITECTURE: 'ARCHITECTURE',
} as const;

export type ProjectType = (typeof ProjectTypeEnum)[keyof typeof ProjectTypeEnum];
