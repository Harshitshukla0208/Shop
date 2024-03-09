const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { PORT } = require('./config/serverConfig.js');
const connectDB = require('./config/dbconfig.js');
const multer = require('multer');
const mongoose = require("mongoose");

const app = express()
app.use(express.json());


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
    const product = new Product({
        id:req.body.id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

// Middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
