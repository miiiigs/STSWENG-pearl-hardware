import database from '../model/db.js';
import { Product } from '../model/productSchema.js';
import { User } from '../model/userSchema.js';
import { Order } from '../model/orderSchema.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { Image } from '../model/imageSchema.js';
import multer from 'multer'; 
const multerStorage = multer.memoryStorage();
import { cBundles } from '../model/BundleSchema.js';
import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SALT_WORK_FACTOR = 10;
let currentCategory = "allproducts";
const pageLimit = 15;

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
            // Fetch product data
            var product_list = await getProducts();
    
            // Fetch bundle data
            var bundle_list = await cBundles.find().limit(5); // Adjust limit as needed
    
            // Sort products based on query parameter, if provided
            const sortValue = req.query.sortBy;
            sortProducts(product_list, sortValue);
    
            // Store sorting option in session
            req.session.sortOption = sortValue;
    
            res.render("index", {
                product_list: product_list,
                bundle_list: bundle_list,
                script: './js/index.js',
                isHomePage: true,
            });
        } catch (error) {
            console.error(error);
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

    BundlesPage: async function (req, res) {
        try {
            if (req.session.userID) {
                const user = await User.findById(req.session.userID)
                if (user.isAuthorized == true) {
                    console.log("AUTHORIZED")
                    res.render("adminBundles", { // Assuming the view for managing bundles is named "adminBundles"
                        layout: 'adminBundles',
                        script: './js/adminBundles.js', // Assuming you have a separate script file for bundle management
                    });
                } else {
                    console.log("UNAUTHORIZED");
                    res.sendStatus(400);
                }
            } else {
                res.sendStatus(400);
            }
        } catch (error) {
            console.error(error);
            res.sendStatus(400);
        }
    },
    
    getAllBundles: async (req, res) => {
        try {
            const bundles = await cBundles.find().limit(5); // Adjust limit as needed
            res.status(200).json(bundles);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    
    
    

    createBundle: async function (req, res) {
        try {
            // Extract necessary data from the request body
            const { name, description, price, products } = req.body;
            console.log("Received Data:", { name, description, price, products });
    
            let productIds;
            if (Array.isArray(products)) {
                // If products is already an array, map over it and convert _id to ObjectId
                productIds = products.map(product => new ObjectId(product._id));
            } else {
                // If products is a string separated by commas, split it and convert each ID to ObjectId
                productIds = products.split(',').map(productId => new ObjectId(productId.trim()));
}
    
            // Create a new bundle with the provided data
            const newBundle = await cBundles.create({
                name,
                description,
                price,
                products: productIds  
            });
    
            console.log("New Bundle:", newBundle);
    
            res.status(201).json(newBundle);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    

    deleteBundle: async function (req, res) {
        try {
            const bundleId = req.params.id; // Extract bundle ID from request parameters
    
            // Delete the bundle with the provided ID
            const deletedBundle = await cBundles.findByIdAndDelete(bundleId);
    
            if (!deletedBundle) {
                // If the bundle with the provided ID does not exist, return a 404 status
                return res.status(404).json({ message: 'Bundle not found' });
            }
    
            console.log("Deleted Bundle:", deletedBundle);
    
            res.status(200).json({ message: 'Bundle deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    editBundle: async function (req, res) {
        try {
            // Extract necessary data from the request body
            const bundleId = req.params.id;
            const {name, description, price, products } = req.body;
            console.log("Received Data:", {name, description, price, products});
    
            // Convert the products to an array of product IDs
            let productIds;
            if (Array.isArray(products)) {
                // If products is already an array, map over it and convert _id to ObjectId
                productIds = products.map(product => new ObjectId(product._id));
            } else {
                // If products is a string separated by commas, split it and convert each ID to ObjectId
                productIds = products.split(',').map(productId => new ObjectId(productId.trim()));
            }
    
            // Update the bundle with the provided data
            const updatedBundle = await cBundles.findByIdAndUpdate(bundleId, {
                name,
                description,
                price,
                products: productIds
            }, { new: true });
    
            console.log("Updated Bundle:", updatedBundle);
    
            res.status(200).json(updatedBundle);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    

    BundlesAllProducts: async (req, res) => {
        try {
            const products = await Product.find();
            res.status(200).json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getCategory: async function (req, res) {
        const category = req.params.category;
        //console.log("CATEGORY " + req.params.category);
        //console.log(currentCategory);
        if((req.session.pageIndex == null || currentCategory != category) && (category == 'allproducts' || category == 'welding' || category == 'safety' || category == 'cleaning' || category == 'industrial' || category == 'brassfittings')){
            //console.log("HERE");
            req.session.prevPage = false;
            req.session.nextPage = true;
            req.session.pageIndex = 0;
            currentCategory = category;
        }
        //console.log(req.session.pageIndex);
    
        try {
            //getProducts function
            var product_list = await getProducts(category, req);
    
            // sortProducts function
            const sortValue = req.query.sortBy;
            sortProducts(product_list, sortValue);
    
            // Store sorting option in session
            req.session.sortOption = sortValue;
    
            res.render("all_products", {
                product_list: product_list,
                category: category,
                script: '/./js/sort.js',
                nextPage: req.session.nextPage,
                prevPage: req.session.prevPage
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

    getUserProfile: async function (req, res) {
        try {
            
            const user = await User.findById(req.session.userID);
            let userData = {
                id: user._id,
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
                layout: 'userprofile',
                user: userData,
                script: './js/userProfile.js'
            });
        } catch {
            res.sendStatus(400);
        }
    },

    getAdminUserProfile: async function (req, res) {
        try {
            
            const user = await User.findById(req.session.userID);
            let userData = {
                id: user._id,
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
            res.render("adminuserprofile", {
                layout: 'adminuserprofile',
                user: userData,
                script: './js/adminuserProfile.js'
            });
        } catch {
            res.sendStatus(400);
        }
    },

    getUserPurchases: async function (req, res) {

        const category = req.params.status;

        if((req.session.pageIndex == null || currentCategory != category) && (category == 'allOrders' || category == 'awaitingPayment' || category == 'succeeded' || category == 'orderPacked' || category == 'inTransit' || category == 'delivered' || category == 'cancelled')){
            //console.log("HERE");
            req.session.prevPage = false;
            req.session.nextPage = true;
            req.session.pageIndex = 0;
            currentCategory = category;
        }

        try {
            let resp;
            let testNext;
            var orders = [];
			
			const sortValue = req.query.sortBy;
			//console.log("sort val = " + sortValue);
			let dateVal;
			let priceVal;
			//I DON'T KNOW WHY THEY'RE reversed
			//PLEASE KNOW THAT
			//DESC = Newest to Oldest
			//ASC = Oldest to Newest			
			if(sortValue == "date_asc" || sortValue == "date_desc" || sortValue == null){
				//console.log("Should be here for: " + sortValue);
				if (sortValue == "date_desc"){
					dateVal = "asc";
				}
				else{
					dateVal = "desc";
				}
				switch(category){
					case 'allOrders':
						resp = await Order.find({isCancelled: false, userID: req.session.userID}).skip(req.session.pageIndex * pageLimit).limit(pageLimit).sort({date: dateVal});
						testNext = await Order.find({isCancelled: false, userID: req.session.userID}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit).sort({date: dateVal});
						break;
					default:
						resp = await Order.find({status: category, isCancelled: false, userID: req.session.userID}).skip(req.session.pageIndex * pageLimit).limit(pageLimit).sort({date: dateVal});
						testNext = await Order.find({status: category, isCancelled: false, userID: req.session.userID}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit).sort({date: dateVal});
						break;
					case 'cancelled':
						resp = await Order.find({isCancelled: true, userID: req.session.userID}).skip(req.session.pageIndex * pageLimit).limit(pageLimit).sort({date: dateVal});
						testNext = await Order.find({isCancelled: true, userID: req.session.userID}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit).sort({date: dateVal});
						break;
				}
			}
			else if(sortValue == "price_asc" || sortValue == "price_desc"){
				//console.log("Should be here for: " + sortValue);
				if (sortValue == "price_asc"){
					priceVal = "asc";
				}
				else if (sortValue == "price_desc"){
					priceVal = "desc";
				}
				switch(category){
					case 'allOrders':
						resp = await Order.find({isCancelled: false, userID: req.session.userID}).skip(req.session.pageIndex * pageLimit).limit(pageLimit).sort({amount: priceVal});
						testNext = await Order.find({isCancelled: false, userID: req.session.userID}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit).sort({amount: priceVal});
						break;
					default:
						resp = await Order.find({status: category, isCancelled: false, userID: req.session.userID}).skip(req.session.pageIndex * pageLimit).limit(pageLimit).sort({amount: priceVal});
						testNext = await Order.find({status: category, isCancelled: false, userID: req.session.userID}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit).sort({amount: priceVal});
						break;
					case 'cancelled':
						resp = await Order.find({isCancelled: true, userID: req.session.userID}).skip(req.session.pageIndex * pageLimit).limit(pageLimit).sort({amount: priceVal});
						testNext = await Order.find({isCancelled: true, userID: req.session.userID}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit).sort({amount: priceVal});
						break;
				}
			}
			
            /*switch(category){
                case 'allOrders':
                    resp = await Order.find({isCancelled: false, userID: req.session.userID}).skip(req.session.pageIndex * pageLimit).limit(pageLimit).sort({date: dateVal});
                    testNext = await Order.find({isCancelled: false, userID: req.session.userID}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit).sort({date: dateVal});
                    break;
                default:
                    resp = await Order.find({status: category, isCancelled: false, userID: req.session.userID}).skip(req.session.pageIndex * pageLimit).limit(pageLimit).sort({date: dateVal});
                    testNext = await Order.find({status: category, isCancelled: false, userID: req.session.userID}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit).sort({date: dateVal});
                    break;
                case 'cancelled':
                    resp = await Order.find({isCancelled: true, userID: req.session.userID}).skip(req.session.pageIndex * pageLimit).limit(pageLimit).sort({date: dateVal});
                    testNext = await Order.find({isCancelled: true, userID: req.session.userID}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit).sort({date: dateVal});
                    break;
            }*/

            if(testNext.length == 0)
                req.session.nextPage = false;
            else
                req.session.nextPage = true;
    
            if(req.session.pageIndex == 0)
                req.session.prevPage = false;
            else    
                req.session.prevPage = true;
    
            //console.log(req.session.pageIndex);
            //console.log(req.session.nextPage);
            //console.log(req.session.prevPage);

            //console.log(resp)
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
			
            res.render("userpurchases", {
                layout: 'userOrders',
                script: '/./js/userPurchases.js',
                orders: orders,
                category: category,
                nextPage: req.session.nextPage,
                prevPage: req.session.prevPage
            });

        } catch(error) {
            res.sendStatus(400);
            console.error(error);
        }
    },
	
	//specialized search for user orders
	searchUserPurchases: async function(req,res){
		console.log("Searching for order!");

        var query = req.query.product_query;

        console.log("Searching for " + query);
	    var resp = undefined;
		let testNext;
		var orders = [];
        // sortOrders function
		const sortValue = req.query.sortBy;
        console.log(sortValue);
		try{
			const id = new mongoose.Types.ObjectId(query);
			console.log(id);
			if (sortValue == "date_asc"){
				resp = await Order.find({userID: req.session.userID, _id: id }, { __v: 0 }).sort({date: 'asc'}).skip(req.session.pageIndex * pageLimit).limit(pageLimit).lean();
				//testNext = await Order.find({userID: req.session.userID, _id: id }, { __v: 0 }).sort({date: 'asc'}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit).lean();
			}   
			else if (sortValue == "date_desc"){
				resp = await Order.find({userID: req.session.userID, _id: id }, { __v: 0 }).sort({date: 'desc'}).skip(req.session.pageIndex * pageLimit).limit(pageLimit).lean();
				//testNext = await Order.find({userID: req.session.userID, _id: id }, { __v: 0 }).sort({date: 'desc'}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit).lean();
			}
			else {
				resp = await Order.find({userID: req.session.userID, _id: id }, { __v: 0 }).skip(req.session.pageIndex * pageLimit).limit(pageLimit).lean();
				sortOrders(resp, sortValue);
			}
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
			if(testNext.length == 0)
                req.session.nextPage = false;
            else
                req.session.nextPage = true;
    
            if(req.session.pageIndex == 0)
                req.session.prevPage = false;
            else    
                req.session.prevPage = true;
		}
		catch{
			console.log("Failed!");
		}
		res.render("userpurchases", {
			layout: 'userOrders',
			orders: orders,
			buffer: query,
			script: '/./js/userPurchases.js',
			nextPage: req.session.nextPage,
			prevPage: req.session.prevPage
		});
	},
    
    addProduct: async function (req, res) {
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
                
                new Product({
                    name: product.name,
                    type: product.type,
                    quantity: product.quantity,
                    price: product.price,
                    productpic: 'https://pearl-hardware-ph.onrender.com/image/' + imageSave._id,
                    description: product.description
                }).save();

            }else {
                new Product({
                    name: product.name,
                    type: product.type,
                    quantity: product.quantity,
                    price: product.price,
                    productpic: './uploads/temp.png',
                    description: product.description
                }).save();
            }

            res.redirect('/adminInventory/' + product.type);
    
        }catch(err){
            console.error(err);
            
        }
    },

    editProduct: async function (req, res) {
        try {
            const pic = req.file;
            const product = req.body;
            console.log(product);
            var isDiscounted, dvalue, discountType;
            discountType = product.discount;
            switch(discountType) {
                case 'none':
                    isDiscounted = false;
                    break;
                case 'exact':
                    isDiscounted = true;
                    dvalue = product.dvalue;
                    break;
                case 'percent':
                    isDiscounted = true;
                    dvalue = product.price - ((product.dvalue / 100) * product.price);
                    break;
            }

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
                        productpic: 'https://pearl-hardware-ph.onrender.com/image/' + imageSave._id,
                        description: product.description,
                        isDiscounted: isDiscounted,
                        discountValue: dvalue,
                        discountType: discountType,
                    },
                    
                );

                
            }else{
                const updateStock = await Product.findByIdAndUpdate(
                    product.id,
                    { name: product.name,
                        type: product.type,
                        quantity: product.stock,
                        price: product.price,
                        description: product.description,
                        isDiscounted: isDiscounted,
                        discountValue: dvalue,
                        discountType: discountType,
                    },
                    
                );

            }
            

            res.redirect('/adminInventory/' + currentCategory);

        } catch {
            res.sendStatus(400);
        }
    },

    editProfile: async function (req, res) {
        try {
            const user = req.body;
            const id = req.params.id;

            //console.log(id);

            const updateProfile = await User.findByIdAndUpdate(
                id,
                { firstName: user.fname,
                    lastName: user.lname,
                    state: user.state,
                    city: user.city,
                    postalCode: user.postalCode,
                    line1: user.line1,
                    line2: user.line2
                },   
            );

            //console.log(updateProfile)
            
            res.redirect('/userprofile');

        } catch(error) {
            res.sendStatus(400);
            console.error(error);
        }
    },

    editAdminProfile: async function (req, res) {
        try {
            const user = req.body;
            const id = req.params.id;

            //console.log(id);

            const updateProfile = await User.findByIdAndUpdate(
                id,
                { firstName: user.fname,
                    lastName: user.lname,
                    state: user.state,
                    city: user.city,
                    postalCode: user.postalCode,
                    line1: user.line1,
                    line2: user.line2
                },   
            );

            //console.log(updateProfile)
            
            res.redirect('/adminuserprofile');

        } catch(error) {
            res.sendStatus(400);
            console.error(error);
        }
    },

    getUserOrderDetails: async function(req, res) {

        const orderID = req.params.orderID;

        try{

            const order = await Order.findById(orderID);

            res.render("userorderdetails", {
                layout: 'userOrders',
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
                paymongoID: order.paymongoID,
            });
        } catch {
            res.sendStatus(400);
        }
    },

    adminInsights: async function (req, res) {
        try {
    
            res.render("AdminInsights", {
                layout: 'Admin_insight'
            });
        } catch (error) {
            console.error(error);
            res.sendStatus(500); 
        }
    },
    
    getAdminInventory: async function (req, res) {

        const category = req.params.category;

        if((req.session.pageIndex == null || currentCategory != category) && (category == 'allproducts' || category == 'welding' || category == 'safety' || category == 'cleaning' || category == 'industrial' || category == 'brassfittings')){
            //console.log("HERE");
            req.session.nextPage = true;
            req.session.prevPage = false;
            req.session.pageIndex = 0;
            currentCategory = category;
        }

        try {
            let resp;
            var product_list = await getProductsAdmin(category, req);
            console.log(product_list)
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
                        script: '/./js/adminInventory.js',
                        category: category,
                        nextPage: req.session.nextPage,
                        prevPage: req.session.prevPage
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
            console.log("HERE")
            req.session.nextPage = false;
            req.session.prevPage = false;
            req.session.pageIndex = 0;
            currentCategory = "search";
		}
		catch{
			console.log("Failed!");
		}
		res.render("adminOrders", {layout: 'adminMain',order_list: order_list, buffer: query, nextPage: req.session.nextPage, prevPage: req.session.prevPage, script: '/./js/adminOrders.js'});
    },

	//searchProducts
	searchProducts: async function(req,res){
		console.log("Searching for a product!");
		
		const query = req.query.product_query;
		
		console.log("Searching for " + query);
		
		const result = await Product.find({name: new RegExp('.*' + query + '.*', 'i'), isShown: true}, {__v:0}).lean();
		// sortProducts function
		const sortValue = req.query.sortBy;
		console.log(sortValue);
		sortProducts(result, sortValue);
		
		res.render("search_results", {product_list: result, buffer: query, script: '/./js/sort.js'});
    },
	
    register: async function (req, res) {

        const errors = validationResult(req);
        //console.log(errors)
        if (!errors.isEmpty()) {
            if (errors.array().at(0).msg === "Email already exists!") {
                console.log(errors.array().at(0).msg);
                return res.sendStatus(405); //405 is for email that exists already
            }else if (errors.array().at(0).msg + " of " + errors.array().at(0).path === "Invalid value of postalCode") {
                console.log(errors.array().at(0).msg + " of " + errors.array().at(0).path);
                return res.sendStatus(410); //405 is for email that exists already
            }else {
                console.log(errors.array().at(0).msg + " of " + errors.array().at(0).path);
                return res.sendStatus(406); //406 is for invalid email value
            }
        }

        console.log("Register request received");
        console.log(req.body);
        const { fname, lname, email, password, line1, line2, state, city, postalCode } = req.body

        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName: fname,
            lastName: lname,
            email: email,
            password: hash,
            line1: line1,
            line2: line2,
            city: city,
            state: state,
            postalCode: postalCode,
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

    updateProfilePic: async (req, res) => {
        const { id } = req.params; // Updated from userId to id
        const profilePic = req.file; // Access the uploaded image file
        if (!profilePic) {
            return res.status(400).json({ message: 'No image file provided' });
        }
    
        try {
            // Find the user by ID
            const user = await User.findById(id); // Updated from userId to id
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Update the profile picture fields in the user document
            user.profilepic = {
                data: profilePic.buffer, // Store the buffer data
                contentType: profilePic.mimetype // Store the MIME type
            };
    
            // Save the updated user document
            await user.save();
    
            res.status(200).json({ message: 'Profile picture updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },



	
    //addToCart
    //will add to cart using the product ID (mongodb ID)
    addToCart: async function (req, res) {
        console.log("Adding to cart");
        console.log(req.body);
        console.log("Attempting to add: " + req.body.id);
		if(req.session.userID){
			const query = req.body.id;
			const temp = await Product.find({ _id: query }, { __v: 0 });
			const product_result = temp[0];
			var quant = req.body.quant;
			const id = req.session.userID + ":" + query;
			
			//see if user has product in the cart and get the quantity
			var existingItem = await User.find(
				{_id: req.session.userID, cart: { $elemMatch: { uniqueID: id } }},
				{_id: 0, 'cart.quantity.$': 1}
			);
			console.log(existingItem);

			if(existingItem.length !== 0 ){
				
				var currentQuantity = existingItem[0].cart[0].quantity;
				console.log(currentQuantity);
				console.log("Found something!");
				
				//Remove already existing item
				await User.updateOne(
					{ _id: req.session.userID, cart: { $elemMatch: { uniqueID: id} } },
					{
						$pull: {
							cart: { uniqueID: id }
						}
					}
				);
				
				console.log("Should have removed it!");
			}
			await User.updateOne(
				{ _id: req.session.userID },
				{
					$push: {
						cart: { product: product_result, quantity: quant, uniqueID: id }
					}
				}
			);
			
			//console.log(product_result);
			//console.log(user_cart[0].cart);

			//user_cart[0].cart.push(product_result);
			console.log("Should have added " + product_result.name + " to " + req.session.fName + "'s cart");
		}
        else{
			console.log("Not logged in! Nothing added.");
		}
		res.redirect("/cart?");
        
    },

    //getCart
    //gets the cart of the current user and renders the cart page.
    getCart: async function (req, res) {

        console.log("getting " + req.session.userID + "(" + req.session.fName + ")'s cart");

        let total = 0;
        let newResult = [];

        if (req.session.userID != null) {
            const result = await User.find({ _id: req.session.userID }, { cart: 1 });
            for(let x = 0; x < result[0].cart.length; x++){
                const result2 = await Product.find({ _id: result[0].cart[x].product._id, isShown: true})
                //console.log(result2);
                if(result2.length > 0){
                    total = total + (parseInt(result[0].cart[x].quantity) * result[0].cart[x].product.price);
                    newResult.push(result[0].cart[x]);
                }else{
                    await User.updateOne(
                        { _id: req.session.userID, cart: { $elemMatch: { uniqueID: result[0].cart[x].uniqueID } } },
                        {
                            $pull: {
                                cart: { uniqueID: result[0].cart[x].uniqueID }
                            }
                        }
                    );
                }
            }
            console.log(newResult);
            //console.log(result[0].cart);
            //console.log("Cart has been found? Can be accessed in handlebars using {{cart_result}}");
            res.render("add_to_cart", { cart_result: newResult, total: total.toFixed(2), script: './js/checkout.js' });
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

    //getproduct
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

        //const product_result = await Product.find({ _id: query.id }, { __v: 0 });
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
        const paymongoAPIkey = process.env.paymongoKey;

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
                                cancel_url: 'https://pearl-hardware-ph.onrender.com',
                                description: 'description',
                                line_items: itemsCheckout,
                                payment_method_types: ['card', 'gcash'],
                                reference_number: result._id, //store the order _id in database as the reference number
                                success_url: 'https://pearl-hardware-ph.onrender.com/checkoutSuccess/' + result._id
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
        const paymongoAPIkey = process.env.paymongoKey;

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
            req.session.prevPage = false;
            req.session.nextPage = true;
            req.session.pageIndex = 0;
            currentCategory = category;
        }

        try {

            //getProducts function
            var order_list = [];
            let resp;
            let testNext;
			const sortValue = req.query.sortBy;
			//console.log("sort val = " + sortValue);
			var dateVal = undefined;
			if (sortValue == "date_asc"){
				dateVal = "desc";
			}
			else if (sortValue == "date_desc"){
				dateVal = "asc";
			}
			else {
				dateVal = "desc"; //defaults to showing dates from newest to oldest
			}
            switch(category){
                case 'allOrders':
                    resp = await Order.find({isCancelled: false}).skip(req.session.pageIndex * pageLimit).limit(pageLimit).sort({date: dateVal});
                    testNext = await Order.find({isCancelled: false}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit).sort({date: dateVal});
                    break;
                default:
                    resp = await Order.find({status: category, isCancelled: false}).skip(req.session.pageIndex * pageLimit).limit(pageLimit).sort({date: dateVal});
                    testNext = await Order.find({status: category, isCancelled: false}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit).sort({date: dateVal});
                    break;
                case 'cancelled':
                    resp = await Order.find({isCancelled: true}).skip(req.session.pageIndex * pageLimit).limit(pageLimit).sort({date: dateVal});
                    testNext = await Order.find({isCancelled: true}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit).sort({date: dateVal});
                    break;
            }

            if(testNext.length == 0)
                req.session.nextPage = false;
            else
                req.session.nextPage = true;
    
            if(req.session.pageIndex == 0)
                req.session.prevPage = false;
            else    
                req.session.prevPage = true;
    
            console.log(req.session.pageIndex);
            console.log(req.session.nextPage);
            console.log(req.session.prevPage);

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
                    isCancelled: resp[i].isCancelled.toString(),
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
                        order_list: order_list,
                        category: category,
                        script: '/./js/adminOrders.js',
                        nextPage: req.session.nextPage,
                        prevPage: req.session.prevPage
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

    changePageUserPurchases: async function(req, res){

        try{

        let count;

        //console.log(req.body);

        const category = req.params.category;
        //console.log(category);

        const {change} = req.body;
        //console.log(change);

        if(category == "awaitingPayment" || category == "succeeded" || category == "orderPacked" || category == "inTransit" || category == "delivered"){
            count = await Order.find( {status : category, userID : req.session.userID, isCancelled: false} );
        }else if(category == "allOrders"){
            count = await Order.find( {isCancelled : false, userID : req.session.userID} );
        }else{
            count = await Order.find({userID : req.session.userID, isCancelled: true});
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
        res.sendStatus(200);
    },

    hideProduct: async function (req, res) {
        const id = req.body.id;
        const product = await Product.findByIdAndUpdate(id, { isShown: false });
        res.sendStatus(200);
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

}

async function getProducts(category, req) {
    try{
    var product_list = [];
    let resp;
    let testNext;
    //console.log(category)
    switch (category) {
        case 'welding':
            resp = await Product.find({ type: category, isShown: true }).skip(req.session.pageIndex * pageLimit).limit(pageLimit);
            testNext = await Product.find({ type: category, isShown: true }).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit);
            break;
        case 'safety':
            resp = await Product.find({ type: category, isShown: true }).skip(req.session.pageIndex * pageLimit).limit(pageLimit);
            testNext = await Product.find({ type: category, isShown: true }).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit);

            //testNext = await Order.find({isCancelled: false}).skip(req.session.pageIndex + 1 * pageLimit).limit(pageLimit).sort({date: dateVal});
            break;
        case 'cleaning':
            resp = await Product.find({ type: category, isShown: true}).skip(req.session.pageIndex * pageLimit).limit(pageLimit);
            testNext = await Product.find({ type: category, isShown: true }).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit);
            break;
        case 'industrial':
            resp = await Product.find({ type: category, isShown: true }).skip(req.session.pageIndex * pageLimit).limit(pageLimit);
            testNext = await Product.find({ type: category, isShown: true }).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit);
            break;
        case 'brassfittings':
            resp = await Product.find({ type: category, isShown: true }).skip(req.session.pageIndex * pageLimit).limit(pageLimit);
            testNext = await Product.find({ type: category, isShown: true }).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit);
            break;
        default:
            resp = await Product.find({isShown: true}).skip(req.session.pageIndex * pageLimit).limit(pageLimit);
            testNext = await Product.find({isShown: true}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit);
            break;
    }

    //console.log(testNext)

    if(testNext.length == 0)
        req.session.nextPage = false;
    else
        req.session.nextPage = true;
    
    if(req.session.pageIndex == 0)
        req.session.prevPage = false;
    else    
        req.session.prevPage = true;
    
    console.log(req.session.pageIndex);
    console.log(req.session.nextPage);
    console.log(req.session.prevPage);

    for (let i = 0; i < resp.length; i++) {
        if (resp[i].isShown) {
            product_list.push({
                name: resp[i].name,
                type: resp[i].type,
                price: resp[i].price,
                quantity: resp[i].quantity,
                productpic: resp[i].productpic,
                p_id: resp[i]._id,
                description: resp[i].description,
                isDiscounted: resp[i].isDiscounted,
                discountType: resp[i].discountType,
                discountValue: resp[i].discountValue,
            });
        }
    }
    return product_list;
}catch(error){
    console.error(error);
}
}

async function getProductsAdmin(category, req) {
    try{
    var product_list = [];
    let resp;
    let testNext;
    console.log("HERE")
    switch (category) {
        case 'welding':
            resp = await Product.find({ type: category}).skip(req.session.pageIndex * pageLimit).limit(pageLimit);
            testNext = await Product.find({ type: category}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit);
            break;
        case 'safety':
            resp = await Product.find({ type: category}).skip(req.session.pageIndex * pageLimit).limit(pageLimit);
            testNext = await Product.find({ type: category }).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit);

            //testNext = await Order.find({isCancelled: false}).skip(req.session.pageIndex + 1 * pageLimit).limit(pageLimit).sort({date: dateVal});
            break;
        case 'cleaning':
            resp = await Product.find({ type: category}).skip(req.session.pageIndex * pageLimit).limit(pageLimit);
            testNext = await Product.find({ type: category}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit);
            break;
        case 'industrial':
            resp = await Product.find({ type: category}).skip(req.session.pageIndex * pageLimit).limit(pageLimit);
            testNext = await Product.find({ type: category}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit);
            break;
        case 'brassfittings':
            resp = await Product.find({ type: category}).skip(req.session.pageIndex * pageLimit).limit(pageLimit);
            testNext = await Product.find({ type: category}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit);
            break;
        default:
            resp = await Product.find({}).skip(req.session.pageIndex * pageLimit).limit(pageLimit);
            testNext = await Product.find({}).skip((req.session.pageIndex + 1) * pageLimit).limit(pageLimit);
            break;
    }

    //console.log(testNext)

    if(testNext.length == 0)
        req.session.nextPage = false;
    else
        req.session.nextPage = true;
    
    if(req.session.pageIndex == 0)
        req.session.prevPage = false;
    else    
        req.session.prevPage = true;
    
    console.log(req.session.pageIndex);
    console.log(req.session.nextPage);
    console.log(req.session.prevPage);

    for (let i = 0; i < resp.length; i++) {
            product_list.push({
                name: resp[i].name,
                type: resp[i].type,
                price: resp[i].price,
                quantity: resp[i].quantity,
                productpic: resp[i].productpic,
                p_id: resp[i]._id,
                description: resp[i].description,
                isShown: resp[i].isShown,
                isDiscounted: resp[i].isDiscounted,
                discountType: resp[i].discountType,
                discountValue: resp[i].discountValue,
            });
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
            case 'price_desc':
                order_list.sort((a, b) => b.amount - a.amount);
                break;
            case 'price_asc':
                order_list.sort((a, b) => a.amount - b.amount);
                break;		
        }
    }
}





export default controller;
