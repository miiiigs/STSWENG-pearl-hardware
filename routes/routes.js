import { Router } from "express";
import controller from '../controllers/controllers.js';
import bodyParser from 'body-parser';
import { body, validationResult } from 'express-validator';
import { User } from '../model/userSchema.js';

import multer from 'multer';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

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

router.get('/userprofile', controller.getUserProfile);
router.get('/checkout', controller.checkout);
router.get('/checkoutSuccess/:orderID', controller.checkoutSuccess);
router.get('/getUser', controller.getUser);
router.get('/productDesc', controller.getProductDesc);
router.get('/cart', controller.getCart);
router.get('/logout', controller.logout);
router.get('/product', controller.getProduct);

router.get('/adminInventory', controller.getAdminInventory);
router.get('/searchInventory', controller.searchInventory);
router.get('/remove-from-cart',controller.removeFromCart);
router.get('/admin',controller.getAdmin);
router.get('/getCartItems', controller.getCartItems)
router.get('/AdminOrderDetails/:orderID', controller.getOrderDetails)


//POSTS
router.post('/register', body('fname').notEmpty(), body('lname').notEmpty(), body('email').notEmpty().isEmail().normalizeEmail().custom(async value => {
    if (await User.findOne({ email: value }).exec()) {
        return Promise.reject('Email already exists!')
    }
}), body('password').notEmpty(), controller.register);

router.post('/login', body('email').notEmpty().normalizeEmail().isEmail(), body('password').notEmpty(), controller.login);
router.post('/postCheckout', controller.postCheckout);
router.post('/add-to-cart', controller.addToCart);
router.post('/cancelChange', controller.cancelChange);
router.post('/statusChange', controller.statusChange);

router.post('/addProduct', upload.single('productPic'), controller.addProduct);
router.post('/showProduct', controller.showProduct);
router.post('/hideProduct', controller.hideProduct);


export default router;
