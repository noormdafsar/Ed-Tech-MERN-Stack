const Tag = require('../models/tags');

const createTag = async (req, res) => {
    try {
        // fetch data 
        const { name, description } = req.body;
        // check if tag already exist
        if(!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }
        // create tag
        const tagDetails = await Tag.create({
            name: name,
            description: description,
        });
        console.log('Tag Details:', tagDetails);
        // return response
        return res.status(200).json({
            success: true,
            message: 'Tag created successfully',
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while creating the tag',
        });
    }
}

const showAllTags = async (req, res) => {
    try {
        const allTags = await Tag.find({}, {name: true, description: true})
        return res.status(200).json({
            success: true,
            message: 'All tags fetched successfully',
            data: allTags,
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while fetching all the tags',
        });
    }
}

module.exports = {
    createTag,
    showAllTags,
}

