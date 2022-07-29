import "./style.css";

const cvs = document.getElementById("canvas");
const ctx: CanvasRenderingContext2D = cvs.getContext("2d");

ctx.fillStyle = "#cccccc";
ctx.fillRect(0, 0, 300, 300);

const WIDTH = 10;
const HEIGHT = 20;
const UNIT = 10;
const PADDING = 1;

class Dot {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Floor {
  dots: Dot[];
  // c: string;
  constructor() {
    this.dots = [];
  }
}

class Item {
  t: number;
  dots: Dot[];
  c: string;
  constructor(t: number) {
    // this.t = t;
    // this.dots = [new Dot(0, 0)];
    // this.c = "#fff";

    // this.t = t;
    // this.dots = [new Dot(0, 0),new Dot(0, 1),new Dot(1, 0),new Dot(1, 1)];
    // this.c = "#fff";

    // this.t = t;
    // this.dots = [new Dot(0, 0),new Dot(0, 1),new Dot(1, 1),new Dot(1, 2)];
    // this.c = "#fff";

    switch (t) {
      case 0: {
        this.t = t;
        this.dots = [
          new Dot(0, 0),
          new Dot(0, 1),
          new Dot(1, 0),
          new Dot(1, 1),
        ];
        this.c = "#fff";
        break;
      }
      case 1: {
        this.t = t;
        this.dots = [
          new Dot(0, 0),
          new Dot(0, 1),
          new Dot(1, 1),
          new Dot(1, 2),
        ];
        this.c = "#fff";
        break;
      }

      case 2: {
        this.t = t;
        this.dots = [
          new Dot(0, 0),
          new Dot(0, 1),
          new Dot(0, 2),
          new Dot(0, 3),
        ];
        this.c = "#fff";
        break;
      }

      case 3: {
        this.t = t;
        this.dots = [
          new Dot(0, 0),
          new Dot(0, 1),
          new Dot(0, 2),
          new Dot(1, 2),
        ];
        this.c = "#fff";
        break;
      }
    }
  }
}

class Game {
  item?: Item;
  floor: Floor;
  speed: number;
  speedUp: boolean;
  ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.floor = new Floor();
  }
  start = () => {
    this.item = undefined;
    this.loop();
    this.compute();
    // this.addItemLoop()

    // 映射键盘按键
    document.body.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case 38: {
          // move(0);
          console.log("up")
          break;
        }

        case 39: {
          // move(1);
          console.log("right")
          this.move(1)
          break;
        }

        case 40: {
          // move(2);
          console.log("down")

          // todo: 解决重复计算的问题
          this.speedUp = true
          this.compute()
          break;
        }

        case 37: {
          // move(3);
          console.log("left")
          this.move(-1)
          break;
        }
      }
    });

    document.body.addEventListener("keyup", (e) => {
      switch (e.keyCode) {
        case 38: {
          console.log("up keyup")
          break;
        }

        case 39: {
          console.log("right keyup")
          break;
        }

        case 40: {
          console.log("down keyup")
          this.speedUp = false
          break;
        }

        case 37: {
          console.log("left keyup")
          break;
        }
      }
    })
  };

  move = (d: number) => {


    let pengzhuang = false;

    this.item?.dots.forEach((dot) => {
      // 落地

      if (dot.x + d < 0 || dot.x + d >= 10) {
        pengzhuang = true;
        console.log("pengzhuang");
      } else {
        this.floor.dots.forEach((fdot) => {
          if (dot.y === fdot.y && dot.x + d === fdot.x) {
            pengzhuang = true;
            console.log("pengzhuang");
          }
        });
      }
    });

    if(pengzhuang) {

    } else {
      this.item?.dots.forEach((dot) => {
        dot.x += d;
      });
    }
  }

  addItem = () => {
    const num = Math.floor(Math.random() * 4);
    console.log("num");
    console.log(num);
    const item = new Item(num);
    this.item = item;
  };
  loop = () => {
    // console.log(this.item);
    this.render();
    window.requestAnimationFrame(this.loop);
  };
  end = () => {};
  compute = () => {
    // console.log("compute");

    let luodi = false;

    this.item?.dots.forEach((dot) => {
      // 落地

      if (dot.y + 1 >= 20) {
        luodi = true;
        console.log("luodi");
      } else {
        this.floor.dots.forEach((fdot) => {
          if (dot.x === fdot.x && dot.y + 1 === fdot.y) {
            luodi = true;
            console.log("luodi");
          }
        });
      }
    });

    if (luodi) {

      this.speedUp = false

      // 将item合并到floor
      this.floor.dots = this.floor.dots.concat(this.item.dots);
      // this.item = undefined;

      // 扫描完整的一行
      // this.floor.dots.forEach((fdot) => {
      //   if (fdot.y <= 1) {
      //     console.log("Game Over");
      //     over = true;
      //   }
      // });


      this.addItem();
    } else {
      this.item?.dots.forEach((dot) => {
        dot.y += 1;
      });
    }

    let over = false;
    this.floor.dots.forEach((fdot) => {
      if (fdot.y <= 1) {
        console.log("Game Over");
        over = true;
      }
    });

    if (!over) {
      if(this.speedUp) {
        requestAnimationFrame(this.compute)
      } else {
        setTimeout(this.compute, 1000);
      }
    }
  };
  render = () => {
    // console.log(this.floor);
    // console.log(this.item);
    ctx.clearRect(0, 0, 300, 300);
    this.ctx.fillStyle = "#ccc";
    ctx.fillRect(0, 0, WIDTH * UNIT + (WIDTH + 1) * PADDING, HEIGHT * UNIT + (HEIGHT + 1) * PADDING);

    this.item?.dots.forEach((dot) => {
      // console.log(dot);
      this.ctx.beginPath();
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(
        dot.x * UNIT + (dot.x + 1) * PADDING,
        dot.y * UNIT + (dot.y + 1) * PADDING,
        UNIT,
        UNIT
      );
      this.ctx.closePath();
    });

    this.floor?.dots.forEach((dot) => {
      // console.log(dot);
      this.ctx.beginPath();
      this.ctx.fillStyle = "green";
      this.ctx.fillRect(
        dot.x * UNIT + (dot.x + 1) * PADDING,
        dot.y * UNIT + (dot.y + 1) * PADDING,
        UNIT,
        UNIT
      );
      this.ctx.closePath();
    });
  };
}

const game = new Game(ctx);

game.start();
game.addItem();
