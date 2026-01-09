import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';
import { BasketCounterView } from './basketCounterView';

export class HeaderView {
  private basketButton: HTMLButtonElement;
  private basketCounter: BasketCounterView;

  constructor(private events: EventEmitter) {
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket');
    this.basketCounter = new BasketCounterView();

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  /** Обновляет счетчик корзины */
  updateCounter(count: number) {
    this.basketCounter.update(count);
  }
}
