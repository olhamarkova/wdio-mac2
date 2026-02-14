export class CalculatorLocators {
  result = "(//XCUIElementTypeStaticText[@value])[2]";
  operation = "(//XCUIElementTypeStaticText[@value])[1]";
  resultValue = "//XCUIElementTypeStaticText[@value]";
  deleteButton = "//XCUIElementTypeButton[@label='Delete']";
  addButton = "//XCUIElementTypeButton[@label='Add']";
  clearButton = "//XCUIElementTypeButton[@label='Clear']";
  allClearButton = "//XCUIElementTypeButton[@label='All Clear']";
  percentButton = "//XCUIElementTypeButton[@label='Per cent']";
  divideButton = "//XCUIElementTypeButton[@label='Divide']";
  digitButton = (label: string) => `//XCUIElementTypeButton[@label=${label}]`;
  multiplyButton = "//XCUIElementTypeButton[@label='Multiply']";
  subtractButton = "//XCUIElementTypeButton[@label='Subtract']";
  changeSignButton = "//XCUIElementTypeButton[@label='Change Sign']";
  pointButton = "//XCUIElementTypeButton[@label='Point']";
  equalsButton = "//XCUIElementTypeButton[@label='Equals']";
  sideBarButton = (mode: "Show" | "Hide") =>
    `(//XCUIElementTypeButton[@label="${mode} Sidebar"])[2]`;
}
