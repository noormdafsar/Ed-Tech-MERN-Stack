const Category = require('../models/Category');

const createCategory = async (req, res) => {
    try {
        // fetch data 
        const { name, description } = req.body;
        // check if category already exist
        if(!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }
        // create category
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        });
        console.log('Category Details:', categoryDetails);
        // return response
        return res.status(200).json({
            success: true,
            message: 'Category created successfully',
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while creating the Category',
        });
    }
}

const showAllCategory = async (req, res) => {
    try {
        const allCategory = await Category.find({}, {name: true, description: true})
        return res.status(200).json({
            success: true,
            message: 'All categories fetched successfully',
            data: allCategory,
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while fetching all the categories',
        });
    }
}

module.exports = {
    createCategory,
    showAllCategory,
}

