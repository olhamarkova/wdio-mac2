import { Calculator } from "../../app/calculator-app";

const calculator = new Calculator();

describe("MacOS Calculator Testing", () => {
  it("should multiply two digits", async function () {
    await calculator.mupltiply("7", "8");
    await calculator.verifyResult("56");
    await calculator.clear();
  });
});
