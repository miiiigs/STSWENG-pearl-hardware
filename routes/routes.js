import { Router } from "express";
import controller from '../controllers/controllers.js';
import bodyParser from 'body-parser';
import {body, validationResult} from 'express-validator';
import { User } from '../model/userSchema.js';

const router = Router();

//BOILERPLATE
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//GETS
router.get(`/`, controller.getIndex);
router.get(`/category/:category`, controller.getCategory);
router.get(`/login`, controller.getLogin);
router.get('/registerPage', controller.getRegister);
router.get('/sortProducts', controller.sortProducts);
router.get('/searchProducts', controller.searchProducts);
router.get('/userprofile', controller.getUserProfile);
router.get('/checkout', controller.checkout);
router.get('/checkoutSuccess/:orderID', controller.checkoutSuccess);
router.get('/getUser', controller.getUser);
router.get('/cart', controller.getCart);

//POSTS
router.post('/register',body('fname').notEmpty(), body('lname').notEmpty(), body('email').notEmpty().isEmail().normalizeEmail().custom(async value => {
    if(await User.findOne({email: value}).exec()){
        return Promise.reject('Email already exists!')
    }
 }), body('password').notEmpty(), controller.register);

router.post('/login', body('email').notEmpty().normalizeEmail().isEmail(), body('password').notEmpty(), controller.login);
router.post('/postCheckout', controller.postCheckout);



export default router;
