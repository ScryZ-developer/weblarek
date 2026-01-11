import { cloneTemplate } from '../../utils/template';
import { categoryMap } from '../../utils/constants';
import { resolveImagePath, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export interface CardViewData {
  id: string;
  title: string;
  price: number | null;
  category: string;
  image: string;
}

export class CardView {
  private element: HTMLButtonElement;
  private titleEl: HTMLElement;
  private priceEl: HTMLElement;
  private categoryEl: HTMLElement;
  private imageEl: HTMLImageElement;

  constructor(private events: EventEmitter) {
    this.element = cloneTemplate<HTMLButtonElement>('card-catalog');
    this.titleEl = ensureElement<HTMLElement>('.card__title', this.element);
    this.priceEl = ensureElement<HTMLElement>('.card__price', this.element);
    this.categoryEl = ensureElement<HTMLElement>('.card__category', this.element);
    this.imageEl = ensureElement<HTMLImageElement>('.card__image', this.element);
  }

  render(data: CardViewData): HTMLButtonElement {
    this.titleEl.textContent = data.title;

    // Цена: если null → пишем "Бесценно"
    this.priceEl.textContent =
      data.price === null ? 'Бесценно' : `${data.price} синапсов`;

    // Категория
    this.setCategory(data.category);

    // Картинка
    this.imageEl.src = resolveImagePath(data.image);
    this.imageEl.alt = data.title;

    // Обработчик клика - эмитим событие с id
    this.element.onclick = () => {
      this.events.emit('card:select', { id: data.id });
    };

    return this.element;
  }

  getElement(): HTMLButtonElement {
    return this.element;
  }

  private setCategory(category: string) {
    // Нормализация категории происходит в представлении
    const entry = categoryMap[category];
    const normalizedMod = entry?.mod || 'other';
    const label = entry?.label || category;

    this.categoryEl.textContent = label;
    this.categoryEl.className = `card__category card__category_${normalizedMod}`;
  }
}