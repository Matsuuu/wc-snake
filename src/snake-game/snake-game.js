import { LitElement, css, unsafeCSS } from "lit-element";
import "./snake-block.js";

const opposites = {
  Up: "Down",
  Down: "Up",
  Right: "Left",
  Left: "Right"
};

class SnakeGame extends LitElement {
  static get properties() {
    return {
      x: { type: Number },
      y: { type: Number },
      blockWidth: { type: Number },

      blockMatrix: { type: Array },
      movingDirection: { type: String },
      movementChangedThisGameTick: { type: Boolean },
      tickRate: { type: Number },
      playerPosition: { type: Object },
      playerLength: { type: Number },
      playerTail: { type: Array }
    };
  }

  constructor() {
    super();
    this.x = 20;
    this.y = 15;
    this.tickRate = 100;
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: ${unsafeCSS(window.innerWidth * 0.3)}px;
      }
    `;
  }

  firstUpdated() {
    this.blockWidth = (window.innerWidth * 0.3) / this.x;
    this.createMap();
    this.initGame();
    this.handleMovement();
    setInterval(() => {
      this.handleGameTick();
    }, this.tickRate);
  }

  spawnPlayer() {
    this.playerPosition = { x: 2, y: 2 };
    this.occupyBoxWithPlayer();
  }

  handleMovement() {
    window.addEventListener("keyup", e => {
      if (/Arrow/.test(e.key)) {
        const newDir = e.key.replace("Arrow", "");
        if (
          opposites[this.movingDirection] !== newDir &&
          !this.movementChangedThisGameTick
        ) {
          this.movementChangedThisGameTick = true;
          this.movingDirection = newDir;
          setTimeout(
            () => (this.movementChangedThisGameTick = false),
            this.tickRate
          );
        }
      }
    });
  }

  handleGameTick() {
    this.movePlayer();
  }

  movePlayer() {
    switch (this.movingDirection) {
      case "Up":
        this.playerPosition.y -= 1;
        break;
      case "Down":
        this.playerPosition.y += 1;
        break;
      case "Right":
        this.playerPosition.x += 1;
        break;
      case "Left":
        this.playerPosition.x -= 1;
        break;
      default:
        break;
    }
    if (this.playerPosition.y >= this.y) {
      this.playerPosition.y = 0;
    }
    if (this.playerPosition.x >= this.x) {
      this.playerPosition.x = 0;
    }
    if (this.playerPosition.y < 0) {
      this.playerPosition.y = this.y - 1;
    }
    if (this.playerPosition.x < 0) {
      this.playerPosition.x = this.x - 1;
    }
    this.occupyBoxWithPlayer();
  }

  occupyBoxWithPlayer() {
    const currentBox = this.blockMatrix[this.playerPosition.y][
      this.playerPosition.x
      ];
    const continueGame = this.handleBoxContentInteraction(currentBox);

    if (!continueGame) {
      return;
    }
    currentBox.toggleOccupation();
    this.playerTail.push({ ...this.playerPosition });
    if (this.playerTail.length > this.playerLength) {
      const lastElem = this.playerTail.shift();
      this.blockMatrix[lastElem.y][lastElem.x].toggleOccupation();
    }
  }

  handleBoxContentInteraction(currentBox) {
    if (currentBox.fruit) {
      currentBox.toggleFruit();
      this.playerLength += 1;
      this.setFruit();
    }
    if (this.isOccupiedByTail(this.playerPosition)) {
      this.resetGame();
      return false;
    }
    return true;
  }

  isOccupiedByTail(coords) {
    const tailWithoutCurrent = [...this.playerTail].slice(
      0,
      this.playerTail.length
    );
    let occupied = false;
    tailWithoutCurrent.forEach(box => {
      if (box.x === coords.x && box.y === coords.y) {
        occupied = true;
      }
    });
    return occupied;
  }

  setFruit() {
    const randX = Math.floor(Math.random() * this.x);
    const randY = Math.floor(Math.random() * this.y);
    if (!this.isOccupiedByTail({x: randX, y: randY})) {
      this.blockMatrix[randY][randX].toggleFruit();
    } else {
      this.setFruit();
    }
  }

  initGame() {
    this.movingDirection = "Right";
    this.playerLength = 1;
    this.playerTail = [];
    this.setFruit();
    this.spawnPlayer();
  }

  createMap() {
    this.blockMatrix = [];
    for (let i = 0; i < this.y; i++) {
      this.blockMatrix[i] = [];
      for (let j = 0; j < this.x; j++) {
        const block = this.createBlock();
        this.blockMatrix[i][j] = block;
        this.shadowRoot.appendChild(block);
      }
    }
  }

  resetGame() {
    this.blockMatrix.forEach(row => {
      row.forEach(block => {
        block.removeOccupation();
      });
    });
    this.initGame();
  }

  createBlock() {
    const block = document.createElement("snake-block");
    block.style.width = `${this.blockWidth}px`;
    block.style.height = `${this.blockWidth}px`;
    block.style.flexBasis = `${100 / this.x}%`;
    return block;
  }
}

if (!customElements.get("snake-game")) {
  customElements.define("snake-game", SnakeGame);
}
