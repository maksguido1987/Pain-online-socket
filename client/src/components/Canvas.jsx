/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import { observer } from 'mobx-react-lite';
import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/esm/Modal';
import { useParams } from 'react-router-dom';
import Rect from '../tools/Rect';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';
import Line from '../tools/Line';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import '../styles/canvas.scss';
import Brush from '../tools/Brush';

const Canvas = observer(() => {
  const canvasRef = useRef();
  const inputRef = useRef();
  const params = useParams();
  const [modal, setModal] = useState(true);

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    const ctx = canvasRef.current.getContext('2d');
    axios
      .get(`http://pain-online.cloudno.de/image?id=${params.id}`)
      .then((response) => {
        const img = new Image();
        img.src = response.data;
        img.onload = () => {
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          ); // очищает канвас
          ctx.drawImage(
            img,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          ctx.stroke();
        };
      });
  }, []);

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket('ws://pain-online.cloudno.de');
      canvasState.setSocket(socket);
      canvasState.setSessionId(params.id);
      toolState.setTool(new Brush(canvasRef.current, socket, params.id));
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            id: params.id,
            username: canvasState.username,
            method: 'connection',
          })
        );
      };
      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.method) {
          case 'connection':
            console.log(`Пользователь ${msg.username} подключился`);
            break;
          case 'draw':
            drawHandler(msg);
            break;
          default:
            return;
        }
      };
    }
  }, [canvasRef.current]);

  const drawHandler = (msg) => {
    const figure = msg.figure;
    const ctx = canvasRef.current.getContext('2d');
    switch (figure.type) {
      case 'finish':
        ctx.beginPath();
        break;
      case 'brush':
        Brush.draw(ctx, figure.x, figure.y);
        break;
      case 'eraser':
        Eraser.draw(ctx, figure.x, figure.y);
        break;
      case 'rect':
        Rect.staticDraw(
          ctx,
          figure.x,
          figure.y,
          figure.width,
          figure.height,
          figure.color,
          figure.stroke,
        );
        break;
      case 'circle':
        Circle.staticDraw(ctx, figure.x, figure.y, figure.r, figure.color);
        break;
      case 'line':
        Line.staticDraw(ctx, figure.x1, figure.y1, figure.x2, figure.y2, figure.color);
        break;
      default:
        return;
    }
  };

  const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL());
    axios.post(`http://pain-online.cloudno.de/image?id=${params.id}`, {
      img: canvasRef.current.toDataURL(),
    });
  };

  const connectionHandler = () => {
    canvasState.setUserName(inputRef.current.value);
    setModal(false);
  };

  return (
    <div className='canvas'>
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header closeButton>
          <Modal.Title>Введите ваше имя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type='text' ref={inputRef} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => connectionHandler()}>
            Войти
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        onMouseDown={() => mouseDownHandler()}
      ></canvas>
    </div>
  );
});

export default Canvas;
