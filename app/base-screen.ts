import { BaseComponent } from "./base-component.ts";
import { NavBar } from "./components/nav-bar.ts";

/**
 * Base class for full screens. Exposes shared components that are visible on
 * every screen (e.g. the sidebar nav bar).
 */
export class BaseScreen extends BaseComponent {
  readonly navBar = new NavBar();
}
