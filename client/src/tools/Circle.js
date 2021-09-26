import Tool from './Tool';

export default class Circle extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen();
  }

  listen() {
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
  }

  mouseUpHandler() {
    this.mouseDown = false;
    this.socket.send(
      JSON.stringify({
        method: 'draw',
        id: this.id,
        figure: {
          type: 'circle',
          x: this.startX,
          y: this.startY,
          r: this.r,
          color: this.ctx.fillStyle,
          stroke: this.ctx.strokeStyle,
        },
      })
    );
  }

  mouseDownHandler(e) {
    this.mouseDown = true;
    this.ctx.beginPath();
    this.startX = e.pageX - e.target.offsetLeft;
    this.startY = e.pageY - e.target.offsetTop;
    this.saved = this.canvas.toDataURL();
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      let curentX = e.pageX - e.target.offsetLeft;
      let curentY = e.pageY - e.target.offsetTop;
      let width = curentX - this.startX;
      let height = curentY - this.startY;
      this.r = Math.sqrt(width ** 2 + height ** 2);
      this.draw(this.startX, this.startY, this.r);
    }
  }

  draw(x, y, r) {
    const img = new Image();
    img.src = this.saved;
    img.onload = async function () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.stroke();
    }.bind(this);
  }

  static staticDraw(ctx, x, y, r, color, stroke) {
    ctx.fillStyle = color;
    ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill(); // заливка
    ctx.stroke(); // обводка
  }
}
