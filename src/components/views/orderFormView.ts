import { cloneTemplate } from '../../utils/template';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';
import { IBuyer } from '../../types';

type Payment = IBuyer['payment']; // 'card' | 'cash'

/**
 * Форма шага 1 "Способ оплаты + адрес".
 * Эмитит: 'buyer:field-change' при изменении полей
 * Эмитит: 'order:next' при отправке формы
 */
export class OrderFormView {
  private element: HTMLFormElement;
  private btnCard: HTMLButtonElement;
  private btnCash: HTMLButtonElement;
  private addressInput: HTMLInputElement;
  private submitBtn: HTMLButtonElement;
  private errorEl: HTMLElement;

  constructor(private events: EventEmitter) {
    this.element = cloneTemplate<HTMLFormElement>('order');

    this.btnCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.element);
    this.btnCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.element);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.element);
    this.submitBtn = ensureElement<HTMLButtonElement>('.order__button', this.element);
    this.errorEl = ensureElement<HTMLElement>('.form__errors', this.element);

    // Обработчики кнопок оплаты
    this.btnCard.addEventListener('click', () => {
      this.setPayment('card');
      this.events.emit('buyer:field-change', { key: 'payment', value: 'card' });
    });

    this.btnCash.addEventListener('click', () => {
      this.setPayment('cash');
      this.events.emit('buyer:field-change', { key: 'payment', value: 'cash' });
    });

    // Обработчик поля адреса
    this.addressInput.addEventListener('input', () => {
      const value = this.addressInput.value.trim();
      this.events.emit('buyer:field-change', { key: 'address', value });
    });

    // Обработчик отправки формы
    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order:next');
    });
  }

  /** Вернуть разметку формы */
  getElement(): HTMLElement {
    return this.element;
  }

  /** Устанавливает способ оплаты (вызывается из presenter) */
  set payment(value: Payment) {
    this.setPayment(value);
  }

  /** Устанавливает адрес (вызывается из presenter) */
  set address(value: string) {
    this.addressInput.value = value ?? '';
  }

  /** Устанавливает ошибки валидации (вызывается из presenter) */
  set errors(errors: string[]) {
    this.errorEl.textContent = errors.join('. ');
  }

  /** Устанавливает валидность формы (вызывается из presenter) */
  set valid(isValid: boolean) {
    this.submitBtn.disabled = !isValid;
  }

  private setPayment(payment: Payment) {
    const active = 'button_alt-active';
    const normal = 'button_alt';

    this.btnCard.classList.remove(active);
    this.btnCard.classList.add(normal);
    this.btnCash.classList.remove(active);
    this.btnCash.classList.add(normal);

    if (payment === 'card') {
      this.btnCard.classList.add(active);
      this.btnCard.classList.remove(normal);
    } else if (payment === 'cash') {
      this.btnCash.classList.add(active);
      this.btnCash.classList.remove(normal);
    }
  }
}