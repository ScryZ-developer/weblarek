import { cloneTemplate } from '../../utils/template';
import { categoryMap } from '../../utils/constants';
import { resolveImagePath } from '../../utils/utils';
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
    this.titleEl = this.element.querySelector('.card__title')!;
    this.priceEl = this.element.querySelector('.card__price')!;
    this.categoryEl = this.element.querySelector('.card__category')!;
    this.imageEl = this.element.querySelector('.card__image')!;
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
    const entry = Object.values(categoryMap).find((c) => c.mod === category);

    this.categoryEl.textContent = entry?.label || category;
    this.categoryEl.className = `card__category card__category_${entry?.mod || 'other'}`;
  }
}