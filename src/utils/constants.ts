/* Константа для получения полного пути для сервера. Для выполнения запроса 
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`; 
export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;


/* Константа для формирования полного пути к изображениям карточек. 
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

/* Константа соответствий категорий товара модификаторам, используемым для отображения фона категории. */
export const categoryMap: Record<string, { label: string; mod: string }> = {
  'софт-скил': { label: 'софт-скил', mod: 'soft' },
  'хард-скил': { label: 'хард-скил', mod: 'hard' },
  'другое': { label: 'другое', mod: 'other' },
  'дополнительное': { label: 'дополнительное', mod: 'additional' },
  'кнопка': { label: 'кнопка', mod: 'button' },
};

export const settings = {

};