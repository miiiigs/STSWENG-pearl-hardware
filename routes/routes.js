import { Router } from "express";
import controller from '../controllers/controllers.js';
import bodyParser from 'body-parser';
import { body, validationResult } from 'express-validator';
import { User } from '../model/userSchema.js';

import multer from 'multer';
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const router = Router();

//BOILERPLATE
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//GETS
router.get(`/`, controller.getIndex);

//  user handling
router.get(`/login`, controller.getLogin);
router.get('/register', controller.getRegister);

router.get(`/category/:category`, controller.getCategory);
router.get(`/adminCategory/:category`, controller.getAdminCategory);

router.get('/searchProducts', controller.searchProducts);


router.get('/userprofile', controller.getUserProfile);
router.get('/userpurchases/:status', controller.getUserPurchases);
router.get('/userorderdetails/:orderID', controller.getUserOrderDetails);
router.get('/userSearchPurchases', controller.searchUserPurchases);

router.get('/searchProducts', controller.searchProducts);

router.get('/image/:id', controller.image);

router.get('/checkout', controller.checkout);
router.get('/checkoutSuccess/:orderID', controller.checkoutSuccess);
router.get('/getUser', controller.getUser);
router.get('/productDesc', controller.getProductDesc);
router.get('/cart', controller.getCart);
router.get('/logout', controller.logout);
router.get('/product', controller.getProduct);

router.get('/adminInventory/:category', controller.getAdminInventory);
router.get('/searchInventory', controller.searchInventory);
router.get('/remove-from-cart', controller.removeFromCart);
router.get('/admin', controller.getAdmin);
router.get('/getCartItems', controller.getCartItems)
router.get('/AdminOrderDetails/:orderID', controller.getOrderDetails)
router.get('/searchOrders', controller.searchOrders);

//POSTS
router.post('/register', body('fname').notEmpty(), body('lname').notEmpty(), body('email').notEmpty().isEmail().normalizeEmail().custom(async value => {
    if (await User.findOne({ email: value }).exec()) {
        return Promise.reject('Email already exists!')
    }
}), body('password').notEmpty(), body('line1').notEmpty(), body('state').notEmpty(), body('city').notEmpty(), body('postalCode').notEmpty().isNumeric(),  controller.register);

router.post('/login', body('email').notEmpty().normalizeEmail().isEmail(), body('password').notEmpty(), controller.login);
router.post('/postCheckout', controller.postCheckout);
router.post('/add-to-cart', controller.addToCart);
router.post('/cancelChange', controller.cancelChange);
router.post('/statusChange', controller.statusChange);
router.post('/changePageStore/:category', controller.changePageStore);
router.post('/changePageAdminCategory/:category', controller.changePageAdminCategory);
router.post('/changePageUserPurchases/:category', controller.changePageUserPurchases);

router.post('/addProduct', upload.single('productPic'), body('name').notEmpty(), body('quantity').notEmpty().isNumeric(), body('price').notEmpty(), controller.addProduct);
router.post('/editProduct', upload.single('productPic'), body('name').notEmpty(), body('quantity').notEmpty().isNumeric(), body('price').notEmpty(), controller.editProduct);
router.post('/showProduct', controller.showProduct);
router.post('/hideProduct', controller.hideProduct);
router.post('/deleteProduct', controller.deleteProduct);
router.post('/editProfile/:id', controller.editProfile);


export default router;
