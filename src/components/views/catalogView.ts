import { ensureElement } from '../../utils/utils';

export class CatalogView {
  private container: HTMLElement;

  constructor(containerSelector: string) {
    this.container = ensureElement<HTMLElement>(containerSelector);
  }

  /** Устанавливает готовую разметку списка карточек */
  set items(items: HTMLElement[]) {
    this.container.innerHTML = '';
    items.forEach((item) => {
      this.container.appendChild(item);
    });
  }
}