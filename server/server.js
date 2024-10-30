const express = require('express');
const connectDB = require('./config/database');


const app = express();

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