export class Calculator {
  constructor() {
    //will add parent class soon
  }
  result = "//XCUIElementTypeStaticText[@value]";
  deleteButton = "//XCUIElementTypeButton[@label='Delete']";
  allClearButton = "//XCUIElementTypeButton[@label='All Clear']";
  percentButton = "//XCUIElementTypeButton[@label='Per cent']";
  divideButton = "//XCUIElementTypeButton[@label='Divide']";
  digitButton = (label: string) => `//XCUIElementTypeButton[@label=${label}]`;
  multiplyButton = "//XCUIElementTypeButton[@label='Multiply']";
  subtractButton = "//XCUIElementTypeButton[@label='Subtract']";
  addButton = "//XCUIElementTypeButton[@label='Add']";
  changeSignButton = "//XCUIElementTypeButton[@label='Change Sign']";
  pointButton = "//XCUIElementTypeButton[@label='Point']";
  equalsButton = "//XCUIElementTypeButton[@label='Equals']";
  sideBarButton = (mode: "Show" | "Hide") =>
    `(//XCUIElementTypeButton[@label="${mode} Sidebar"])[2]`;
}
