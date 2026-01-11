// src/components/Views/ModalView.ts
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export class ModalView {
  private root: HTMLElement;
  private contentContainer: HTMLElement;
  private closeButton: HTMLButtonElement | null;
  private escHandler: (e: KeyboardEvent) => void;

  constructor(_events: EventEmitter, rootOrSelector: HTMLElement | string = '#modal-container') {
    const root =
      typeof rootOrSelector === 'string'
        ? ensureElement<HTMLElement>(rootOrSelector)
        : rootOrSelector;

    this.root = root;

    this.contentContainer = ensureElement<HTMLElement>('.modal__content', this.root);

    try {
      this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.root);
    } catch {
      this.closeButton = null;
    }

    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.escHandler = this.onEsc.bind(this);

    this.initListeners();
  }

  private initListeners(): void {
    // клик по фону (оверлею)
    this.root.addEventListener('click', this.onOverlayClick);

    // крестик
    if (this.closeButton) {
      this.closeButton.addEventListener('click', this.onCloseClick);
    }
  }

  private onOverlayClick(e: MouseEvent) {
    if (e.target === this.root) {
      this.close();
    }
  }

  private onCloseClick() {
    this.close();
  }

  private onEsc(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.close();
    }
  }

  open(contentEl: HTMLElement) {
    this.contentContainer.replaceChildren(contentEl);
    this.root.classList.add('modal_active');
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', this.escHandler);
  }

  close() {
    this.root.classList.remove('modal_active');
    this.contentContainer.replaceChildren();
    document.body.style.overflow = '';
    window.removeEventListener('keydown', this.escHandler);
  }
}