import { cloneTemplate } from '../../utils/template';
import { categoryMap } from '../../utils/constants';
import { IProduct } from '../../types/index';
import { resolveImagePath, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export class ProductPreviewView {
  private element: HTMLElement;
  private titleEl: HTMLElement;
  private descriptionEl: HTMLElement;
  private priceEl: HTMLElement;
  private categoryEl: HTMLElement;
  private imageEl: HTMLImageElement;
  private buttonEl: HTMLButtonElement;

  constructor(private events: EventEmitter) {
    this.element = cloneTemplate<HTMLElement>('card-preview');
    this.titleEl = ensureElement<HTMLElement>('.card__title', this.element);
    this.descriptionEl = ensureElement<HTMLElement>('.card__text', this.element);
    this.priceEl = ensureElement<HTMLElement>('.card__price', this.element);
    this.categoryEl = ensureElement<HTMLElement>('.card__category', this.element);
    this.imageEl = ensureElement<HTMLImageElement>('.card__image', this.element);
    this.buttonEl = ensureElement<HTMLButtonElement>('.card__button', this.element);

    // Обработчик кнопки устанавливается один раз
    this.buttonEl.addEventListener('click', () => {
      this.events.emit('preview:toggle');
    });
  }

  /** Рендер карточки */
  render(product: IProduct, inCart: boolean): HTMLElement {
    // Текстовые поля
    this.titleEl.textContent = product.title;
    this.descriptionEl.textContent = product.description || '';

    // Цена
    this.setPrice(product.price);

    // Категория + модификатор (нормализация происходит в представлении)
    const entry = categoryMap[product.category];
    const normalizedMod = entry?.mod || 'other';
    const label = entry?.label || product.category;
    this.categoryEl.className = `card__category card__category_${normalizedMod}`;
    this.categoryEl.textContent = label;

    // Картинка
    this.imageEl.src = resolveImagePath(product.image);
    this.imageEl.alt = product.title;

    // Кнопка (зависит от inCart и цены)
    this.updateButton(product.price, inCart);

    return this.element;
  }

  getElement(): HTMLElement {
    return this.element;
  }

  /** Устанавливает цену */
  private setPrice(price: number | null) {
    this.priceEl.textContent =
      price === null ? 'Бесценно' : `${price} синапсов`;
  }

  /** Обновляет текст/состояние кнопки */
  private updateButton(price: number | null, inCart: boolean) {
    if (price === null) {
      this.buttonEl.disabled = true;
      this.buttonEl.textContent = 'Недоступно';
    } else {
      this.buttonEl.disabled = false;
      this.buttonEl.textContent = inCart ? 'Удалить из корзины' : 'Купить';
    }
  }
}