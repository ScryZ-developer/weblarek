import { IBuyer } from "../../types";
import { EventEmitter } from "../base/Events";

// Класс Buyer — управляет данными покупателя

export class Buyer {
  private payment: IBuyer["payment"] = ""; // способ оплаты
  private email: string = "";              // email покупателя
  private phone: string = "";              // телефон покупателя
  private address: string = "";            // адрес доставки

  constructor(private events: EventEmitter) {}

  /**
   * Устанавливает данные покупателя
   * @param data - объект IBuyer
   */
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
    
    // Эмитим событие обновления модели покупателя
    this.events.emit('buyer:change');
  }

  /**
   * Устанавливает одно поле покупателя
   * @param key - ключ поля
   * @param value - значение поля
   */
  setField<K extends keyof IBuyer>(key: K, value: IBuyer[K]): void {
    (this as any)[key] = value;
    this.events.emit('buyer:change');
  }

  // Возвращает все данные покупателя
  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  // Очищает данные покупателя
  clear(): void {
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";
    
    // Эмитим событие обновления модели покупателя
    this.events.emit('buyer:change');
  }

  /**
   * Проверяет корректность данных покупателя
   * @returns объект с ошибками для каждого невалидного поля
   */
  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }
    
    const email = this.email?.trim() || '';
    if (!email) {
      errors.email = 'Укажите email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Неверный email';
    }
    
    const phone = this.phone?.trim() || '';
    if (!phone) {
      errors.phone = 'Укажите телефон';
    } else {
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 10) {
        errors.phone = 'Неверный телефон';
      }
    }
    
    if (!this.address?.trim()) {
      errors.address = 'Укажите адрес';
    }

    return errors;
  }
}