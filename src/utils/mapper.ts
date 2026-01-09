import { categoryMap } from './constants';

/** Нормализация категории */
export function normalizeCategory(raw: string): string {
  return categoryMap[raw]?.mod || 'other';
}