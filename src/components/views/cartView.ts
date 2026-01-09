import { cloneTemplate } from '../../utils/template';
import { EventEmitter } from '../base/Events';

export class CartView {
  private element: HTMLElement;
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private orderButton: HTMLButtonElement;

  constructor(private events: EventEmitter) {
    this.element = cloneTemplate<HTMLElement>('basket');
    this.listEl = this.element.querySelector('.basket__list')!;
    this.totalEl = this.element.querySelector('.basket__price')!;
    this.orderButton = this.element.querySelector('.basket__button')!;

    this.orderButton.addEventListener('click', () => {
      this.events.emit('cart:order');
    });
  }

  /** Устанавливает готовую разметку списка товаров */
  set items(items: HTMLElement[]) {
    this.listEl.innerHTML = '';
    items.forEach(item => {
      this.listEl.appendChild(item);
    });
  }

  /** Устанавливает общую стоимость */
  set total(total: number) {
    this.totalEl.textContent = `${total} синапсов`;
  }

  /** Устанавливает состояние кнопки заказа */
  set orderButtonDisabled(disabled: boolean) {
    this.orderButton.disabled = disabled;
  }

  getElement(): HTMLElement {
    return this.element;
  }
}