import { expect, $ } from "@wdio/globals";

describe("MacOS Testing", () => {
  it("should calculate the meaning of life", async function () {
    console.log("Start test");
    await $('//XCUIElementTypeButton[@label="7"]').click();
    await $('//XCUIElementTypeButton[@label="Multiply"]').click();
    await $('//XCUIElementTypeButton[@label="6"]').click();
    await $("//XCUIElementTypeButton[@label='Equals']").click();
    await expect($("(//XCUIElementTypeStaticText[@value])[2]")).toHaveText(
      expect.stringContaining("42"),
    );
  });
});
