import { IBooksLocators } from "./ibooks-locators.ts";
import { expect, $ } from "@wdio/globals";
import type { ChainablePromiseElement, Selector } from "webdriverio";

export class IBooks {
  locators = new IBooksLocators();

  private getElement(locator: Selector): ChainablePromiseElement {
    return $(locator);
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
