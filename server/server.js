const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');
const cloudinary = require('./config/cloudinary');


const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
   
// express.json and express-fileUpload are two middleware
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));

cloudinary.cloudinaryConnect();

dotenv.config();
const PORT = process.env.PORT || 4000;

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Welcome to Educational Platform..., where you can  learn anything for free...!!!');
});

app.get('/signup', (req, res) => {
    try {

    }
    catch(err){
        console.log(err);
    }
})

app.get('/login', (req, res) => {
    try {

    }
    catch(err){
        console.log(err);
    }
})





connectDB()
    .then(() => {
        try{
            console.log('Database connected');
            app.listen(3000, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }
        catch(err){
            console.log('Error while connecting the server',err);
        }
    })
    .catch((err) => {
        console.log('Error while connecting the database',err);
    });