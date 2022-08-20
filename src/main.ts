import "./style.css";

const cvs = document.getElementById("canvas");

// @ts-ignore
const ctx: CanvasRenderingContext2D = cvs.getContext("2d");

// ctx.fillStyle = "#cccccc";
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
    this.dots = [

    ];
  }
}

class Item {
  t: number;
  dots: Dot[];
  c: string;
  constructor(t: number) {
    this.t = t;
    this.dots = [];
    this.c = "#fff";
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
  status: string;
  speed: number;
  speedUp: boolean;
  timer: number;
  ctx: CanvasRenderingContext2D;
  fullLine: number[]
  constructor(ctx: CanvasRenderingContext2D) {
    this.status = "等待中"
    this.speed = 0
    this.speedUp = false
    this.timer = 0
    this.fullLine = []
    this.ctx = ctx;
    this.floor = new Floor();
  }
  start = () => {
    this.item = undefined;
    this.loop();
    this.compute();

    this.status = "掉落中";
    // this.addItemLoop()

    // 映射键盘按键
    document.body.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case 38: {
          // move(0);
          console.log("up");
          break;
        }

        case 39: {
          // move(1);
          console.log("right");
          // window.clearTimeout(this.timer);
          this.move(1);
          break;
        }

        case 40: {
          // move(2);
          console.log("down");
          window.clearTimeout(this.timer);
          // // todo: 解决重复计算的问题
          this.speedUp = true;
          this.compute();
          break;
        }

        case 37: {
          // move(3);
          console.log("left");
          this.move(-1);
          break;
        }
      }
    });

    document.body.addEventListener("keyup", (e) => {
      switch (e.keyCode) {
        case 38: {
          console.log("up keyup");
          break;
        }

        case 39: {
          console.log("right keyup");
          break;
        }

        case 40: {
          console.log("down keyup");
          this.speedUp = false;
          break;
        }

        case 37: {
          console.log("left keyup");
          break;
        }
      }
    });
  };

  move = (d: number) => {
    let pengzhuang = false;

    this.item?.dots.forEach((dot) => {
      // 落地

      if (dot.x + d < 0 || dot.x + d >= WIDTH) {
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

    if (pengzhuang) {
    } else {
      this.item?.dots.forEach((dot) => {
        dot.x += d;
      });
    }
  };

  addItem = () => {
    const num = Math.floor(Math.random() * 4);
    console.log("num");
    console.log(num);
    const item = new Item(num);
    // const item = new Item(2);
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

    console.log(JSON.stringify(this.floor.dots));

    switch (this.status) {
      case "掉落中": {
        console.log("掉落中");
        let luodi = false;

        this.item?.dots.forEach((dot) => {
          if (dot.y + 1 >= HEIGHT) {
            luodi = true;
          } else {
            this.floor.dots.forEach((fdot) => {
              if (dot.x === fdot.x && dot.y + 1 === fdot.y) {
                luodi = true;
              }
            });
          }
        });

        if (luodi) {
          // 取消加速
          this.speedUp = false;

          // 将item合并到floor
          const allDots = this.floor.dots.concat(this.item?.dots as Dot[]);

          console.log("allDots");
          console.log(allDots);

          // this.item = undefined

          let fullLine: number[] = [];
          for (let i = 0; i < HEIGHT; i++) {
            const line = allDots.filter((j) => j.y === i);
            if (line.length === WIDTH) {
              fullLine.push(i);
            }
          }

          this.fullLine = fullLine

          console.log("fullLine");
          console.log(fullLine);

          if (fullLine.length > 0) {
            this.item = undefined;
            this.floor.dots = allDots.filter(
              (i) => !fullLine.some((j) => j === i.y)
            );

            this.status = "消除中";
          } else {
            this.item = undefined;
            this.floor.dots = allDots;
            this.status = "生成中";
          }
        } else {
          this.item?.dots.forEach((dot) => {
            dot.y += 1;
          });
        }

        break;
      }

      case "生成中": {
        console.log("生成中");

        this.addItem();
        this.status = "掉落中";
        break;
      }
      case "消除中": {
        console.log("消除中");

        this.fullLine.map(f => {
          this.floor?.dots.forEach((dot) => {
            console.log("111111",dot)
            if (dot.y < f) {
              dot.y ++;
            }
          });
        })

        


        this.status = "生成中";
        break;
      }
      default:
    }

    let over = false;
    this.floor.dots.forEach((fdot) => {
      if (fdot.y <= 1) {
        console.log("Game Over");
        over = true;
      }
    });

    if (!over) {
      if (this.speedUp) {
        this.timer = setTimeout(this.compute, 16);
      } else {
        this.timer = setTimeout(this.compute, 1000);
      }
    }
  };
  render = () => {
    // console.log(this.floor);
    // console.log(this.item);
    ctx.clearRect(0, 0, 300, 300);
    this.ctx.fillStyle = "#000";
    ctx.fillRect(
      0,
      0,
      WIDTH * UNIT + (WIDTH + 1) * PADDING,
      HEIGHT * UNIT + (HEIGHT + 1) * PADDING
    );

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
