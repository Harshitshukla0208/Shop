const express = require('express');
const path = require('path');
const { PORT } = require('./config/serverConfig.js');
const connectDB = require('./config/dbconfig.js');
const multer = require('multer');
const mongoose = require("mongoose");
const cors = require ("cors");
const jwt = require("jsonwebtoken");

const app = express()
app.use(express.json());
app.use(cors());

// Image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// Creating upload endpoint
app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: true,
        image_url: `http://localhost:${PORT}/images/${req.file.filename}`
    });
});

// Schema
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    available: {
        type: Boolean,
        default: true
    }
});

app.post('/addproduct', async(req, res) => {

    let products = await Product.find({});
    let id;
    if(products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else{
        id = 1;
    }
    
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save(); //for saving data in mongodb
    console.log("saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

app.post('/removeproduct', async(req, res) => {
    await Product.findOneAndDelete({id: req.body.id});
    console.log(`${req.body.name} has removed`);
    res.json({
        success: true,
        name: req.body.name
    })
})

app.get('/allproducts', async(req,res) => {
    let products = await Product.find({});
    console.log("all products fetched");
    res.send(products);
})


//schema creating for user model

const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
})

//creating end point for registering users
app.post('/signup', async(req, res) => {
    let check = await Users.findOne({email: req.body.email});
    if(check){
        return res.status(400).json({
            success: false, 
            errors: "existing user found with same email address",
        })
    }
    //if there is no user we will create the user with this empty cart
    let cart = {};
    for(let i = 0; i < 300; i++){
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })
    //now user has been created now
    //saving the user data in db
    await user.save();

    //creating token for user
    const data = {
        user: {
            id: user.id
        }
    }

    //after generating data we will creatting the token of that user with that data
    const token = jwt.sign(data, 'secret_ecom');
    res.json({
        success: true, token
    })
})

//creating end point for user login
app.post('/login', async(req,res) => {
    let user = await Users.findOne({email: req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){ //if password is correct then we will create the token
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({success: true, token});
        }
        else{ //if password is in correct
            res.json({
                success: false,
                errors: "wrong password"
            });
        }
    }
    else{ //if user is not available with the given email id
        res.json({
            success: false,
            errors: "wrong email id"
        })
    }
})

//creating endpoint for new collections
app.get('/newcollections' ,async(req,res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-6); //usig this we get recently added 6 products
    console.log("new collections fetched");
    res.send(newcollection);
})

//creating end point for popular in women section
app.get('/popularinwomen' ,async(req,res) => {
    let products = await Product.find({category: "women"});
    let newcollection = products.slice(0,3); //usig this we get recently added 6 products
    console.log("popular in women fetched");
    res.send(newcollection);
})


// Start the server
app.listen(PORT, async function () {
    console.log('Server started on port ' + PORT);
    
    try {
        await connectDB();
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
});
