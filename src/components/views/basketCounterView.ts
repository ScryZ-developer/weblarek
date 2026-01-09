import { ensureElement } from '../../utils/utils';

export class BasketCounterView {
  private element: HTMLElement;

  constructor(selector: string = '.header__basket-counter') {
    this.element = ensureElement<HTMLElement>(selector);
  }

  update(count: number) {
    this.element.textContent = String(count);
    this.element.style.display = count > 0 ? 'flex' : 'none';
  }
}