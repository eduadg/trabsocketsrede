const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`Erro no servidor: ${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`Servidor recebeu: ${msg} de ${rinfo.address}:${rinfo.port}`);
  server.send(`Echo: ${msg}`, rinfo.port, rinfo.address); // Echando a mensagem de volta para o cliente
});

const PORT = 1234;
server.bind(PORT, () => {
  console.log(`Servidor UDP ouvindo na porta ${PORT}`);
});
