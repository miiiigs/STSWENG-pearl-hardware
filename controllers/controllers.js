import db from '../model/db.js';

const controller = {

    getIndex: async function(req, res) {
        try{
            res.render('index');
        } catch{
            res.sendStatus(400);   
        }       
    },


}

export default controller;