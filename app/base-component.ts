import { $ } from "@wdio/globals";
import type { ChainablePromiseElement } from "webdriverio";

/**
 * Common base for every Page Object — screens and shared components.
 * Holds element helpers only; must not depend on any screen or component.
 */
export class BaseComponent {
  /** Common start of every macOS element XPath; locators contain only the rest. */
  protected readonly prefix = "//XCUIElementType";

  /** @param locator element type + attributes, e.g. `Cell[@label="Search"]` */
  protected getElement(locator: string): ChainablePromiseElement {
    return $(`${this.prefix}${locator}`);
  }
}
