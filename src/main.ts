import './scss/styles.scss';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Communication } from './components/models/communication';  
import { Catalog } from "./components/models/catalog";
import { Cart } from "./components/models/cart";
import { Buyer } from "./components/models/buyer";
import { API_URL } from "../src/utils/constants";

import { ModalView } from './components/views/modalView';
import { ProductPreviewView } from './components/views/productPreviewView';
import { CatalogView } from './components/views/catalogView';
import { CartView } from './components/views/cartView';
import { CartItemView } from './components/views/cartItemView';
import { OrderFormView } from './components/views/orderFormView';
import { ContactsFormView } from './components/views/contactsFormView';
import { SuccessView } from './components/views/successView';
import { HeaderView } from './components/views/headerView';
import { CardView } from './components/views/cardView';

import { IProduct } from '../src/types';
import { EventNames } from '../src/utils/utils';

// Создание экземпляров в глобальной области
const events = new EventEmitter();

// Модели
const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

// API и коммуникация
const api = new Api(API_URL);
const communication = new Communication(api);

// Представления (создаются один раз)
const catalogView = new CatalogView('.gallery');
const cartView = new CartView(events);
const modal = new ModalView(events, '#modal-container');
const headerView = new HeaderView(events);
const productPreviewView = new ProductPreviewView(events);
const orderFormView = new OrderFormView(events);
const contactsFormView = new ContactsFormView(events);
const successView = new SuccessView(events);

class AppPresenter {
  constructor(
    private events: EventEmitter,
    private catalog: Catalog,
    private cart: Cart,
    private buyer: Buyer,
    private communication: Communication,
    private catalogView: CatalogView,
    private cartView: CartView,
    private modal: ModalView,
    private headerView: HeaderView,
    private productPreviewView: ProductPreviewView,
    private orderFormView: OrderFormView,
    private contactsFormView: ContactsFormView,
    private successView: SuccessView
  ) {}

  // ==== Инициализация ====
  public init() {
    this.loadProducts();
    this.initEvents();
  }

  // ==== Загрузка каталога ====
  private async loadProducts() {
    try {
      const productlist = await this.communication.getProductList();
      // Изменение модели - вызовет событие catalog:change
      this.catalog.setProducts(productlist);
    } catch (err) {
      console.error('Ошибка загрузки каталога:', err);
    }
  }

  // ==== События ====
  private initEvents() {
    // Событие изменения каталога - обновление представления
    this.events.on(EventNames.CatalogChange, () => {
      const products = this.catalog.getProducts();
      const cardViews = products.map(product => {
        const cardView = new CardView(this.events);
        const cardData = {
          id: product.id,
          title: product.title,
          price: product.price ?? null,
          category: product.category, // Передаем исходную категорию, нормализация в представлении
          image: product.image,
        };
        return cardView.render(cardData);
      });
      this.catalogView.items = cardViews;
    });

    // Выбор карточки товара - изменение модели
    this.events.on<{ id: string }>(EventNames.CardSelect, ({ id }) => {
      const product = this.catalog.getProductById(id);
      if (!product) return;
      
      // Изменение модели - вызовет событие catalog:product-selected
      // Модель записывает данные как есть, нормализация происходит в представлении
      this.catalog.setSelectedProduct(product);
    });

    // Событие выбора продукта - обновление представления preview
    this.events.on(EventNames.CatalogProductSelected, () => {
      const product = this.catalog.getSelectedProduct();
      if (!product) return;
      
      const inCart = this.cart.hasItem(product.id);
      this.modal.open(this.productPreviewView.render(product, inCart));
    });

    // Открытие корзины
    this.events.on(EventNames.BasketOpen, () => {
      this.modal.open(this.cartView.getElement());
    });

    // Добавление товара в корзину - изменение модели
    this.events.on<IProduct>(EventNames.CartAdd, (product) => {
      this.cart.addItem(product);
      // Модель вызовет событие cart:change
    });

    // Удаление товара из корзины - изменение модели
    this.events.on<{ product: IProduct }>(EventNames.CartRemove, ({ product }) => {
      this.cart.removeItem(product);
      // Модель вызовет событие cart:change
    });

    // Событие изменения корзины - обновление представления
    this.events.on(EventNames.CartChange, () => {
      const items = this.cart.getItems();
      
      // Создаем элементы списка корзины
      const cartItemViews = items.map((item, index) => {
        const cartItemView = new CartItemView(this.events);
        return cartItemView.render(item, index);
      });
      
      this.cartView.items = cartItemViews;
      this.cartView.total = this.cart.getTotalPrice();
      this.cartView.orderButtonDisabled = items.length === 0;
      this.headerView.updateCounter(this.cart.getCount());
    });

    // Переключение товара в превью (добавить/удалить) - изменение модели
    this.events.on(EventNames.PreviewToggle, () => {
      const product = this.catalog.getSelectedProduct();
      if (!product) return;
      
      if (this.cart.hasItem(product.id)) {
        this.cart.removeItem(product);
      } else {
        this.cart.addItem(product);
      }
      // Модель вызовет событие cart:change, которое обновит представление
      this.modal.close();
    });

    // Оформить заказ (шаг 1) - открытие формы
    this.events.on(EventNames.CartOrder, () => {
      this.modal.open(this.orderFormView.getElement());
    });

    // Изменение поля покупателя - изменение модели
    this.events.on<{ key: 'payment' | 'email' | 'phone' | 'address'; value: any }>(EventNames.BuyerFieldChange, ({ key, value }) => {
      this.buyer.setField(key, value);
      // Модель вызовет событие buyer:change
    });

    // Событие изменения модели покупателя - обновление представления форм
    this.events.on(EventNames.BuyerChange, () => {
      const buyerData = this.buyer.getData();
      const errors = this.buyer.validate();
      
      // Обновление формы оплаты
      this.orderFormView.payment = buyerData.payment;
      this.orderFormView.address = buyerData.address;
      const paymentErrors: string[] = [];
      if (errors.payment) paymentErrors.push(errors.payment);
      if (errors.address) paymentErrors.push(errors.address);
      this.orderFormView.errors = paymentErrors;
      this.orderFormView.valid = paymentErrors.length === 0;
      
      // Обновление формы контактов
      this.contactsFormView.email = buyerData.email;
      this.contactsFormView.phone = buyerData.phone;
      const contactErrors: string[] = [];
      if (errors.email) contactErrors.push(errors.email);
      if (errors.phone) contactErrors.push(errors.phone);
      this.contactsFormView.errors = contactErrors;
      this.contactsFormView.valid = contactErrors.length === 0;
    });

    // Переход к шагу 2 (контакты) - открытие формы контактов
    this.events.on(EventNames.OrderNext, () => {
      // Проверяем валидность формы оплаты
      const errors = this.buyer.validate();
      if (errors.payment || errors.address) {
        return; // Не переходим, если форма невалидна
      }
      this.modal.open(this.contactsFormView.getElement());
    });

    // Подтверждение заказа (шаг 2) - отправка заказа
    this.events.on(EventNames.OrderConfirm, async () => {
      // Проверяем валидность всех данных
      const errors = this.buyer.validate();
      if (Object.keys(errors).length > 0) {
        return; // Не отправляем, если данные невалидны
      }

      const order = {
        ...this.buyer.getData(),
        items: this.cart.getItems().map((p) => p.id),
        total: this.cart.getTotalPrice(),
      };

      try {
        const result: { total: number } = await this.communication.sendOrder(order);
        this.modal.open(this.successView.render(result.total));

        // Очищаем модели - они вызовут соответствующие события
        this.cart.clear();
        this.buyer.clear();
      } catch (err) {
        console.error('Ошибка при заказе:', err);
      }
    });

    // Закрытие окна успеха
    this.events.on(EventNames.SuccessClose, () => {
      this.modal.close();
    });
  }
}

// Создание и инициализация приложения
const app = new AppPresenter(
  events,
  catalog,
  cart,
  buyer,
  communication,
  catalogView,
  cartView,
  modal,
  headerView,
  productPreviewView,
  orderFormView,
  contactsFormView,
  successView
);

app.init();