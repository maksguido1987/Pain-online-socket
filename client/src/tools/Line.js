import Tool from './Tool';

export default class Line extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen();
  }

  listen() {
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
  }

  mouseDownHandler(e) {
    this.mouseDown = true;
    this.startX = e.pageX - e.target.offsetLeft;
    this.startY = e.pageY - e.target.offsetTop;
    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    this.saved = this.canvas.toDataURL();
  }

  mouseUpHandler(e) {
    this.mouseDown = false;
    this.socket.send(
      JSON.stringify({
        method: 'draw',
        id: this.id,
        figure: {
          type: 'line',
          x1: this.startX,
          y1: this.startY,
          x2: this.currentX,
          y2: this.currentY,
          color: this.ctx.fillStyle,
        },
      })
    );
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.currentX = e.pageX - e.target.offsetLeft;
      this.currentY = e.pageY - e.target.offsetTop;
      this.draw(this.currentX, this.currentY);
    }
  }

  draw(x, y) {
    const img = new Image();
    img.src = this.saved;
    img.onload = async function () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }.bind(this);
  }

  static staticDraw(ctx, x1, y1, x2, y2, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}
