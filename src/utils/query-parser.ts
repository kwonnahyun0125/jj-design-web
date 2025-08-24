import { ProjectType } from '@prisma/client';

export function toNumber(v: unknown, fallback = 1, min?: number, max?: number): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  const boundedMin = min !== undefined ? Math.max(min, n) : n;
  const bounded = max !== undefined ? Math.min(max, boundedMin) : boundedMin;
  return bounded;
}

export function toString(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v : undefined;
}

export function toNumberArray(v: unknown): number[] | undefined {
  if (typeof v !== 'string' || !v.trim()) return undefined;
  const arr = v
    .split(',')
    .map((s) => Number(s.trim()))
    .filter(Number.isFinite);
  return arr.length ? arr : undefined;
}

export function toBool(v: unknown): boolean | undefined {
  if (v === '1') return true;
  if (v === '0') return false;
  return undefined;
}

export function parseProjectType(v: unknown): ProjectType | undefined {
  if (typeof v !== 'string') return undefined;
  const allowed: readonly ProjectType[] = ['RESIDENCE', 'MERCANTILE', 'ARCHITECTURE'];
  return allowed.includes(v as ProjectType) ? (v as ProjectType) : undefined;
}
