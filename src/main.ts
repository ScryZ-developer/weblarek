import './scss/styles.scss';
import { Api } from './components/base/Api';
import { Communication } from './components/models/communication';

import { Catalog } from "./components/models/catalog";
import { Cart } from "./components/models/cart";
import { Buyer } from "./components/models/buyer";
import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";

// Получаем адрес из переменной окружения
const apiOrigin = API_URL;

// Создаём экземпляр Api с базовым URL
const api = new Api(apiOrigin);

// Создаём экземпляр Communication, передавая Api
const communication = new Communication(api);
const catalog = new Catalog();

// Пример получения каталога
communication.getProductList()
  .then(productlist => {
    catalog.setProducts(productlist);
    console.log('Каталог после получения с сервера:', catalog.getProducts());
  })
  .catch(err => console.error(err));
// Тест Catalog

catalog.setProducts(apiProducts.items);

console.log("=== Тест Catalog ===");
console.log("Все товары:", catalog.getProducts());
console.log("Товар по id '1':", catalog.getProductById("1"));

// Устанавливаем выбранный товар
const selected = catalog.getProductById("1");
if (selected) catalog.setSelectedProduct(selected);
console.log("Выбранный товар:", catalog.getSelectedProduct());

// Тест Cart
const cart = new Cart();
console.log("\n=== Тест Cart ===");
console.log("Начальная корзина:", cart.getItems());

if (selected) cart.addItem(selected);
console.log("После добавления товара:", cart.getItems());

console.log("Есть товар с id '1'?", cart.hasItem("1"));

console.log("Общая стоимость:", cart.getTotalPrice());
console.log("Количество товаров:", cart.getCount());

cart.removeItem(selected!);
console.log("После удаления товара:", cart.getItems());

cart.clear();
console.log("После очистки корзины:", cart.getItems());

// Тест Buyer
const buyer = new Buyer({
  payment: "card",
  email: "user@example.com",
  phone: "1234567890",
  address: "ул. Пушкина, 1",
});

console.log("\n=== Тест Buyer ===");
console.log("Данные покупателя:", buyer.getData());

buyer.setData({ payment: "cash", email: "test@example.com", phone: "0987654321", address: "ул. Лермонтова, 10" });
console.log("После обновления данных:", buyer.getData());

console.log("Валидация данных:", buyer.validate());

buyer.clear();
console.log("После очистки данных:", buyer.getData());