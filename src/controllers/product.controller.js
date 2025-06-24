import {Product} from "../models/Product.model.js";


export const getProducts = async (req,res) => {
    try {
        const allProducts = await Product.find();
        if (allProducts.length > 0){
            res.status(200).json({
                success: true,
                message: 'Products fetched successfully',
                count: allProducts.length,
                products: allProducts
            });
        }else {
            res.status(401).json({
                success: false,
                message: 'No products found',
                count: 0,
                products: []
            });
        }

    }catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }

}


export const createProduct = async (req,res) => {
    try {
        const product = await Product.create({
            ...req.body,
            user: req.user._id
        })

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: product
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }

}

export const getProductsById = async(req,res) => {
    const product = await Product.findById(req.params.id);
    if (product){
        res.status(200).json({
            success: true,
            message: 'Product fetched successfully',
            product: product
        });
    }else {
        res.status(401).json({
            success: false,
            message: 'No product found'
        });
    }
}

export const updateProduct = async (req,res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (product){
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product: product
        });
    }else {
        res.status(401).json({
            success: false,
            message: 'No product found'
        });
    }
}

export const deleteProduct = async (req,res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (product){
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',

        });
    }else {
        res.status(401).json({
            success: false,
            message: 'No product found'
        });
    }
}
