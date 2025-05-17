const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/db'); 



// .env faylidan yuklash
dotenv.config();

const app = express();
const PORT = process.env.PORT || 6666;

// Middlewarelarni ulash
app.use(cors()); 
app.use(bodyParser.json()); 



// Serverni ishga tushirish
app.listen(PORT, () => {
  console.log(`Server ${PORT} portida ishga tushdi`);
});
