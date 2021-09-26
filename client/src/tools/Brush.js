import Tool from './Tool';

export default class Brush extends Tool {
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
    this.socket.send(JSON.stringify({
      method: 'draw',
      id: this.id,
      figure: {
        type: 'finish',
      }
    }))
  }

  mouseDownHandler(e) {
    this.mouseDown = true;
    this.ctx.beginPath();  // начали рисовать новую линию
    this.ctx.moveTo(  // перемещает точку рисования в координаты x y
      e.pageX - e.target.offsetLeft,
      e.pageY - e.target.offsetTop
    );
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.socket.send(JSON.stringify({
        method: 'draw',
        id: this.id,
        figure: {
          type: 'brush',
          x: e.pageX - e.target.offsetLeft,
          y: e.pageY - e.target.offsetTop,
        }
      }))
    }
  }

  static draw(ctx, x, y) {
    ctx.lineTo(x, y);  // добавляет линию к текущему под пути с конечной точкой с координатами (x, y)
    ctx.stroke();
  }
}
