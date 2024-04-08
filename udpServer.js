const dgram = require('dgram');
const fs = require('fs');
const server = dgram.createSocket('udp4');


const PORT = 1234;

let receivedFileBuffer = [];

server.on('error', (err) => {
  console.log(`Erro no servidor: ${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`Servidor recebeu uma mensagem de ${rinfo.address}:${rinfo.port}`);
  const message = msg.toString();
  if (message === 'END') {
    console.log('Fim do arquivo recebido.');
    fs.writeFileSync('received_file.txt', Buffer.concat(receivedFileBuffer));
    receivedFileBuffer = []; 
  } else {
    receivedFileBuffer.push(msg);
  }
});

server.bind(PORT, () => {
  console.log(`Servidor UDP ouvindo na porta ${PORT}`);
});
