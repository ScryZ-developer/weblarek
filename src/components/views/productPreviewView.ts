import { cloneTemplate } from '../../utils/template';
import { categoryMap } from '../../utils/constants';
import { IProduct } from '../../types/index';
import { resolveImagePath } from '../../utils/utils';
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
    this.titleEl = this.element.querySelector('.card__title')!;
    this.descriptionEl = this.element.querySelector('.card__text')!;
    this.priceEl = this.element.querySelector('.card__price')!;
    this.categoryEl = this.element.querySelector('.card__category')!;
    this.imageEl = this.element.querySelector('.card__image')!;
    this.buttonEl = this.element.querySelector('.card__button')!;

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

    // Категория + модификатор
    const entry = Object.values(categoryMap).find((c) => c.mod === product.category);
    this.categoryEl.className = `card__category card__category_${product.category}`;
    this.categoryEl.textContent = entry?.label || product.category;

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