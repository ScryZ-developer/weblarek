import { cloneTemplate } from '../../utils/template';
import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types';

export class CartItemView {
  private element: HTMLLIElement;
  private indexEl: HTMLElement;
  private titleEl: HTMLElement;
  private priceEl: HTMLElement;
  private deleteButton: HTMLElement;

  constructor(private events: EventEmitter) {
    this.element = cloneTemplate<HTMLLIElement>('card-basket');
    this.indexEl = this.element.querySelector('.basket__item-index')!;
    this.titleEl = this.element.querySelector('.card__title')!;
    this.priceEl = this.element.querySelector('.card__price')!;
    this.deleteButton = this.element.querySelector('.basket__item-delete')!;

    this.deleteButton.addEventListener('click', () => {
      // Событие будет установлено в render с правильным продуктом
    });
  }

  render(product: IProduct, index: number): HTMLLIElement {
    this.indexEl.textContent = String(index + 1);
    this.titleEl.textContent = product.title;
    this.priceEl.textContent = `${product.price ?? 0} синапсов`;

    // Удаляем старый обработчик и добавляем новый с правильным продуктом
    const newDeleteButton = this.deleteButton.cloneNode(true) as HTMLElement;
    this.deleteButton.replaceWith(newDeleteButton);
    this.deleteButton = newDeleteButton;

    this.deleteButton.addEventListener('click', () => {
      this.events.emit('cart:remove', { product });
    });

    return this.element;
  }

  getElement(): HTMLLIElement {
    return this.element;
  }
}
