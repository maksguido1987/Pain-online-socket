const express = require('express');
const cors = require('cors');
const app = express();
const WSServer = require('express-ws')(app); // широковещательная рассылка
const aWss = WSServer.getWss(); // все открытые соединения
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5002;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.ws('/', (ws, req) => {
  ws.on('message', (msg) => {  //принимает данные от клиента, полученные при установке подключения
    msg = JSON.parse(msg);
    switch (msg.method) {
      case 'connection':
        connectionHandler(ws, msg);
        break;
      case 'draw':
        broadcastConnection(ws, msg);
        break;
    }
  });
});

app.post('/image', (req, res) => {
  try {
    const data = req.body.img.replace('data:image/png;base64,', '');
    fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64');
    return res.status(200).json({message: 'Загружено'});
  } catch(error) {
    return res.status(500).json('error');
  }
});
app.get('/image', (req, res) => {
  try {
    const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`));
    const data = `data:image/png;base64,${file.toString('base64')}`;
    res.json(data);
  } catch(error) {
    return res.status(500).json('error');
  }
});

app.listen(PORT, () => console.log(`server started on PORT ${PORT}`));

const connectionHandler = (ws, msg) => {
  ws.id = msg.id;
  broadcastConnection(ws, msg);
}

const broadcastConnection = (ws, msg) => {
  aWss.clients.forEach((client) => {
    if (client.id === msg.id) {
      client.send(JSON.stringify(msg));
    }
  })
}
