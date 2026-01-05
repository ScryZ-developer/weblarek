import { IProduct } from "../../types";

// Класс Catalog — управляет списком товаров и выбранным товаром
export class Catalog {
  private products: IProduct[]; // список товаров
  private selectedProduct: IProduct | null; // текущий выбранный товар

  constructor(products: IProduct[] = []) {
    this.products = products;
    this.selectedProduct = null;
  }

  /**
   * Задает массив товаров
   * @param products - массив объектов IProduct
   */
  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  // Возвращает все товары каталога
  getProducts(): IProduct[] {
    return this.products;
  }

  /**
   * Находит товар по id
   * @param id - идентификатор товара
   */
  getProductById(id: string): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  /**
   * Устанавливает выбранный товар
   * @param product - объект товара
   */
  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  // Возвращает текущий выбранный товар
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}