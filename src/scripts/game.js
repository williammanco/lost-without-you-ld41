const env = require('./env.js');
const World = require('./core/world');

//require("howler");

class Game {

  constructor() {
    this.build();
  }

  build() {
    this.env = env;
    this.debug = location.hash.indexOf('debug') > -1;
    this.resolution = {};

    this.setupDOM();
    this.setupInputs();
    this.setupWorld();
    this.setupSounds();
    this.onResize();
    this.start();
    this.observe();
  }

  log(...args) {
    if(window.env === 'development') {
      console.log(...args);
    }
  }

  setupDOM() {
    this.dom = {};
    this.dom.container = document.querySelector('.container');
  }

  setupInputs() {
  }

  setupWorld() {
    this.world = new World({ game: this });
  }

  setupSounds() {
    this.sounds = {};
  }

  playSound(sound, config = null) {
    if(!this.muted) {
      if(config && config.volume) {
        sound.volume(config.volume);
      }
      if(config && config.rate) {
        sound.rate(config.rate);
      }
      sound.play();
    }
  }

  setState(state) {
    if(this.state_current) {
      this.states[this.state_current].deactivate();
      this.env.eventful.trigger(`${this.state_current}-state-deactivate`);
      this.log(`${this.state_current} state deactivated`);
    }
    this.state_current = state;
    this.states[this.state_current].activate();
    this.env.eventful.trigger(`${this.state_current}-state-activate`);
    this.log(`${this.state_current} state activated`);
  }

  observe() {
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('keydown', (e) => this.onKeydown(e));
    window.addEventListener('keyup', (e) => this.onKeyup(e));
  }

  onResize() {
    let ratioWin = window.innerWidth / window.innerHeight;
    let ratioGame = 16 / 9;

    if(ratioWin > ratioGame) {
      this.resolution.x = window.innerHeight * ratioGame;
      this.resolution.y = window.innerHeight;
    } else {
      this.resolution.x = window.innerWidth;
      this.resolution.y = window.innerWidth / ratioGame;
    }

    this.aspect = this.resolution.x / this.resolution.y;
    this.dpr = window.devicePixelRatio > 1 ? 2 : 1;

    this.dom.container.style.width = `${this.resolution.x}px`;
    this.dom.container.style.height = `${this.resolution.y}px`;

    this.domOffset = {
      x: Math.round(this.dom.container.offsetLeft),
      y: Math.round(this.dom.container.offsetTop)
    };

    this.env.eventful.trigger('game-resize', {
      resolution: this.resolution,
      aspect: this.aspect,
      dpr: this.dpr,
      domOffset: this.domOffset
    });
  }

  onKeydown(e) {
    e;
  }

  onKeyup(e) {
    e;
  }

  onPointerStart(e) {
    e;
  }

  onPointerMove(e) {
    e;
  }

  onPointerEnd(e) {
    e;
  }

  start() {
    this.raf = this.animate();
  }

  stop() {
    window.cancelAnimationFrame(this.raf);
  }

  update() {
  }

  animate() {
    this.update();
    this.env.eventful.trigger('game-animate');
    this.raf = window.requestAnimationFrame(() => this.animate());
  }

}

module.exports = new Game();