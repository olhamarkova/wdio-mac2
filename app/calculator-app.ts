import { CalculatorLocators } from "./locators";
import { expect, $ } from "@wdio/globals";

export class Calculator {
  locators = new CalculatorLocators();

  private getElement(locator: string): ChainablePromiseElement {
    return $(locator);
  }

  private async clickButton(locator: string): Promise<void> {
    await this.getElement(locator).click();
  }

  private async getResultText(): Promise<string> {
    const result = await this.getElement(this.locators.resultValue).getText();
    return result.trim();
  }

  private async assertTextContaining(
    locator: string,
    text: string,
  ): Promise<void> {
    await expect(this.getElement(locator)).toHaveText(
      expect.stringContaining(text),
      {
        ignoreCase: true,
      },
    );
  }

  public async clear(): Promise<void> {
    const result = await this.getResultText();
    if (result == "0") {
      return;
    }
    await this.clickButton(this.locators.allClearButton);
  }

  public async mupltiply(digit1: string, digit2: string): Promise<void> {
    await this.clickButton(this.locators.digitButton(digit1));
    await this.clickButton(this.locators.multiplyButton);
    await this.clickButton(this.locators.digitButton(digit2));
    await this.clickButton(this.locators.equalsButton);
  }

  public async verifyResult(expectedResult: string): Promise<void> {
    await this.assertTextContaining(this.locators.result, expectedResult);
  }
}
