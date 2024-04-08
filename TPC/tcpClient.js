const net = require('net');
const readline = require('readline');
const fs = require('fs');

// Gera arquivos de teste
function generateTestFiles() {
  fs.writeFileSync('send_file_small.txt', 'a'.repeat(1500));
  fs.writeFileSync('send_file_large.txt', 'a'.repeat(15000));
}

// Envia arquivo
function sendFile(filename, client) {
  const readStream = fs.createReadStream(filename);

  readStream.on('data', (chunk) => {
    client.write(chunk);
  });

  readStream.on('end', () => {
    console.log(`${filename} foi enviado.`);
     client.write('EOF');
  });

  readStream.on('error', (err) => {
    console.error('Erro ao ler o arquivo:', err);
  });
}

// Configuração inicial
generateTestFiles();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = new net.Socket();

client.connect(1234, 'localhost', () => {
  console.log('Conectado ao servidor! Digite "sendfiles" para enviar arquivos ou uma mensagem:');
});

rl.on('line', (input) => {
  if (input === "sendfiles") {
    // Aqui, enviamos os arquivos
    console.log('Enviando arquivos...');
    sendFile('send_file_small.txt', client);
    sendFile('send_file_large.txt', client);
  } else if (input === "exit") {
    client.end(); 
    rl.close();
  } else {
    console.log(`Enviando: ${input}`);
    client.write(input);
  }
});

client.on('data', (data) => {
  console.log('Recebido do servidor: ' + data);
});

client.on('close', () => {
  console.log('Conexão encerrada');
  rl.close();
});

client.on('error', (error) => {
  console.error('Erro de conexão:', error);
  rl.close();
});
