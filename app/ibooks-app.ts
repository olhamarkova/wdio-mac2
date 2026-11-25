import { IBooksLocators } from "./ibooks-locators.ts";
import { BaseScreen } from "./base-screen.ts";
import { expect } from "@wdio/globals";
import type { ChainablePromiseElement } from "webdriverio";

export class IBooks extends BaseScreen {
  readonly locators = new IBooksLocators();

  constructor() {
    super();
  }

  private searchButton(): ChainablePromiseElement {
    return this.getElement(this.locators.searchButton);
  }

  private searchField(): ChainablePromiseElement {
    return this.getElement(this.locators.searchField);
  }

  private noSuggestionsMsg(): ChainablePromiseElement {
    return this.getElement(this.locators.noSuggestionsMsg);
  }

  public async searchForBooks(searchValue: string): Promise<void> {
    await this.searchButton().click();
    await this.searchField().setValue(searchValue);
  }

  public async verifyNoSuggestionsShown(): Promise<void> {
    await expect(this.noSuggestionsMsg()).toBeDisplayed();
  }
}
