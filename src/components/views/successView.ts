// src/components/Views/SuccessView.ts
import { cloneTemplate } from '../../utils/template';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export class SuccessView {
  private element: HTMLElement;
  private descriptionEl: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(private events: EventEmitter) {
    this.element = cloneTemplate<HTMLElement>('success');
    this.descriptionEl = ensureElement<HTMLElement>('.order-success__description', this.element);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.element);

    // обработчик кнопки закрытия
    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  /** Отрисовать сумму заказа */
  render(total: number): HTMLElement {
    this.descriptionEl.textContent = `Списано ${total} синапсов`;
    return this.element;
  }
}