import { cloneTemplate } from '../../utils/template';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

/**
 * Форма №2 — контакты (email, phone)
 * Эмитит: 'buyer:field-change' при изменении полей
 * Эмитит: 'order:confirm' при отправке формы
 */
export class ContactsFormView {
  private element: HTMLFormElement;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private errorsEl: HTMLElement;
  private submitBtn: HTMLButtonElement;

  constructor(private events: EventEmitter) {
    this.element = cloneTemplate<HTMLFormElement>('contacts');

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.element);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.element);
    this.errorsEl = ensureElement<HTMLElement>('.form__errors', this.element);
    this.submitBtn = ensureElement<HTMLButtonElement>('button[type="submit"]', this.element);

    // Обработчики полей ввода
    this.emailInput.addEventListener('input', () => {
      const value = this.emailInput.value.trim();
      this.events.emit('buyer:field-change', { key: 'email', value });
    });

    this.phoneInput.addEventListener('input', () => {
      const value = this.phoneInput.value.trim();
      this.events.emit('buyer:field-change', { key: 'phone', value });
    });

    // Обработчик отправки формы
    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order:confirm');
    });
  }

  getElement(): HTMLFormElement {
    return this.element;
  }

  /** Устанавливает email (вызывается из presenter) */
  set email(value: string) {
    this.emailInput.value = value ?? '';
  }

  /** Устанавливает phone (вызывается из presenter) */
  set phone(value: string) {
    this.phoneInput.value = value ?? '';
  }

  /** Устанавливает ошибки валидации (вызывается из presenter) */
  set errors(errors: string[]) {
    this.errorsEl.textContent = errors.join(', ');
  }

  /** Устанавливает валидность формы (вызывается из presenter) */
  set valid(isValid: boolean) {
    this.submitBtn.disabled = !isValid;
  }
}