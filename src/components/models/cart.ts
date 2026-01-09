import { IProduct } from '../../types/index.ts';
import { EventEmitter } from '../base/Events';

// Класс Cart - Отвечает за хранение и управление корзиной товаров.

export class Cart {
  private items: IProduct[] = []; // товары, добавленные в корзину

  /**
   * Конструктор класса Cart
   */

  constructor(private events: EventEmitter) {}

  /**
   * Получить массив товаров в корзине
   * @returns массив товаров
   */

  getItems(): IProduct[] {
    return this.items;
  }

  /**
   * Добавить товар в корзину
   * @param product - товар для добавления
   */
  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit('cart:change');
  }

  /**
   * Удалить товар из корзины
   * @param product - товар для удаления
   */
  removeItem(product: IProduct): void {
    this.items = this.items.filter(item => item.id !== product.id);
    this.events.emit('cart:change');
  }

  // Очистить корзину
  clear(): void {
    this.items = [];
    this.events.emit('cart:change');
  }

  /**
   * Получить общую стоимость всех товаров
   * @returns сумма цен товаров
   */
  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  /**
   * Получить количество товаров в корзине
   * @returns количество товаров
   */
  getCount(): number {
    return this.items.length;
  }

  /**
   * Проверить наличие товара в корзине по id
   * @param productId - идентификатор товара
   * @returns true, если товар есть в корзине
   */
  hasItem(productId: string): boolean {
    return this.items.some(item => item.id === productId);
  }
}