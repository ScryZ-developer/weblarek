import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export class HeaderView {
  private basketButton: HTMLButtonElement;
  private basketCounter: HTMLElement;

  constructor(private events: EventEmitter) {
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket');
    this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter');

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  /** Обновляет счетчик корзины */
  updateCounter(count: number) {
    this.basketCounter.textContent = String(count);
    this.basketCounter.style.display = count > 0 ? 'flex' : 'none';
  }
}