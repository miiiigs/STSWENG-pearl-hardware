import mongoose from "mongoose";

import { Product } from "./model/productSchema.js";

//change this to the env
mongoose.connect('mongodb://127.0.0.1:27017/pearl_hardware_test', { useNewUrlParser: true, useUnifiedTopology: true });

createProducts();
console.log("Process can be terminated safely now");

function createProducts(){
    const products = [];

    products.push(new Product({
        name: "Nylon Brush",
        type: "Cleaning",
        quantity: 10,
        price: 100.00,
        productpic: "./uploads/nylon_brush.jpg"
    }));

    products.push(new Product({
        name: "PVC Transparent Apron",
        type: "Safety",
        quantity: "10",
        price: 400.00,
        productpic: "./uploads/pvc_transparent_apron.jpg"
    }));

    products.push(new Product({
        name: "Silicone Gun",
        type: "Industrial",
        quantity: "10",
        price: 350.00,
        productpic: "./uploads/silicone_gun.jpg"
    }));

    products.push(new Product({
        name: "Soldering Paste",
        type: "Welding",
        quantity: "10",
        price: 60.00,
        productpic: "./uploads/soldering_paste.jpg"
    }));

    for (let i = 0; i < products.length; i++) {
        products[i].save();
    }
}

