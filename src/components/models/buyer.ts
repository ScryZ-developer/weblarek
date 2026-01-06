import { IBuyer } from "../../types";

// Класс Buyer — управляет данными покупателя

export class Buyer {
  private payment: IBuyer["payment"]; // способ оплаты
  private email: string;              // email покупателя
  private phone: string;              // телефон покупателя
  private address: string;            // адрес доставки

  constructor(data?: Partial<IBuyer>) {
    this.payment = data?.payment || ""; // по умолчанию пустая строка
    this.email = data?.email || "";
    this.phone = data?.phone || "";
    this.address = data?.address || "";
  }

  /**
   * Устанавливает данные покупателя
   * @param data - объект IBuyer
   */
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
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
    if (!this.email?.trim()) {
      errors.email = 'Укажите email';
    }
    if (!this.phone?.trim()) {
      errors.phone = 'Укажите телефон';
    }
    if (!this.address?.trim()) {
      errors.address = 'Укажите адрес';
    }

    return errors;
  }
}