import db from '../model/db.js';
import { Product } from '../model/productSchema.js';
import { User } from '../model/userSchema.js';
import {body, validationResult} from 'express-validator';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

const controller = {

    getIndex: async function(req, res) {
        try{
            const product_list = [];
            const resp = await Product.find({});
            for(let i = 0; i < resp.length; i++) {
                product_list.push({
                    name: resp[i].name,
                    type: resp[i].type,
                    price: resp[i].price,
                    quantity: resp[i].quantity,
                    productpic: resp[i].productpic,
                });
            }
            res.render("index", {
                script: './js/index.js',
                product_list: product_list
            });
        } catch{
            res.sendStatus(400);   
        }       
    },

    /*
    getProducts: async function(req, res) {
        try{
            const product_list = [];
            const resp = await Product.find({});
            for(let i = 0; i < resp.products.length; i++) {
                product_list.push({
                    name: resp[i].name,
                    type: resp[i].type,
                    quantity: resp[i].quantity,
                    productpic: resp[i].productpic,
                });
            }    

            res.render('products', {
                product_list: product_list
            })
        } catch{
            res.sendStatus(400); 
        }
    },
    */

    register: async function(req, res) {

        const errors = validationResult(req);
        //console.log(errors)
        if(!errors.isEmpty()){
            if(errors.array().at(0).msg === "Email already exists!"){
                console.log(errors.array().at(0).msg)
                return res.sendStatus(405) //405 is for email that exists already
            }else{
                console.log(errors.array().at(0).msg + " of " + errors.array().at(0).path )
                return res.sendStatus(406) //406 is for invalid email value
            }
        }

        console.log("Register request received");
        console.log(req.body);
        const {name, email, password} = req.body

        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: name,
            email: email,
            password: hash
        });

        try{
            const result = await newUser.save();
            console.log(result);
            res.sendStatus(200);
        } catch (err){
            console.log("Username already exists!");
            console.error(err);
            res.sendStatus(500);
        }
    }
 
}

export default controller;