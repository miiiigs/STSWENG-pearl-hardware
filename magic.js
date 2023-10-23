import mongoose from "mongoose";

import { Product } from "./model/productSchema.js";

//change this to the env
mongoose.connect('mongodb://127.0.0.1:27017/pearl_hardware_test', { useNewUrlParser: true, useUnifiedTopology: true });

createProducts();
console.log("Process can be terminated safely now");

function createProducts(){
    const products = [];
    products.push(new Product({
        name: "Brush",
        type: "Cleaning",
        quantity: 10,
        price: 100.00,
        productpic: "./uploads/nylon_brush.jpg"
    }));
    
    products.push(new Product({
        name: "Glasses",
        type: "Safety",
        quantity: 50,
        price: 12.99,
        productpic: "./uploads/safety_glasses.jpg"
    }));
    
    products.push(new Product({
        name: "Gloves",
        type: "Welding",
        quantity: 20,
        price: 25.50,
        productpic: "./uploads/welding_gloves.jpg"
    }));
    
    products.push(new Product({
        name: "Fan",
        type: "Industrial",
        quantity: 5,
        price: 199.99,
        productpic: "./uploads/industrial_fan.jpg"
    }));
    
    products.push(new Product({
        name: "Pipe Fittings",
        type: "Brass Fittings",
        quantity: 30,
        price: 8.75,
        productpic: "./uploads/brass_pipe_fittings.jpg"
    }));
    
    products.push(new Product({
        name: "Wipes",
        type: "Cleaning",
        quantity: 100,
        price: 7.49,
        productpic: "./uploads/cleaning_wipes.jpg"
    }));
    
    products.push(new Product({
        name: "Helmet",
        type: "Welding",
        quantity: 15,
        price: 49.99,
        productpic: "./uploads/welding_helmet.jpg"
    }));
    
    products.push(new Product({
        name: "Industrial Boots",
        type: "Industrial",
        quantity: 25,
        price: 69.95,
        productpic: "./uploads/industrial_work_boots.jpg"
    }));
    
    products.push(new Product({
        name: "Valve",
        type: "Brass Fittings",
        quantity: 10,
        price: 15.25,
        productpic: "./uploads/brass_ball_valve.jpg"
    }));
    
    products.push(new Product({
        name: "Cones",
        type: "Safety",
        quantity: 10,
        price: 29.99,
        productpic: "./uploads/safety_cones.jpg"
    }));
    
    products.push(new Product({
        name: "Wire",
        type: "Welding",
        quantity: 5,
        price: 16.75,
        productpic: "./uploads/welding_wire.jpg"
    }));
    
    products.push(new Product({
        name: "Ear Plugs",
        type: "Industrial",
        quantity: 100,
        price: 4.99,
        productpic: "./uploads/industrial_ear_plugs.jpg"
    }));
    
    products.push(new Product({
        name: "Elbow Fitting",
        type: "Brass Fittings",
        quantity: 20,
        price: 6.50,
        productpic: "./uploads/brass_elbow_fitting.jpg"
    }));
    
    products.push(new Product({
        name: "Broom",
        type: "Cleaning",
        quantity: 10,
        price: 19.99,
        productpic: "./uploads/cleaning_broom.jpg"
    }));
    
    products.push(new Product({
        name: "Harness",
        type: "Safety",
        quantity: 8,
        price: 45.75,
        productpic: "./uploads/safety_harness.jpg"
    }));
    
    products.push(new Product({
        name: "Mask",
        type: "Welding",
        quantity: 12,
        price: 35.00,
        productpic: "./uploads/welding_mask.jpg"
    }));
    
    products.push(new Product({
        name: "Tool Set",
        type: "Industrial",
        quantity: 3,
        price: 179.99,
        productpic: "./uploads/industrial_tool_set.jpg"
    }));
    
    products.push(new Product({
        name: "Tee Fitting",
        type: "Brass Fittings",
        quantity: 15,
        price: 9.25,
        productpic: "./uploads/brass_tee_fitting.jpg"
    }));
    
    products.push(new Product({
        name: "Detergent",
        type: "Cleaning",
        quantity: 50,
        price: 5.99,
        productpic: "./uploads/cleaning_detergent.jpg"
    }));
    
    products.push(new Product({
        name: "Helmet",
        type: "Safety",
        quantity: 20,
        price: 29.99,
        productpic: "./uploads/safety_helmet.jpg"
    }));
    
    products.push(new Product({
        name: "Rods",
        type: "Welding",
        quantity: 10,
        price: 14.50,
        productpic: "./uploads/welding_rods.jpg"
    }));
    
    products.push(new Product({
        name: "Ladder",
        type: "Industrial",
        quantity: 2,
        price: 99.99,
        productpic: "./uploads/industrial_ladder.jpg"
    }));
    
    products.push(new Product({
        name: "Union Fitting",
        type: "Brass Fittings",
        quantity: 8,
        price: 7.75,
        productpic: "./uploads/brass_union_fitting.jpg"
    }));
    
    products.push(new Product({
        name: "Vacuum Cleaner",
        type: "Cleaning",
        quantity: 5,
        price: 89.99,
        productpic: "./uploads/cleaning_vacuum_cleaner.jpg"
    }));
    
    products.push(new Product({
        name: "Gloves",
        type: "Safety",
        quantity: 30,
        price: 9.99,
        productpic: "./uploads/safety_gloves.jpg"
    }));
    
    products.push(new Product({
        name: "Clamp",
        type: "Welding",
        quantity: 7,
        price: 19.75,
        productpic: "./uploads/welding_clamp.jpg"
    }));
    
    products.push(new Product({
        name: "Dust Mask",
        type: "Industrial",
        quantity: 20,
        price: 3.99,
        productpic: "./uploads/industrial_dust_mask.jpg"
    }));
    
    products.push(new Product({
        name: "Check Valve",
        type: "Brass Fittings",
        quantity: 15,
        price: 12.50,
        productpic: "./uploads/brass_check_valve.jpg"
    }));
    
    products.push(new Product({
        name: "Mop",
        type: "Cleaning",
        quantity: 12,
        price: 14.99,
        productpic: "./uploads/cleaning_mop.jpg"
    }));
    
    products.push(new Product({
        name: "Goggles",
        type: "Safety",
        quantity: 25,
        price: 11.99,
        productpic: "./uploads/safety_goggles.jpg"
    }));
    
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

