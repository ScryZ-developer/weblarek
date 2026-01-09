import './scss/styles.scss';
import { Api } from './components/base/Api';
import { Communication } from './components/models/communication';  
import { Catalog } from "./components/models/catalog";
import { Cart } from "./components/models/cart";
import { Buyer } from "./components/models/buyer";
import { API_URL, categoryMap } from "../src/utils/constants";

import { ModalView } from './components/views/modalView';
import { ProductPreviewView } from './components/views/productPreviewView';
import { CatalogView } from './components/views/catalogView';
import { CartView } from './components/views/cartView';
import { OrderFormView } from './components/views/orderFormView';
import { ContactsFormView } from './components/views/contactsFormView';
import { SuccessView } from './components/views/successView';

import { IProduct, OrderNextPayload } from '../src/types';
import { events } from './components/base/Events';
import { BasketCounterView } from './components/views/basketView';
import { EventNames } from '../src/utils/utils';
import { toCardViewData, toCartItemData } from './utils/mapper';

class AppPresenter {
  private catalog = new Catalog();
  private cart = new Cart();
  private buyer = new Buyer();

  private api = new Api(API_URL);
  private communication = new Communication(this.api);

  private catalogView = new CatalogView('.gallery');
  private cartView = new CartView();
  private modal = new ModalView('#modal-container');
  private basketCounter = new BasketCounterView();

  // Утилиты
  private normalizeCategory(raw: string): string {
    return categoryMap[raw]?.mod || 'other';
  }

  // ==== Инициализация ====
  public init() {
    this.loadProducts();
    this.initEvents();
    this.updateBasketCounter();
  }

  // ==== Загрузка каталога ====
  private async loadProducts() {
    try {
      const productlist = await this.communication.getProductList();
      this.catalog.setProducts(productlist);
      this.catalogView.render(toCardViewData(productlist)); // УБРАЛ ДУБЛЬ
    } catch (err) {
      console.error('Ошибка загрузки каталога:', err);
    }
  }

  // ==== События ====
  private initEvents() {
    // карточка товара
    events.on<{ id: string }>('card:select', ({ id }) => {
      const product = this.catalog.getProductById(id);
      if (!product) return;

      const normalizedProduct = {
        ...product,
        category: this.normalizeCategory(product.category),
      };

      const previewView = new ProductPreviewView();
      previewView.setCartChecker((pid) => this.cart.hasItem(pid));
      const inCart = this.cart.hasItem(product.id);
      this.modal.open(previewView.render(normalizedProduct, inCart));
    });

    // открыть корзину
    const basketButton = document.querySelector<HTMLButtonElement>('.header__basket');
    if (basketButton) {
      basketButton.addEventListener('click', () => {
        this.modal.open(this.cartView.getElement());
      });
    }

    // добавить товар
    events.on<IProduct>('cart:add', (product) => {
      this.cart.addItem(product);
      this.cartView.render(toCartItemData(this.cart.getItems()));
      this.updateBasketCounter();
      events.emit('cart:changed');
    });

    // удалить товар (по индексу)
    events.on<{ index: number }>('cart:remove', ({ index }) => {
      const items = this.cart.getItems();
      items.splice(index, 1);

      this.cart.clear();
      items.forEach(item => this.cart.addItem(item));

      this.cartView.render(toCartItemData(this.cart.getItems()));
      this.updateBasketCounter();
      events.emit('cart:changed');
    });

    // удалить товар (по id) — для кнопки в превью
    events.on<{ id: string }>('cart:remove-by-id', ({ id }) => {
      this.cart.removeItem({ id } as any);
      this.cartView.render(toCartItemData(this.cart.getItems()));
      this.updateBasketCounter();
      events.emit('cart:changed');
    });

    // оформить заказ (шаг 1)
    events.on('cart:order', () => {
      const orderForm = new OrderFormView(this.buyer.getData());
      this.modal.open(orderForm.getElement());
    });

    // шаг 1 → шаг 2
    events.on<OrderNextPayload>(EventNames.OrderNext, ({ payment, address }) => {
      this.buyer.setData({ payment, address });
      const contactsForm = new ContactsFormView();
      this.modal.open(contactsForm.getElement());
    });

    // шаг 2 → подтверждение
    events.on<{ email: string; phone: string }>('order:confirm', async ({ email, phone }) => {
      this.buyer.setData({ email, phone });

      const order = {
        ...this.buyer.getData(),
        items: this.cart.getItems().map((p) => p.id),
        total: this.cart.getTotalPrice(),
      };

      try {
        const result: { total: number } = await this.communication.sendOrder(order);
        const success = new SuccessView();
        this.modal.open(success.render(result.total));

        this.cart.clear();
        this.cartView.render([]);
        this.updateBasketCounter();
      } catch (err) {
        console.error('Ошибка при заказе:', err);
      }
    });

    // закрытие success
    events.on('success:close', () => {
      this.modal.close();
    });
  }

  // ==== Счётчик корзины ====
  private updateBasketCounter() {
    this.basketCounter.update(this.cart.getCount());
  }
}

const app = new AppPresenter();
app.init();