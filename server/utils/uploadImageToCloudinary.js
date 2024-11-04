const cloudinary = require('cloudinary').v2;

const uploadImageToCloudinary = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'Nooruddin',
            public_id: file.name,
            resource_type: 'image',
            width: 500,
            height: 500,
            crop: 'scale',
            resize: 'fill',
        });

module.exports = uploadImageToCloudinary;