import db from '../model/db.js';
import { Product } from '../model/productSchema.js';
import { User } from '../model/userSchema.js';
import { Order } from '../model/orderSchema.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

const controller = {


    getIndex: async function (req, res) {
        try {
            console.log("USER ID" + req.session.userID);
            //getProducts function
            var product_list = [];
            const resp = await Product.find({});
            for (let i = 0; i < resp.length; i++) {
                product_list.push({
                    name: resp[i].name,
                    type: resp[i].type,
                    price: resp[i].price,
                    quantity: resp[i].quantity,
                    productpic: resp[i].productpic,
                    p_id: resp[i]._id
                });
            }

            // sortProducts function
            const sortValue = req.query.sortBy;
            console.log(sortValue);
            if (sortValue !== undefined) {
                switch (sortValue) {
                    case 'def':

                        break;
                    case 'price_asc':
                        product_list.sort((a, b) => a.price - b.price);
                        console.log(product_list);
                        break;
                    case 'price_desc':
                        product_list.sort((a, b) => b.price - a.price);
                        console.log(product_list);
                        break;
                    case 'name_asc':
                        product_list.sort((a, b) => a.name.localeCompare(b.name));
                        console.log(product_list);
                        break;
                    case 'name_desc':
                        product_list.sort((a, b) => b.name.localeCompare(a.name));
                        console.log(product_list);
                        break;
                }
            }

            res.render("index", {
                product_list: product_list,
                script: './js/index.js',
                isHomePage: true,
            });
        } catch {
            res.sendStatus(400);
        }
    },

    getLogin: async function (req, res) {
        try {
            res.render("login", {
                script: './js/login.js'
            });
        } catch {
            res.sendStatus(400);
        }
    },

    getRegister: async function (req, res) {
        try {
            res.render("register", {
                script: './js/register.js'
            });
        } catch {
            res.sendStatus(400);
        }
    },

    getAdmin: async function (req, res) {
        try {
            res.render("admin", {
                layout: 'admin'
            });
        } catch {
            res.sendStatus(400);
        }
    },


    getCategory: async function (req, res) {

        const category = req.params.category;
        console.log(category);

        try {

            //getProducts function
            var product_list = [];
            let resp;
            switch (category) {
                case 'allproducts':
                    resp = await Product.find({});
                    break;
                case 'welding':
                    resp = await Product.find({ type: 'Welding' });
                    break;
                case 'safety':
                    resp = await Product.find({ type: 'Safety' });
                    break;
                case 'cleaning':
                    resp = await Product.find({ type: 'Cleaning' });
                    break;
                case 'industrial':
                    resp = await Product.find({ type: 'Industrial' });
                    break;
                case 'brassfittings':
                    resp = await Product.find({ type: 'Brass Fittings' });
                    break;
            }

            console.log(resp.length)

            for (let i = 0; i < resp.length; i++) {
                product_list.push({
                    name: resp[i].name,
                    type: resp[i].type,
                    price: resp[i].price,
                    quantity: resp[i].quantity,
                    productpic: resp[i].productpic,
                    p_id: resp[i]._id
                });
            }

            // sortProducts function
            const sortValue = req.query.sortBy;
            console.log(sortValue);
            if (sortValue !== undefined) {
                switch (sortValue) {
                    case 'def':

                        break;
                    case 'price_asc':
                        product_list.sort((a, b) => a.price - b.price);
                        break;
                    case 'price_desc':
                        product_list.sort((a, b) => b.price - a.price);
                        break;
                    case 'name_asc':
                        product_list.sort((a, b) => a.name.localeCompare(b.name));
                        break;
                    case 'name_desc':
                        product_list.sort((a, b) => b.name.localeCompare(a.name));
                        break;
                }
            }


            res.render("all_products", {
                product_list: product_list,
                category: category,
                script: '/./js/sort.js',

            });
        } catch {
            res.sendStatus(400);
        }

    },

    getProductDesc: async function (req, res) {
        try {
            res.render("productDesc", {
            });
        } catch {
            res.sendStatus(400);
        }
    },

    getCart: async function (req, res) {
        try {
            res.render("add_to_cart", {

            });
        } catch {
            res.sendStatus(400);
        }
    },



    getUserProfile: async function (req, res) {
        try {

            res.render("userprofile", {
            });
        } catch {
            res.sendStatus(400);
        }
    },

    getAdminInventory: async function (req, res) {
        try {

            res.render("adminInventory", {
                layout: 'adminMain'
            });
        } catch {
            res.sendStatus(400);
        }
    },

    getAdmin: async function (req, res) {
        try {

            res.render("admin", {
                layout: 'adminMain'
            });
        } catch {
            res.sendStatus(400);
        }
    },




    register: async function (req, res) {

        const errors = validationResult(req);
        //console.log(errors)
        if (!errors.isEmpty()) {
            if (errors.array().at(0).msg === "Email already exists!") {
                console.log(errors.array().at(0).msg)
                return res.sendStatus(405) //405 is for email that exists already
            } else {
                console.log(errors.array().at(0).msg + " of " + errors.array().at(0).path)
                return res.sendStatus(406) //406 is for invalid email value
            }
        }

        console.log("Register request received");
        console.log(req.body);
        const { fname, lname, email, password } = req.body

        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName: fname,
            lastName: lname,
            email: email,
            password: hash
        });

        try {
            const result = await newUser.save();
            console.log(result);
            res.sendStatus(200);
        } catch (err) {
            console.log("Username already exists!");
            console.error(err);
            res.sendStatus(500);
        }
    },

    login: async function (req, res) {
        //console.log("hello");
        console.log(req.body);

        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser && await bcrypt.compare(req.body.password, existingUser.password)) {
            console.log("login successful");

            req.session.userID = existingUser._id;
            req.session.fName = existingUser.firstName;
            return res.sendStatus(200);
        }
        console.log("Invalid email or password");
        res.sendStatus(500);

    },

    logout: async function (req, res) {
        console.log("Logging out!");
        req.session.destroy();
        res.redirect('/');
    },

    getUser: async function (req, res) {
        if (req.session.userID) {
            console.log("USER ID" + req.session.userID);
            res.status(200).send(req.session.userID.toString());
        } else {
            res.sendStatus(400);
            console.log("Failed to get current user");
        }
    },
    //searchProducts
    searchProducts: async function (req, res) {
        console.log("Searching for a product!");

        var query = req.query.product_query;

        console.log("Searching for " + query);

        const result = await Product.find({ name: new RegExp('.*' + query + '.*', 'i') }, { __v: 0 }).lean();
        res.render("search_results", { product_list: result });
    },

    //getCart
    //gets the cart of the current user.
    getCart: async function (req, res) {
        console.log("getting " + req.session.userID + "(" + req.session.fName + ")'s cart");

        const result = await User.find({ _id: req.session.userID }, { cart: 1 });
        //console.log(result[0].cart);
        //console.log("Cart has been found? Can be accessed in handlebars using {{cart_result}}");
        res.render("add_to_cart", { cart_result: result[0].cart });
    },

    //addToCart
    //will add to cart using the product ID (mongodb ID)
    addToCart: async function (req, res) {
        console.log("Adding to cart");
        console.log(req.body);
        console.log("Attempting to add: " + req.body.id);

        //const query = "ObjectId('" + req.body.p_id + "')";
        const query = req.body.id;
        const temp = await Product.find({ _id: query }, { __v: 0 });
        const product_result = temp[0];
        const quant = req.body.quant;
        const id = req.session.userID + ":" + query;
        await User.updateOne(
            { _id: req.session.userID },
            {
                $push: {
                    cart: { product: product_result, quantity: quant, uniqueID: id }
                }
            }
        );
        console.log(product_result);
        //console.log(user_cart[0].cart);

        //user_cart[0].cart.push(product_result);
        console.log("DId it work?");
        console.log("Should have added " + product_result.name + " to " + req.session.fName + "'s cart");
        res.redirect("/cart?");
    },

    //getProduct
    //using the product ID in the query, it will send the data to products.hbs to render
    //the webpage for that specific product
    getProduct: async function (req, res) {
        console.log("getting product!");
        var query = req.query.id;
        try {
            const product_result = await Product.find({ _id: query }, { __v: 0 }).lean();
            //console.log(product_result);
            return res.render("productDesc", {
                product: product_result[0],
                script: "./js/add_to_cart.js",
            });
        }
        catch { };
        res.render("product");

    },

    //removeFromCart
    //removes product from user cart using productID embedded in the link
    removeFromCart: async function (req, res) {
        console.log("removing product from cart");
        var query = req.query;
        console.log(query);

        const product_result = await Product.find({ _id: query.id }, { __v: 0 });
        /*const result = await User.find(
            { _id: req.session.userID, cart:{ $elemMatch: {uniqueID: query.uid }}},
            {__v: 0}
        );
    	
        console.log(result);*/

        await User.updateOne(
            { _id: req.session.userID, cart: { $elemMatch: { uniqueID: query.uid } } },
            {
                $pull: {
                    cart: { uniqueID: query.uid }
                }
            }
        );

        console.log("yes?");
        res.redirect("/cart");
    },

    sortProducts: async function (req, res) {
        console.log("Searching for a product!");

        var query = req.body.sortValue;
        var resp = await Product.find({});
        const product_list = [];
        for (let i = 0; i < resp.length; i++) {
            product_list.push({
                name: resp[i].name,
                type: resp[i].type,
                price: resp[i].price,
                quantity: resp[i].quantity,
                productpic: resp[i].productpic,
                p_id: resp[i]._id
            });
        }
        switch (query) {
            case 'def':

                break;
            case 'price_asc':
                product_list.sort((a, b) => a.price - b.price);
                res.render("hehe", {
                    product_list: product_list
                });
                break;
            case 'price_desc':
                product_list.sort((a, b) => a.price - b.price);
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

    checkout: async function (req, res) {
        try {
            res.render("checkout", {
                script: './js/checkout.js'
            })

        } catch {
            res.sendStatus(400);
        }
    },

    //NOTE READ: WHEN BEING REDIRECTED AFTER SUCCESSFUL PAYMENT DO NOT CLICK AWAY FROM WEBSITE REDIRECT BACK FOR THE STATUS TO BE UPDATED

    postCheckout: async function (req, res) { //gets all the items in the cart using its mongodb id then adds them all up for a total to be redirected and paid in paymongo website using paymongo api
        //console.log(req.body);      
        const { items, amount } = req.body
        const paymongoAPIkey = "sk_test_w5Y6STecLuzzZifC23r2HRnZ"

        let total = 0; //the total amount the user has to pay

        const itemsCheckout = [] //an array containing the _id of the products the user added in the cart
        const itemsNames = [] //an array containing the product names the user added to their cart
        const user = await User.findById(req.session.userID).exec();
        //console.log(user);

        for (let i = 0; i < items.length; i++) { //this for loop loops through the itemsCheckout array and for each one finds it in the product schema and creates an item checkout object needed in the api call
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

        try {
            const order = new Order({
                userID: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
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
                headers: { accept: 'application/json', 'Content-Type': 'application/json', 'Authorization': `Basic ${btoa(paymongoAPIkey)}` },
                body: JSON.stringify({
                    data: {
                        attributes: {
                            billing: { name: user.firstName + ' ' + user.lastName, email: user.email, phone: '9000000000' },
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
                    const addPaymongoID = await Order.findByIdAndUpdate(response.data.attributes.reference_number, { paymongoID: response.data.id }); //after redirecting to paymongo the paymongoID is updated using the paymongo generated id

                    res.status(200);
                    res.send(response.data.attributes.checkout_url.toString());
                })
                .catch(err => console.error(err));
        } catch (err) {
            console.log("Placing order failed!");
            console.error(err);
            res.sendStatus(500);
        }
    },

    checkoutSuccess: async function (req, res) { //this is to update the order in the database, as of now only 2 status' exist (Awaiting payment, succeeded)
        const paymongoAPIkey = "sk_test_w5Y6STecLuzzZifC23r2HRnZ"

        const options = { method: 'GET', headers: { accept: 'application/json', 'Content-Type': 'application/json', 'Authorization': `Basic ${btoa(paymongoAPIkey)}` } };

        const ID = req.params.orderID;
        //console.log("Order ID: ", ID);

        const order = await Order.findById(ID);

        fetch('https://api.paymongo.com/v1/checkout_sessions/' + order.paymongoID, options) //this api call is to retrieved the checkout information in paymongo
            .then(response => response.json())
            .then(async response => { //console.log(response)
                try {
                    const result = await Order.findByIdAndUpdate(ID, { status: response.data.attributes.payment_intent.attributes.status }); //update the status of the order in database using the status in paymongo

                } catch (err) {
                    console.log("Fetching order failed!");
                    console.error(err);
                    res.sendStatus(500);
                }
            })
            .catch(err => console.error(err));

        try {
            res.render("checkoutSuccess", {

            })

        } catch {
            res.sendStatus(400);
        }
    },



}

export default controller;
