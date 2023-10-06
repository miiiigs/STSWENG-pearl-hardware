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
        const {fname,lname, email, password} = req.body

        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName: fname,
            lastName: lname,
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
    },

    login: async function(req, res) {
        console.log("hello");
        console.log(req.body);

        const existingUser = await User.findOne({email: req.body.email}); 

        if(existingUser && await bcrypt.compare(req.body.password, existingUser.password)) {
            return res.sendStatus(200);
        }
        console.log("Invalid email or password");
        res.sendStatus(500);
        
    },
	
	//searchProducts
	//So if you see this...you can access the results using the variable `product_list_search`, then render that data.
	searchProducts: async function(req,res){
		console.log("Searching for a product!");
		
		var query = req.query.product_query;
		
		console.log("Searching for " + query);
		
		const result = await Product.find({name: new RegExp('.*' + query + '.*', 'i')}, {_id:0, __v:0}).lean();
		
		console.log(result);
		console.log("So if you see this...you can access the results using the variable `product_list_search`, then render that data.");
		res.render("index", {product_list_search: result});
    },

}

export default controller;
