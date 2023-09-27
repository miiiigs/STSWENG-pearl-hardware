import db from '../model/db.js';
import { Product } from '../model/productSchema.js';

const controller = {

    getIndex: async function(req, res) {
        try{
            const product_list = [];
            const resp = await Product.find({});
            for(let i = 0; i < resp.length; i++) {
                product_list.push({
                    name: resp[i].name,
                    type: resp[i].type,
                    quantity: resp[i].quantity,
                    productpic: resp[i].productpic,
                });
            }
            res.render('index',{
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

 

}

export default controller;