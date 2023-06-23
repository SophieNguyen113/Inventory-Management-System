const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require('./routes/userRoute');   
const productRoute = require('./routes/productRoute'); 
const contactRoute = require('./routes/contactRoute');   
const errorHandler = require('./middleware/errorMiddleWare'); 
const cookieParser = require('cookie-parser');
const path = require('path');   

const app = express();  

app.use(express.json());  
app.use(cookieParser())  
app.use(express.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoute);   
app.use("/api/products", productRoute);  
app.use("/api/contactus", contactRoute); 

app.get('/', (req, res) => {
    res.send('Home Page');    
}); 

app.use(errorHandler);  

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => 
            console.log(`Server running on port: ${PORT}`))}) 
    .catch((err) => console.log(err));    






