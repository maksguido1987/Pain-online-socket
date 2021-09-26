import React from 'react';
import canvasState from 'store/canvasState';
import toolState from 'store/toolState';
import Brush from 'tools/Brush';
import Circle from 'tools/Circle';
import Eraser from 'tools/Eraser';
import Line from 'tools/Line';
import Rect from 'tools/Rect';
import '../styles/toolbar.scss';

const ToolBar = () => {
  const changeColor = (e) => {
    toolState.setStrokeColor(e.target.value);
    toolState.setFillColor(e.target.value);
  };

  const download = () => {
    const dataURL = canvasState.canvas.toDataURL();
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = canvasState.session + '.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className='toolbar'>
      <button
        className='toolbar__btn brush'
        onClick={() =>
          toolState.setTool(
            new Brush(
              canvasState.canvas,
              canvasState.socket,
              canvasState.session
            )
          )
        }
      />
      <button
        className='toolbar__btn rect'
        onClick={() =>
          toolState.setTool(
            new Rect(
              canvasState.canvas,
              canvasState.socket,
              canvasState.session
            )
          )
        }
      />
      <button
        className='toolbar__btn circle'
        onClick={() =>
          toolState.setTool(
            new Circle(
              canvasState.canvas,
              canvasState.socket,
              canvasState.session
            )
          )
        }
      />
      <button
        className='toolbar__btn eraser'
        onClick={() =>
          toolState.setTool(
            new Eraser(
              canvasState.canvas,
              canvasState.socket,
              canvasState.session
            )
          )
        }
      />
      <button
        className='toolbar__btn line'
        onClick={() =>
          toolState.setTool(
            new Line(
              canvasState.canvas,
              canvasState.socket,
              canvasState.session
            )
          )
        }
      />
      <input onChange={(e) => changeColor(e)} type='color' />
      <button
        className='toolbar__btn undo'
        onClick={() => canvasState.undo()}
      />
      <button
        className='toolbar__btn redo'
        onClick={() => canvasState.redo()}
      />
      <button className='toolbar__btn save' onClick={() => download()} />
    </div>
  );
};

export default ToolBar;
