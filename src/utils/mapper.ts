import { IProduct } from '../types';
import { CardViewData } from '../components/views/cardView';
import { CartItemData } from '../components/views/cartView';
import { categoryMap } from './constants';

/** Нормализация категории */
export function normalizeCategory(raw: string): string {
  return categoryMap[raw]?.mod || 'other';
}

/** Маппер для карточки */
export function toCardViewData(products: IProduct[]): CardViewData[] {
  return products.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price ?? null,
    category: normalizeCategory(p.category),
    image: p.image,
  }));
}

/** Маппер для корзины */
export function toCartItemData(items: IProduct[]): CartItemData[] {
  return items.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price ?? 0,
  }));
}