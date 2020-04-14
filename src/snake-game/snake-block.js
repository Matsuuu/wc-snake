import { LitElement, css } from "lit-element";

class SnakeBlock extends LitElement {
  static get properties() {
    return {
      occupied: { type: Boolean },
      fruit: { type: Boolean }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        border: 1px solid #484848;
        box-sizing: border-box;
        transition: 0.1s ease-out;
      }

      :host([occupied]) {
        background: black;
        transition: 0s;
      }

      :host([fruit]) {
        background: red;
      }
    `;
  }

  constructor() {
    super();
    this.occupied = false;
    this.fruit = false;
  }

  firstUpdated() {}

  toggleOccupation() {
    this.occupied = !this.occupied;
    if (this.occupied) {
      this.setAttribute("occupied", "");
    } else {
      this.removeAttribute("occupied");
    }
  }

  removeOccupation() {
    this.occupied = false;
    this.removeAttribute("occupied");
    this.fruite = false;
    this.removeAttribute("fruit");
  }

  toggleFruit() {
    this.fruit = !this.fruit;
    if (this.fruit) {
      this.setAttribute("fruit", "");
    } else {
      this.removeAttribute("fruit");
    }
  }
}

if (!customElements.get("snake-block")) {
  customElements.define("snake-block", SnakeBlock);
}
