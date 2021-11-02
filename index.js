const express = require('express');
const listEndpoints = require('express-list-endpoints');
const mongooseConecction = require('./models');
const api = require('./api');
const app = express();

app.use(express.json());
app.use('/api', api);

app.listen(3000);
mongooseConecction().catch(console.error);
console.log(listEndpoints(app));
