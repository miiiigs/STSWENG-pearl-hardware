import { Router } from "express";
import controller from '../controllers/controllers.js';
import bodyParser from 'body-parser';

const router = Router();

//BOILERPLATE
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//GETS
router.get(`/`, controller.getIndex);


export default router;