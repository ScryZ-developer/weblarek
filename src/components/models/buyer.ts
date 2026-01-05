import { IBuyer } from "../../types";

// Класс Buyer — управляет данными покупателя

export class Buyer {
  private payment: IBuyer["payment"]; // способ оплаты
  private email: string;              // email покупателя
  private phone: string;              // телефон покупателя
  private address: string;            // адрес доставки

  constructor(data?: IBuyer) {
    this.payment = data?.payment || "card"; // по умолчанию карта
    this.email = data?.email || "";
    this.phone = data?.phone || "";
    this.address = data?.address || "";
  }

  /**
   * Устанавливает данные покупателя
   * @param data - объект IBuyer
   */

  setData(data: IBuyer): void {
    this.payment = data.payment;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
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
    this.payment = "card";
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  /**
   * Проверяет корректность данных покупателя
   * @returns true, если все обязательные поля заполнены корректно
   */

  validate(): boolean {
    return (
      this.payment !== undefined &&
      this.email.includes("@") &&
      this.phone.length >= 10 &&
      this.address.length > 5
    );
  }
}