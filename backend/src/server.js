require('dotenv').config({ path: __dirname + '/../.env'});
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const path = require('path');
const app = express();   

const { connectDB } = require('./db/mongoDB');

const PORT = process.env.PORT || 9000;

// connect to db
connectDB();

// Configure CORS with specific options
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(express.urlencoded( { extended:false } ));
app.use(express.json());
// app.use('/',express.static(path.join(__dirname,'/public')));    
app.use('/api',require('./routes/routes.index'))

app.all('*',(request,response) => {
    response.status(404);
    if(request.accepts('html')){
        response.sendFile(path.join(__dirname,'views','404.html'));
    } else if(request.accepts('json')){
        response.json( {error:"404 not found"});
    } else {
        response.type('txt').send('404 not found');
    }
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

