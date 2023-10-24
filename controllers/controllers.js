import db from '../model/db.js';
import { Product } from '../model/productSchema.js';
import { User } from '../model/userSchema.js';
import { Order } from '../model/orderSchema.js';
import {body, validationResult} from 'express-validator';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

const controller = {
    

    getIndex: async function(req, res) {
        try{
            
            //getProducts function
            var product_list = [];
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
            
            // sortProducts function
            const sortValue = req.query.sortBy;
            console.log(sortValue);
            if(sortValue !== undefined){
                switch(sortValue){
                    case 'def':
                        
                        break;
                    case 'price_asc':
                        product_list.sort((a, b) => a.price-b.price);
                        console.log(product_list);
                        break;
                    case 'price_desc':
                        product_list.sort((a, b) => b.price-a.price);
                        console.log(product_list);
                        break;
                    case 'name_asc':
                        product_list.sort((a,b) => a.name.localeCompare(b.name));
                        console.log(product_list);
                        break;
                    case 'name_desc':
                        product_list.sort((a,b) => b.name.localeCompare(a.name));
                        console.log(product_list);
                        break;         
                }   
            }
            
            res.render("index", {
                product_list: product_list,
                isHomePage: true,
            });
        } catch{
            res.sendStatus(400);   
        }       
    },

    getAllProducts: async function(req, res) {
        try{
            
            //getProducts function
            var product_list = [];
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
            
            // sortProducts function
            const sortValue = req.query.sortBy;
            console.log(sortValue);
            if(sortValue !== undefined){
                switch(sortValue){
                    case 'def':
                        
                        break;
                    case 'price_asc':
                        product_list.sort((a, b) => a.price-b.price);
                        console.log(product_list);
                        break;
                    case 'price_desc':
                        product_list.sort((a, b) => b.price-a.price);
                        console.log(product_list);
                        break;
                    case 'name_asc':
                        product_list.sort((a,b) => a.name.localeCompare(b.name));
                        console.log(product_list);
                        break;
                    case 'name_desc':
                        product_list.sort((a,b) => b.name.localeCompare(a.name));
                        console.log(product_list);
                        break;         
                }   
            }

            
            res.render("all_products", {
                product_list: product_list,
                isAllProductsPage: true,
                script: './js/sort.js',
            });
        } catch{
            res.sendStatus(400);   
        }       
    },

    getLogin: async function(req, res) {
        try{
            
            
            res.render("login", {
            });
        } catch{
            res.sendStatus(400);   
        }       
    },
    getUserProfile: async function(req, res) {
        try{
            
            res.render("userprofile", {
            });
        } catch{
            res.sendStatus(400);   
        }       
    },


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

    sortProducts: async function(req, res){
		console.log("Searching for a product!");
		
		var query = req.body.sortValue;
        var resp = await Product.find({});
        const product_list = [];
        for(let i = 0; i < resp.length; i++) {
            product_list.push({
                name: resp[i].name,
                type: resp[i].type,
                price: resp[i].price,
                quantity: resp[i].quantity,
                productpic: resp[i].productpic,
            });
        }
        switch(query){
            case 'def':
		        
                break;
            case 'price_asc':
                product_list.sort((a, b) => a.price-b.price);
                console.log(product_list);
                res.render("hehe", {
                    product_list: product_list
                });
                break;
            case 'price_desc':
                product_list.sort((a, b) => a.price-b.price);
                console.log(product_list);
                res.render("hehe", {
                    script: './js/index.js',
                    product_list: product_list
                });
                break;   
        }   	
    },

    /*
    PLS DON'T DELETE
    COMMENTED OUT FOR DEMONSTRATION PURPOSES
    
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

    checkout: async function(req, res) {
        try{
            res.render("checkout", {
                script: './js/checkout.js'
            })
            
        } catch{
            res.sendStatus(400);   
        }       
    },

    //NOTE READ: WHEN BEING REDIRECTED AFTER SUCCESSFUL PAYMENT DO NOT CLICK AWAY FROM WEBSITE REDIRECT BACK FOR THE STATUS TO BE UPDATED
    
    postCheckout: async function(req, res) { //gets all the items in the cart using its mongodb id then adds them all up for a total to be redirected and paid in paymongo website using paymongo api
        //console.log(req.body);      
        const {items, amount} = req.body
        const paymongoAPIkey = "sk_test_w5Y6STecLuzzZifC23r2HRnZ"

        let total = 0; //the total amount the user has to pay

        const itemsCheckout = [] //an array containing the _id of the products the user added in the cart
        const itemsNames = [] //an array containing the product names the user added to their cart

        for(let i = 0; i < items.length; i++){ //this for loop loops through the itemsCheckout array and for each one finds it in the product schema and creates an item checkout object needed in the api call
            const item = await Product.findById(items[i]).exec();
            itemsCheckout.push({
                currency: 'PHP',
                images: ['https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%2Fimages%3Fk%3Dsample&psig=AOvVaw0AFGkt28PQn4zNlauG_NGx&ust=1698039665576000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCKiesur4iIIDFQAAAAAdAAAAABAE'],
                amount: item.price * 100,
                description: 'description',
                name: item.name,
                quantity: parseInt(amount[i])
              })
              itemsNames.push(item.name)
              total += item.price * parseInt(amount[i]);
        }

        try{
            const order = new Order({
                userID: 123,
                items: itemsNames,
                date: Date.now(),
                status: 'Awaiting payment',
                amount: total,
                paymongoID: -1 //paymongoID of -1 means there is no record of a transaction in paymongo in other words it is to be ignored as the user did not even go to the checkout page of paymongo
            })

            const result = await order.save(); //save order to database
            //console.log(result);

            const options = {
                method: 'POST',
                headers: {accept: 'application/json', 'Content-Type': 'application/json', 'Authorization': `Basic ${btoa(paymongoAPIkey)}`},
                body: JSON.stringify({
                    data: {
                      attributes: {
                        billing: {name: 'Sample name', email: 'email@email.com', phone: '9000000000'},
                        send_email_receipt: false,
                        show_description: false,
                        show_line_items: true,
                        cancel_url: 'http:/localhost:3000/',
                        description: 'description',
                        line_items: itemsCheckout,
                        payment_method_types: ['card', 'gcash'],
                        reference_number: result._id, //store the order _id in database as the reference number
                        success_url: 'http://localhost:3000/checkoutSuccess/' + result._id
                      }
                    }
                  })
              };

            fetch('https://api.paymongo.com/v1/checkout_sessions', options) //this api call is to create a checkout session in paymongo
            .then(response => response.json())
            .then(async response => {

                //console.log(response.data.id)
                const addPaymongoID = await Order.findByIdAndUpdate(response.data.attributes.reference_number, {paymongoID : response.data.id}); //after redirecting to paymongo the paymongoID is updated using the paymongo generated id

                res.status(200);
                res.send(response.data.attributes.checkout_url.toString());
        })
        .catch(err => console.error(err));
        } catch (err){
            console.log("Placing order failed!");
            console.error(err);
            res.sendStatus(500);
        }
    },

    checkoutSuccess: async function(req, res) { //this is to update the order in the database, as of now only 2 status' exist (Awaiting payment, succeeded)
        const paymongoAPIkey = "sk_test_w5Y6STecLuzzZifC23r2HRnZ"

        const options = {method: 'GET', headers: {accept: 'application/json', 'Content-Type': 'application/json', 'Authorization': `Basic ${btoa(paymongoAPIkey)}`}};

        const ID = req.params.orderID;
        //console.log("Order ID: ", ID);
        
        const order = await Order.findById(ID);

        fetch('https://api.paymongo.com/v1/checkout_sessions/' + order.paymongoID , options) //this api call is to retrieved the checkout information in paymongo
        .then(response => response.json())
        .then(async response => { //console.log(response)
            try{
                const result = await Order.findByIdAndUpdate(ID, { status: response.data.attributes.payment_intent.attributes.status}); //update the status of the order in database using the status in paymongo
                
            }catch (err){
                console.log("Fetching order failed!");
                console.error(err);
                res.sendStatus(500);
            }
        })
        .catch(err => console.error(err));

        try{
            res.render("checkoutSuccess", {
                
            })
            
        } catch{
            res.sendStatus(400);   
        }       
    },

}

export default controller;
