import { BaseComponent } from "../base-component.ts";
import { NavBarLocators } from "./nav-bar-locators.ts";
import type { ChainablePromiseElement } from "webdriverio";

/** The app sidebar — available on every screen as `screen.navBar`. */
export class NavBar extends BaseComponent {
  readonly locators = new NavBarLocators();

  private searchItem(): ChainablePromiseElement {
    return this.getElement(this.locators.searchItem);
  }

  public async openSearch(): Promise<void> {
    await this.searchItem().click();
  }
}
