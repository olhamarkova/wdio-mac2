import { $ } from "@wdio/globals";
import type { ChainablePromiseElement, Selector } from "webdriverio";

export class BaseScreen {
  protected getElement(locator: Selector): ChainablePromiseElement {
    return $(locator);
  }
}
