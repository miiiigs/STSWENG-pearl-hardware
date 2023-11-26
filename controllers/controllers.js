import database from '../model/db.js';
import { Product } from '../model/productSchema.js';
import { User } from '../model/userSchema.js';
import { Order } from '../model/orderSchema.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { Image } from '../model/imageSchema.js';

const SALT_WORK_FACTOR = 10;
let currentCategory = "allproducts";
const pageLimit = 20;

/*
    Checks if file is an image
*/
const isImage = (file) => {
    const mimeType = mime.lookup(file);
    return mimeType && mimeType.startsWith('image/');
};

const controller = {

    image: async (req, res) => {
        console.log("Image request received");
        const { id } = req.params;

        try {
            const image = await Image.findById(id);

            res.set('Content-Type', 'image/jpeg');
            res.send(image.img.data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
      },

    getIndex: async function (req, res) {
        try {
            console.log("USER ID" + req.session.userID);
            //getProducts function
            var product_list = await getProducts();

            // sortProducts function
            const sortValue = req.query.sortBy;
            sortProducts(product_list, sortValue);

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
            if (req.session.userID) {
                const user = await User.findById(req.session.userID)
                if (user.isAuthorized == true) {
                    console.log("AUTHORIZED")
                    res.render("adminHome", {
                        layout: 'adminHome',
                        script: './js/admin.js',
                    });
                } else {
                    console.log("UNAUTHORIZED");
                    res.sendStatus(400);
                }
            } else {
                res.sendStatus(400);
            }
        } catch {
            res.sendStatus(400);
        }
    },


    getCategory: async function (req, res) {

        const category = req.params.category;
        //console.log("CATEGORY " + req.params.category);
        //console.log(currentCategory);
        if((req.session.pageIndex == null || currentCategory != category) && (category == 'allproducts' || category == 'welding' || category == 'safety' || category == 'cleaning' || category == 'industrial' || category == 'brassfittings')){
            //console.log("HERE");
            req.session.pageIndex = 0;
            currentCategory = category;
        }
        //console.log(req.session.pageIndex);

        try {

            //getProducts function
            var product_list = await getProducts(category, req.session.pageIndex);

            // sortProducts function
            const sortValue = req.query.sortBy;
            sortProducts(product_list, sortValue);

            res.render("all_products", {
                product_list: product_list,
                category: category,
                script: '/./js/sort.js',

            });
        } catch {
            res.sendStatus(400);
        }

    },

    changePageStore: async function(req, res){

        try{

        let count;

        //console.log(req.body);

        const category = req.params.category.toLowerCase();
        //console.log(category);

        const {change} = req.body;
        //console.log(change);

        if(category == "welding" || category == "safety" || category == "cleaning" || category == "industrial" || category == "brassfittings"){
            count = await Product.find( {type:category} );
        }else{
            count = await Product.find({});
        }

        //console.log(count);

        if(change == "next"){
            req.session.pageIndex = req.session.pageIndex + 1;
        }else if(change == "prev"){
            req.session.pageIndex = req.session.pageIndex - 1;
        }else{
            console.log("error fetching page");
        }

        if(req.session.pageIndex < 0 || req.session.pageIndex > Math.round(count.length / pageLimit)){
            console.log("HERE");
            req.session.pageIndex = 0;
        }

        currentCategory = category;

        res.sendStatus(200);
        }catch(error){
            console.error(error);
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
            const user = await User.findById(req.session.userID);
            let userData = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profilepic: user.profilepic,
                cart: user.cart,
                line1: user.line1,
                line2: user.line2,
                city: user.city,
                state: user.state,
                postalCode: user.postalCode,
                country: user.country,
            }
            console.log(userData);
            res.render("userprofile", {
                user: userData,

            });
        } catch {
            res.sendStatus(400);
        }
    },

    getUserPurchases: async function (req, res) {

        try {
            var orders = [];
            const resp = await Order.find({ userID: req.session.userID });

            for(let i = 0; i < resp.length; i++) {
                orders.push({
                    orderID: resp[i]._id,
                    firstName: resp[i].firstName,
                    lastName: resp[i].lastName,
                    email: resp[i].email,
                    date: resp[i].date.toISOString().slice(0, 10),
                    status: resp[i].status,
                    amount: resp[i].amount,
                    items: resp[i].items.length,
                    paymongoID: resp[i].paymongoID,
                    isCancelled: resp[i].isCancelled.toString()
                });
            }

            //console.log(orders);

            res.render("userpurchases", {
                orders: orders,
            });
        } catch {
            res.sendStatus(400);
            console.log("Error retrieving orders");
        }
    },
    

    addProduct: async function (req, res) {
        try {
            const pic = req.file;
            const product = req.body;
    
            if (pic) {

                //console.log(pic)

                const obj = {
                    img: {
                        data: new Buffer.from(pic.buffer, 'base64'),
                        contentType: pic.mimeType
                    }
                }

                const imageSave = await Image.create(obj);
                
                new Product({
                    name: product.name,
                    type: product.type,
                    quantity: product.quantity,
                    price: product.price,
                    productpic: 'http://localhost:3000/image/' + imageSave._id,
                }).save();

            }else {
                new Product({
                    name: product.name,
                    type: product.type,
                    quantity: product.quantity,
                    price: product.price,
                    productpic: './uploads/temp.png',
                }).save();
            }

            res.redirect('/adminInventory');
    
        }catch(err){
            console.error(err);
            
        }
    },

    editProduct: async function (req, res) {
        try {

            const pic = req.file;
            const product = req.body;

            if (pic) {

                const obj = {
                    img: {
                        data: new Buffer.from(pic.buffer, 'base64'),
                        contentType: pic.mimeType
                    }
                }

                const imageSave = await Image.create(obj);

                const updateStock = await Product.findByIdAndUpdate(
                    product.id,
                    { name: product.name,
                        type: product.type,
                        quantity: product.stock,
                        price: product.price,
                        productpic: 'http://localhost:3000/image/' + imageSave._id
                    },
                    
                );
            }else{
                const updateStock = await Product.findByIdAndUpdate(
                    product.id,
                    { name: product.name,
                        type: product.type,
                        quantity: product.stock,
                        price: product.price,
                    },
                    
                );
            }

            res.redirect('/adminInventory/allProducts');

        } catch {
            res.sendStatus(400);
        }
    },

    getUserOrderDetails: async function(req, res) {
        try{
            res.render("userorderdetails", {
            });
        } catch {
            res.sendStatus(400);
        }
    },

    getAdminInventory: async function (req, res) {
        try {
            console.log('hi');
            const category = req.params.category;
            console.log(category);
            //var product_list = [];
            let resp;
            var product_list = await getProducts(category, 0);
            // switch(category){
            //     case 'welding':
            //         resp = await Product.find({type: 'Welding'});
            //         break;
            //     case 'safety':
            //         resp = await Product.find({type: 'Safety'});
            //         break;
            //     case 'cleaning':
            //         resp = await Product.find({type: 'Cleaning'});
            //         break;
            //     case 'industrial':
            //         resp = await Product.find({type: 'Industrial'});
            //         break;
            //     case 'brass_fittings':
            //         resp = await Product.find({type: 'Brass Fittings'});
            //         break;
            //     default:
            //         resp = await Product.find({});
                
                
            // }

            // for (let i = 0; i < resp.length; i++) {
            //     product_list.push({
            //         name: resp[i].name,
            //         type: resp[i].type,
            //         price: resp[i].price,
            //         quantity: resp[i].quantity,
            //         productpic: resp[i].productpic,
            //         p_id: resp[i]._id,
            //     });
            // }
            // sortProducts function
            const sortValue = req.query.sortBy;
            console.log(sortValue);
            sortProducts(product_list, sortValue);

            if (req.session.userID) {
                const user = await User.findById(req.session.userID)
                if (user.isAuthorized == true) {
                    console.log("AUTHORIZED")
                    res.render("adminInventory", {
                        layout: 'adminInven',
                        product_list: product_list,
                        script: './js/adminInventory.js'
                    });
                } else {
                    console.log("UNAUTHORIZED");
                    res.sendStatus(400);
                }
            } else {
                res.sendStatus(400);
            }

        } catch {
            res.sendStatus(400);
        }
    },
	
	//searchInventory
	//specialized search and sort for Admin
    searchInventory: async function (req, res) {
        console.log("Searching in inventory!");
        var product_list = [];
        var query = req.query.product_query;


        console.log("Searching for " + query);

        const resp = await Product.find({ name: new RegExp('.*' + query + '.*', 'i') }, { __v: 0 }).lean();
        
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
        sortProducts(product_list, sortValue);

        res.render("adminInventory", { layout: 'adminInven', product_list: product_list, buffer: query });
    },
	
	//searchOrders
	//specialized search and sort for admin
	searchOrders: async function (req, res) {
        console.log("Searching for order!");

        var query = req.query.product_query;

        console.log("Searching for " + query);
	    var resp = undefined;
		var order_list = [];
        // sortOrders function
		const sortValue = req.query.sortBy;
        console.log(sortValue);
		try{
			const id = new mongoose.Types.ObjectId(query);
			console.log(id);
			if (sortValue == "date_asc"){
				resp = await Order.find({ _id: id }, { __v: 0 }).sort({date: 'asc'}).lean();
			}
			else if (sortValue == "date_desc"){
				resp = await Order.find({ _id: id }, { __v: 0 }).sort({date: 'desc'}).lean();
			}
			else {
				resp = await Order.find({ _id: id }, { __v: 0 }).lean();
				sortOrders(resp, sortValue);
			}
			for(let i = 0; i < resp.length; i++) {
                order_list.push({
                    orderID: resp[i]._id,
                    firstName: resp[i].firstName,
                    lastName: resp[i].lastName,
                    email: resp[i].email,
                    date: resp[i].date.toISOString().slice(0,10),
					status: resp[i].status,
                    amount: resp[i].amount,
                    paymongoID: resp[i].paymongoID,
                    isCancelled: resp[i].isCancelled.toString()
                });
            }
		}
		catch{
			console.log("Failed!");
		}
		res.render("adminOrders", {layout: 'adminMain',order_list: order_list, buffer: query, script: '/./js/adminOrders.js'});
    },

	//searchProducts
	searchProducts: async function(req,res){
		console.log("Searching for a product!");
		
		var query = req.query.product_query;
		
		console.log("Searching for " + query);
		
		const result = await Product.find({name: new RegExp('.*' + query + '.*', 'i')}, {__v:0}).lean();
		// sortProducts function
	const sortValue = req.query.sortBy;
	console.log(sortValue);
	sortProducts(result, sortValue);
		
		res.render("search_results", {product_list: result, script: '/./js/sort.js', buffer: query});
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
            password: hash,
            line1: "sample",
            line2: "sample",
            city: "sample",
            state: "sample",
            postalCode: 1111,
            country: "PH"
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
        console.log(req.body);

        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser && await bcrypt.compare(req.body.password, existingUser.password) && existingUser.isAuthorized == false) {

            req.session.userID = existingUser._id;
            req.session.fName = existingUser.firstName;
            return res.sendStatus(200);
        } else if (existingUser && await bcrypt.compare(req.body.password, existingUser.password) && existingUser.isAuthorized == true) {
            req.session.userID = existingUser._id;
            req.session.fName = existingUser.firstName;
            return res.sendStatus(201);

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

    //getCart
    //gets the cart of the current user and renders the cart page.
    getCart: async function (req, res) {

        console.log("getting " + req.session.userID + "(" + req.session.fName + ")'s cart");

        if (req.session.userID != null) {
            const result = await User.find({ _id: req.session.userID }, { cart: 1 });
            //console.log(result[0].cart);
            //console.log("Cart has been found? Can be accessed in handlebars using {{cart_result}}");
            res.render("add_to_cart", { cart_result: result[0].cart, script: './js/checkout.js' });
        } else {
            try {
                res.render("login", {
                    script: './js/login.js'
                });
            } catch {
                res.sendStatus(400);
            }
        }
    },

    //sends the items in a user's cart 
    getCartItems: async function (req, res) {
        const result = await User.find({ _id: req.session.userID }, { cart: 1 });
        res.status(200).send(result[0].cart)
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

        class itemDetails {
            constructor(name, price, amount, image, ID) {
                this.name = name;
                this.price = price;
                this.amount = amount;
                this.image = image;
                this.ID = ID;
            }
        }

        const itemsCheckout = [] //an array containing the _id of the products the user added in the cart
        const itemsDetails = [] //an array containing the product names the user added to their cart
        const user = await User.findById(req.session.userID).exec();
        //console.log(user);

        for (let i = 0; i < items.length; i++) { //this for loop loops through the itemsCheckout array and for each one finds it in the product schema and creates an item checkout object needed in the api call
            const item = await Product.findById(items[i])
            //console.log("URL"+ item.productpic)
            itemsCheckout.push({
                currency: 'PHP',
                images: [item.productpic],
                amount: parseInt(parseFloat(item.price.toFixed(2)) * 100),
                description: 'description',
                name: item.name,
                quantity: parseInt(amount[i])
            })
            itemsDetails.push(new itemDetails(item.name, item.price, amount[i], item.productpic, item._id));
            total += item.price * parseInt(amount[i]);
        }

        try {
            if (parseFloat(total.toFixed(2)) > 20.00) {
                const order = new Order({
                    userID: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    items: itemsDetails,
                    date: Date.now(),
                    status: 'awaitingPayment',
                    amount: parseFloat(total.toFixed(2)),
                    paymongoID: -1, //paymongoID of -1 means there is no record of a transaction in paymongo in other words it is to be ignored as the user did not even go to the checkout page of paymongo
                    line1: user.line1,
                    line2: user.line2,
                    city: user.city,
                    state: user.state,
                    postalCode: user.postalCode,
                    country: user.country,
                    isCancelled: false
                })

                const result = await order.save(); //save order to database
                //console.log(result);

                const options = {
                    method: 'POST',
                    headers: { accept: 'application/json', 'Content-Type': 'application/json', 'Authorization': `Basic ${btoa(paymongoAPIkey)}` },
                    body: JSON.stringify({
                        data: {
                            attributes: {
                                billing: {
                                    address: {
                                        line1: user.line1,
                                        line2: user.line2,
                                        city: user.city,
                                        state: user.state,
                                        postal_code: user.postalCode,
                                        country: user.country
                                    }, name: user.firstName + ' ' + user.lastName, email: user.email
                                },
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
                        console.log(response)
                        for (let x = 0; x < items.length; x++) { //this iterates through the items included in the order and adjusts the current stock of the products by subtracting it to what the user ordered
                            try {
                                const updateStock = await Product.findByIdAndUpdate(
                                    itemsDetails[x].ID,
                                    { $inc: { quantity: - itemsDetails[x].amount } },
                                    { new: true }
                                );
                                //console.log(updateStock)
                            } catch {
                                res.sendStatus(500);
                            }
                        }
                        const addPaymongoID = await Order.findByIdAndUpdate(response.data.attributes.reference_number, { paymongoID: response.data.id }); //after redirecting to paymongo the paymongoID is updated using the paymongo generated id

                        res.status(200);
                        res.send(response.data.attributes.checkout_url.toString());
                    })
                    .catch(err => console.error(err));
            } else {
                console.log("INVALID AMOUNT")
                res.sendStatus(401);
            }
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
                    const result = await Order.findByIdAndUpdate(ID, {
                        status: response.data.attributes.payment_intent.attributes.status,
                        line1: response.data.attributes.billing.address.line1,
                        line2: response.data.attributes.billing.address.line2,
                        postalCode: response.data.attributes.billing.address.postal_code,
                        city: response.data.attributes.billing.address.city,
                        state: response.data.attributes.billing.address.state,
                        country: response.data.attributes.billing.address.country,
                        email: response.data.attributes.billing.email
                    }); //update the status of the order in database using the status in paymongo
                    const user = await User.findByIdAndUpdate(req.session.userID, { cart: [] }) //clears the cart of the user after successfully checking out
                } catch (err) {
                    console.log("Fetching order failed!");
                    console.error(err);
                    res.sendStatus(500);
                }
            })
            .catch(err => console.error(err));

        try {
            res.render("checkoutSuccess", {
                orderID: ID
            })

        } catch {
            res.sendStatus(400);
        }
    },

    getAdminCategory: async function (req, res) {

        const category = req.params.category;
        //console.log(category);

        if((req.session.pageIndex == null || currentCategory != category) && (category == 'allOrders' || category == 'awaitingPayment' || category == 'succeeded' || category == 'orderPacked' || category == 'inTransit' || category == 'delivered' || category == 'cancelled')){
            //console.log("HERE");
            req.session.pageIndex = 0;
            currentCategory = category;
        }

        try {

            //getProducts function
            var order_list = [];
            let resp;
			const sortValue = req.query.sortBy;
			//console.log("sort val = " + sortValue);
			var dateVal = undefined;
			if (sortValue == "date_asc"){
				dateVal = "asc";
			}
			else if (sortValue == "date_desc"){
				dateVal = "desc";
			}
			else {
				dateVal = "asc"; //defaults to showing dates from newest to oldest
			}
            switch(category){
                case 'allOrders':
                    resp = await Order.find({isCancelled: false}).skip(req.session.pageIndex * pageLimit).limit(pageLimit).sort({date: dateVal});
                    break;
                default:
                    resp = await Order.find({status: category, isCancelled: false}).skip(req.session.pageIndex * pageLimit).limit(pageLimit).sort({date: dateVal});
                    break;
                case 'cancelled':
                    resp = await Order.find({isCancelled: true}).skip(req.session.pageIndex * pageLimit).limit(pageLimit).sort({date: dateVal});
                    break;
            }

            //console.log(resp.length)

            for(let i = 0; i < resp.length; i++) {
                order_list.push({
                    orderID: resp[i]._id,
                    firstName: resp[i].firstName,
                    lastName: resp[i].lastName,
                    email: resp[i].email,
                    date: resp[i].date.toISOString().slice(0, 10),
                    status: resp[i].status,
                    amount: resp[i].amount,
                    paymongoID: resp[i].paymongoID,
                    isCancelled: resp[i].isCancelled.toString()
                });
            }
            
            // sortOrders function
			if (sortValue == "price_asc" || sortValue == "price_desc"){ 
				sortOrders(order_list, sortValue);
			}


            if (req.session.userID) {
                const user = await User.findById(req.session.userID)
                if (user.isAuthorized == true) {
                    console.log("AUTHORIZED")
                    res.render("adminOrders", {
                        layout: 'adminMain',
                        order_list: order_list.reverse(),
                        category: category,
                        script: '/./js/adminOrders.js',
                    });
                } else {
                    console.log("UNAUTHORIZED");
                    res.sendStatus(400);
                }
            } else {
                res.sendStatus(400);
            }
        } catch(error) {
            res.sendStatus(400);
            console.error(error)
        }

    },

    changePageAdminCategory: async function(req, res){

        try{

        let count;

        //console.log(req.body);

        const category = req.params.category;
        //console.log(category);

        const {change} = req.body;
        //console.log(change);

        if(category == "awaitingPayment" || category == "succeeded" || category == "orderPacked" || category == "inTransit" || category == "delivered"){
            count = await Order.find( {status : category} );
        }else if(category == "allOrders"){
            count = await Order.find( {isCancelled : false} );
        }else{
            count = await Order.find({});
        }

        if(change == "next"){
            req.session.pageIndex = req.session.pageIndex + 1;
        }else if(change == "prev"){
            req.session.pageIndex = req.session.pageIndex - 1;
        }else{
            console.log("error fetching page");
        }

        if(req.session.pageIndex < 0 || req.session.pageIndex > Math.round(count.length / pageLimit)){
            console.log("HERE");
            req.session.pageIndex = 0;
        }

        currentCategory = category;

        res.sendStatus(200);
        }catch(error){
            console.error(error);
            res.sendStatus(400);
        }

    },

    cancelChange: async function (req, res) {

        const { id } = req.body;
        //console.log(id)

        try {
            const update = await Order.findByIdAndUpdate(id, { isCancelled: true });

            for (let x = 0; x < update.items.length; x++) { //this iterates through the items included in the order and adjusts the current stock of the products by subtracting it to what the user ordered
                try {
                    const updateStock = await Product.findByIdAndUpdate(
                        update.items[x].ID,
                        { $inc: { quantity: + update.items[x].amount } },
                        { new: true }
                    );
                    //console.log(updateStock)
                } catch {
                    res.sendStatus(500);
                }
            }
            res.sendStatus(200);

        } catch {
            res.sendStatus(400);
        }
    },

    statusChange: async function (req, res) {

        const { orderID, status } = req.body;
        //console.log(orderID)
        //console.log(status)

        try {
            const update = await Order.findByIdAndUpdate(orderID, { status: status });
            res.sendStatus(200);
        } catch {
            res.sendStatus(400);
        }
    },

    getOrderDetails: async function (req, res) {

        const id = req.params.orderID
        //console.log(id);

        try {
            const order = await Order.findById(id);

            res.render("adminOrderDetails", {
                layout: 'adminMain',
                orderID: order._id,
                orderDate: order.date,
                fname: order.firstName,
                lname: order.lastName,
                email: order.email,
                status: order.status,
                city: order.city,
                postalCode: order.postalCode,
                state: order.state,
                line1: order.line1,
                line2: order.line2,
                isCancelled: order.isCancelled,
                items: order.items,
                amount: order.amount,

                script: '/./js/adminOrderDetails.js',
            })

        } catch {
            res.sendStatus(400);
        }
    },

    showProduct: async function (req, res) {
        const id = req.body.id;
        const product = await Product.findByIdAndUpdate(id, { isShown: true });
    },

    hideProduct: async function (req, res) {
        const id = req.body.id;
        const product = await Product.findByIdAndUpdate(id, { isShown: false });
    },

    deleteProduct: async function (req, res) {

        const id = req.body.id;
        const result = await Product.deleteOne({ _id: id });

        if (result.deletedCount) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(201);
        }

    },

    searchProducts: async function(req,res){
		console.log("Searching for a product!");
		
		var query = req.query.product_query;
		
		console.log("Searching for " + query);
		
		const result = await Product.find({name: new RegExp('.*' + query + '.*', 'i')}, {__v:0}).lean();
		// sortProducts function
        const sortValue = req.query.sortBy;
        console.log(sortValue);
        sortProducts(result, sortValue);
		
		res.render("search_results", {product_list: result});
    },



}

async function getProducts(category, pageIndex) {
    try{
    var product_list = [];
    let resp;
    switch (category) {
        case 'welding':
            resp = await Product.find({ type: category }).skip(pageIndex * pageLimit).limit(pageLimit).exec();
            break;
        case 'safety':
            resp = await Product.find({ type: category }).skip(pageIndex * pageLimit).limit(pageLimit).exec();
            break;
        case 'cleaning':
            resp = await Product.find({ type: category }).skip(pageIndex * pageLimit).limit(pageLimit).exec();
            break;
        case 'industrial':
            resp = await Product.find({ type: category }).skip(pageIndex * pageLimit).limit(pageLimit).exec();
            break;
        case 'brassfittings':
            resp = await Product.find({ type: category }).skip(pageIndex * pageLimit).limit(pageLimit).exec();
            break;
        default:
            resp = await Product.find({}).skip(pageIndex * pageLimit).limit(pageLimit).exec();
            break;
    }
    for (let i = 0; i < resp.length; i++) {
        if (resp[i].isShown) {
            product_list.push({
                name: resp[i].name,
                type: resp[i].type,
                price: resp[i].price,
                quantity: resp[i].quantity,
                productpic: resp[i].productpic,
                p_id: resp[i]._id
            });
        }
    }
    return product_list;
}catch(error){
    console.error(error);
}
}

async function sortProducts(product_list, sortValue) {
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
			case 'stock_asc':
				product_list.sort((a, b) => a.quantity - b.quantity);
				break;
			case 'stock_desc':
				product_list.sort((a, b) => b.quantity - a.quantity);
				break;			
        }
    }
}

async function sortOrders(order_list, sortValue){
    if (sortValue !== undefined) {
        switch (sortValue) {
            case 'def':
                break;
            case 'price_asc':
                order_list.sort((a, b) => b.amount - a.amount);
                break;
            case 'price_desc':
                order_list.sort((a, b) => a.amount - b.amount);
                break;		
        }
    }
}


export default controller;
