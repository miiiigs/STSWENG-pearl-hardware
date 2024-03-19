import { Bundle } from '../model/bundleSchema.js';
const adminController = {
    createBundle: async function (req, res) {
        try {
            products = req.body.products
            
            const newBundle = new Bundle({
                name: req.body.name,
                description: req.body.description,
                products: req.body.products,
            });
    
            // Save the new bundle document to the database
            const savedBundle = await newBundle.save();

        } catch {
            res.sendStatus(400);
        }
    },
}

export default adminController;