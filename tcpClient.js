const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = new net.Socket();

client.connect(1234, 'localhost', () => {
  console.log('Conectado ao servidor! Digite uma mensagem:');
});

rl.on('line', (input) => {
  console.log(`Enviando: ${input}`);
  client.write(input);
  if (input === "exit") {
    client.destroy(); // Fecha a conexão
    rl.close();
  }
});

client.on('data', (data) => {
  console.log('Recebido do servidor: ' + data);
});

client.on('close', () => {
  console.log('Conexão encerrada');
  rl.close();
});
