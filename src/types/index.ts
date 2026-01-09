import { Buyer } from '../components/models/buyer';
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TPayment = 'card' | 'cash' | ''; 

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Виды оплаты

export interface IProduct {
  id: string;       // уникальный идентификатор товара
  title: string;    // название товара
  description: string; // описание товара
  image: string;    // ссылка на изображение товара
  category: string; // категория, к которой относится товар
  price: number | null; // цена товара (null, если цена не указана)
}

export interface IBuyer {
  payment: TPayment; // выбранный способ оплаты
  email: string;     // email покупателя
  phone: string;     // телефон покупателя
  address: string;   // адрес доставки
}

export interface IOrder extends IBuyer {
  items: string[];   // список id выбранных товаров
  total: number;     // общая сумма заказа
}

export interface CardSelectPayload {
  id: string;
}

export interface CartRemovePayload {
  index: number;
}

export interface CartRemoveByIdPayload {
  id: string;
}

export interface OrderNextPayload {
  payment: Buyer['payment'];
  address: string;
}

export interface OrderConfirmPayload {
  email: string;
  phone: string;
}