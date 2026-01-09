import { IApi, IProduct, IOrder } from '../../types/index';

interface IApiProductsResponse {
  items: IProduct[];
  total: number;
}

interface IApiOrderResponse {
  id: string;
  total: number;
}

export class Communication {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  /** Получение массива товаров с сервера */
  async getProductList(): Promise<IProduct[]> {
    const response = await this.api.get<IApiProductsResponse>(`/product/`);
    return response.items || [];
  }

  /** Отправка данных заказа на сервер */
  async sendOrder(order: IOrder): Promise<IApiOrderResponse> {
    return await this.api.post<IApiOrderResponse>('/order/', order);
  }
}