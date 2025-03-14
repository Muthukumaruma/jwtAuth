const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const db = require('./config/db');
const User = require('./routes/user');
const cookieParser = require("cookie-parser");
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

// middleware
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());

// Routes
app.use('/api', User);

//Db connection
db();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
