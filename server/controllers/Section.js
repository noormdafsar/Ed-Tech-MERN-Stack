const Section = require('../models/Section');
const course = require('../models/Course');
const Course = require('../models/Course');

const createSection = async(req, res) => {
    try {
        // fetch data
        const { sectionName, courseId } = req.body;
          // data validation
        if(!sectionName || !courseId){
            return res.status(401).json({
                success: false,
                message: 'All fields are required'
            });
        }
        // create section
        const newSection = await Section.create({sectionName});
        // update the course with section's objectId
        const updateCourseDetails = await Course.findByIdAndUpdate(
                                                courseId,
                                                {
                                                    $push:{
                                                        courseContent: newSection._id
                                                    }
                                                },
                                                {new: true},
                                            ).populate(updateCourseDetails).exec();
        return res.status(200).json({
            success: true,
            message: 'New Section created successfully...!!!',
        })

    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while creating the section'
        });
    }
}

const updateSection = async (req, res) => {
    try{
        // fetch data
        const { sectionName, sectionId } = req.body;
        // data validation
        if(!sectionName || !sectionId){
            return res.status(401).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true});
        // return response
        return res.status(200).json({
            success: true,
            message: 'section updated successfully...!!!',
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

const deleteSection = async (req, res) => {
    try {
        // fetch data or get the data - assuming that we are sending id in params
        const { sectionId } = req.params
        // delete the data
        const deleteSect = await Section.findByIdAndDelete({sectionId})
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
    createSection, updateSection, deleteSection
}