//Importaciones
const fs = require('fs');
const http = require('http');
const axios = require('axios');

//Lectura de la tabla html
const readHTML = fs.readFileSync('index-table.html', { encoding: 'utf8', flag: 'r' });

//Divisiones del html para ingresar las filas
const inicio = (line) => line.substring(0, line.indexOf('</tbody>'));
const fin = (line) => line.substring(line.indexOf('</tbody>'));

//Funcion asyncrona que obtiene la informacion del link, proveedores
async function getDataFromProveedores() {
  const respProveedores = await axios.get('https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json');
  return respProveedores.data;
}

//Funcion asyncrona que obtiene la informacion del link, proveedores
async function getDataFromClientes() {
  const respClientes = await axios.get('https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json');
  return respClientes.data;
}

//Servidor que responde al puerto 8081. 
//Ruta de proveedores y ruta de clientes.
//Envia la tabla con las filas. 
http
  .createServer(async function (req, res) {
    if (req.url === "/api/clientes") {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      const dataClientes = await getDataFromClientes();
      let id, com, cont, fila = '';
      dataClientes.forEach(element => {
        id = element.idCliente;
        com = element.NombreCompania;
        cont = element.NombreContacto;
        fila += '<tr><td>' + id + '</td><td>' + com + '</td><td>' + cont + '</td></tr>';
      });
      res.end(inicio(readHTML).concat(fila, fin(readHTML)));
    }
    if (req.url === "/api/proveedores") {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      const dataProveerdores = await getDataFromProveedores();
      let id, com, cont, fila = '';
      dataProveerdores.forEach(element => {
        id = element.idproveedor;
        com = element.nombrecompania;
        cont = element.nombrecontacto;
        fila += '<tr><td>' + id + '</td><td>' + com + '</td><td>' + cont + '</td></tr>';
      });
      res.end(inicio(readHTML).concat(fila, fin(readHTML)));
    }
  })
  .listen(8081);

