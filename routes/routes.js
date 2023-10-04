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

//POSTS
router.post('/register',body('fname').notEmpty(), body('lname').notEmpty(), body('email').notEmpty().isEmail().normalizeEmail().custom(async value => {
    if(await User.findOne({email: value}).exec()){
        return Promise.reject('Email already exists!')
    }
 }), body('password').notEmpty(), controller.register);


export default router;