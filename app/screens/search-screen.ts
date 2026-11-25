import { SearchScreenLocators } from "./search-screen-locators.ts";
import { BaseScreen } from "../base-screen.ts";
import { expect } from "@wdio/globals";
import type { ChainablePromiseElement } from "webdriverio";

export class SearchScreen extends BaseScreen {
  readonly locators = new SearchScreenLocators();

  private searchField(): ChainablePromiseElement {
    return this.getElement(this.locators.searchField);
  }

  private noSuggestionsMsg(): ChainablePromiseElement {
    return this.getElement(this.locators.noSuggestionsMsg);
  }

  public async searchForBooks(searchValue: string): Promise<void> {
    await this.searchField().setValue(searchValue);
  }

  public async verifyNoSuggestionsShown(): Promise<void> {
    await expect(this.noSuggestionsMsg()).toBeDisplayed();
  }
}
