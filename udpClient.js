const dgram = require('dgram');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = dgram.createSocket('udp4');
const PORT = 1234;
const HOST = 'localhost';

console.log('Digite uma mensagem para enviar ao servidor UDP (Digite "exit" para sair):');

rl.on('line', (input) => {
  const message = Buffer.from(input);
  client.send(message, 0, message.length, PORT, HOST, (err) => {
    if (err) {
      console.error(err);
      client.close();
      rl.close();
    } else {
      console.log("Mensagem enviada: " + input);
      if (input === "exit") {
        client.close(); // Fecha o socket
        rl.close(); // Fecha o readline
      }
    }
  });
});
