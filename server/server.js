const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');
const cloudinary = require('./config/cloudinary');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

// imports routes
const userRoutes = require('./routes/User');
const profileRoutes = require('./routes/Profile');
const courseRoutes = require('./routes/Course');
const paymentRoutes = require('./routes/Payment');


cloudinary.connectCloudinary();

dotenv.config();

const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// express.json and express-fileUpload are two middleware
const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));


// mount routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/payment', paymentRoutes);

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