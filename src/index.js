const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('./config/serverConfig.js');
const connectDB = require('./config/dbconfig.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, async function() {
    console.log('Server started on port ' + PORT);
    
    await connectDB();
    console.log('MongoDB connected');
});
