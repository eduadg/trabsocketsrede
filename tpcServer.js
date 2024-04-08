const net = require('net');

const server = net.createServer((socket) => {
  console.log('Cliente conectado.');

  socket.on('data', (data) => {
    console.log('Dados recebidos do cliente:', data.toString());
    socket.write('Echo: ' + data);
  });

  socket.on('end', () => {
    console.log('Cliente desconectado.');
  });

  socket.on('error', (err) => {
    console.error('Erro de socket:', err);
  });
});

const PORT = 1234;
server.listen(PORT, () => {
  console.log(`Servidor TCP ouvindo na porta ${PORT}`);
});
