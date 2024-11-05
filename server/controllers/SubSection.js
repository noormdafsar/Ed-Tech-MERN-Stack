const Section = require('../models/Section');
const SubSection = require('../models/SubSection');

const createSubSection = async (req, res) => {
    try {
        // fetch data
        const { sectionId, title, timeDuration, description, VideoUrl } = req.body;
        // extract file/video
        const video = req.files.videoFile;
        // validate data
        if( !sectionId || !title || !timeDuration || !description || !VideoUrl) {
            return res.status(401).json({
                success: false,
                message: 'All fields are required',
            });
        }
        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        // create sub section
        const subSectionDetails = await SubSectoin.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            VideoUrl: uploadDetails.secure_url,
        });
        // update the section with this sub section's objectId
        const updateSection = await SubSection.findByIdAndUpdate({section_id},
            {
                $push: {
                    SubSection: subSectionDetails.section_id,
                }
            },
            {new: true}
        );
        console.log('Updated Section: ', updateSection);
        return res.status(200).json({
            success: true,
            message: 'Sub section created successfully...!!!'
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while creating the sub section'
        });
    }
}

const updateSubSection = async (req, res) => {
    try{
        // fetch data
        const { SubSectionName, subSectionId } = req.body;
        // data validation
        if(!sectionName || !sectionId){
            return res.status(401).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // update data
        const section = await Section.findByIdAndUpdate(SubSectionId, {SubSectionName}, {new: true});
        // return response
        return res.status(200).json({
            success: true,
            message: 'Sub section updated successfully...!!!',
        });
    }
    catch(error) {
        return res.status(500).json({
           success: false,
           message: 'Error while getting all the section',
           data: showAllSection, 
        })
    }
}

const deleteSubSection = async (req, res) => {
    try {
        // fetch data or get the data - assuming that we are sending id in params
        const { SubSectionId } = req.params
        // delete the data
        const deleteSect = await Section.findByIdAndDelete({SubSectionId})
        // return response
        return res.status(200).json({
            success: true,
            message: 'Section Deleted Successfully',
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while deleting Section',
        })
    }
}

module.exports = {
    createSubSection,
    updateSubSection,
    deleteSubSection,
}