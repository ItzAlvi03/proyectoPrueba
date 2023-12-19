const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa el paquete cors

const app = express();
const port = 3000;

app.use(cors()); // Habilita CORS para todas las rutas
app.use(bodyParser.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  database: 'bdprueba',
  user: 'root',
  password: '010203'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});

// Ruta para insertar un usuario
app.post('/insertarUsuario', (req, res) => {
  const { correo, nombre, contraseña } = req.body;

  const query = 'INSERT INTO usuario (correo, nombre, contraseña) VALUES (?, ?, ?)';
  db.query(query, [correo, nombre, contraseña], (err, result) => {
    if (err) {
      console.error('Error al insertar usuario:', err);
      res.status(500).send('Error al insertar usuario');
    } else {
      console.log('Usuario insertado correctamente');
      res.status(200).send('Usuario insertado correctamente');
    }
  });
});
app.post('/comprobarUsuario', (req, res) => {
    const { correo, contraseña } = req.body;
  
    const query = 'SELECT correo, contraseña FROM usuario WHERE correo = ? AND contraseña = ?';
    db.query(query, [correo, contraseña], (err, result) => {
      if (err) {
        console.error('Error al buscar usuario:', err);
        res.status(500).send('Error al buscar usuario');
      } else {
        res.status(200).json(result);
      }
    });
  });

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
