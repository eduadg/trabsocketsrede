const dgram = require('dgram');
const fs = require('fs');
const PORT = 1234;
const HOST = 'localhost';
const client = dgram.createSocket('udp4');

function sendFile(filePath, callback) {
  fs.open(filePath, 'r', (err, fd) => {
    if (err) {
      console.error(`Erro ao abrir o arquivo: ${err}`);
      if (callback) callback(err);
      return;
    }

    const bufferSize = 1024;
    const buffer = Buffer.alloc(bufferSize);

    function readAndSend(position) {
      fs.read(fd, buffer, 0, bufferSize, position, (err, bytesRead) => {
        if (err) {
          console.error(`Erro ao ler o arquivo: ${err}`);
          fs.close(fd, () => {});
          if (callback) callback(err);
          return;
        }

        if (bytesRead > 0) {
          client.send(buffer.slice(0, bytesRead), 0, bytesRead, PORT, HOST, (err) => {
            if (err) {
              console.error(`Erro ao enviar dados: ${err}`);
              fs.close(fd, () => {});
              if (callback) callback(err);
              return;
            }
      
            readAndSend(position + bytesRead);
          });
        } else {
          // Finaliza a transmissão enviando "END"
          client.send('END', PORT, HOST, (err) => {
            fs.close(fd, () => {});
            if (err) {
              console.error(`Erro ao enviar 'END': ${err}`);
              if (callback) callback(err);
              return;
            }
            console.log(`${filePath} enviado.`);
            if (callback) callback();
          });
        }
      });
    }

    
    readAndSend(0);
  });
}

function generateTestFiles() {
  fs.writeFileSync('send_file_small.txt', 'Conteúdo do arquivo pequeno.');
  fs.writeFileSync('send_file_large.txt', 'Conteúdo do arquivo grande.');
}

generateTestFiles();

// Envio sequencial dos arquivos
sendFile('send_file_small.txt', () => {
  sendFile('send_file_large.txt');
});
