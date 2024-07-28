const blogModel = require('../models/blog.model');

const getAllBlogs = async(req,res)=>{
    try{
        const { sortBy = 'createdAt', order = 'asc', page = 1, limit = 10 } = req.query;

        const pageNo = parseInt(page,10);
        const limitNo = parseInt(limit,10);

        const skip = (pageNo - 1) * limitNo;

        // Construct the sort object
        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions = { [sortBy]: sortOrder };

        const blogs = await blogModel.find().sort(sortOptions).skip(skip).limit(limitNo);;
        
        const totalBlogs = await blogModel.countDocuments();
        
        if(blogs){
            res.status(200).json({data: blogs,totalBlogs,
                totalPages: Math.ceil(totalBlogs / limitNo),
                currentPage: pageNo})
        }
    }
    catch(err){
        res.status(500).send(err)
    }
}

const createBlog = async(req,res)=>{
    try{
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const newblog = new blogModel({
            title: req.body.title,
            content: req.body.content,
            author: req.user._id,
            image: `${baseUrl}/public/blogs/images/${req.file.filename}`,
        })
        console.log(newblog);
        const updateBlog = await newblog.save();
        if(updateBlog){
            res.status(200).json({message:"Blog Created!!"})
        }
    }
    catch(err){
        res.status(500).send(err)
    }
}


const getUsersBlogs = async(req,res)=>{
        let userId = req.user;
      
    try {

        const { sortBy='createdAt', order , page, limit} = req.query;

        const pageNo = parseInt(page,10);
        const limitNo = parseInt(limit,10);

        const skip = (pageNo - 1) * limitNo;

        // Construct the sort object
        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions = { [sortBy]: sortOrder };
        


        const blogs = await blogModel.find({author: req.params.id}).sort(sortOptions).skip(skip).limit(limitNo);;
        const totalBlogs = await blogModel.countDocuments({ author: req.params.id });

        if(blogs){
            res.status(200).json({
                data: blogs,
                totalBlogs,
                totalPages: Math.ceil(totalBlogs / limitNo),
                currentPage: pageNo
            })
        }
        else {
            res.status(404).json({ message: 'No blogs found for this user.' });
        }
    }
    catch(err){
        res.status(500).send(err)
    }
}


const getBlogDetail = async(req,res)=>{
    try{
        const blogs = await blogModel.find({_id: req.params.id});
        
        if(blogs){
           
            res.status(200).json({data:blogs})
        }
    }
    catch(err){
        res.status(500).send(err)
    }
}


const updatePost = async(req,res)=>{
    try{
        req.body.image = req.file? `${baseUrl}/public/blogs/images/${req.file.filename}`:req.body.image
        const updatedBlog = await blogModel.findByIdAndUpdate({_id: req.params.id},req.body);
        if(updatedBlog){
            const blogs = await blogModel.find();
            res.status(200).json({message:"Blog Successfully Updated",data:blogs})
        }
    }
    catch(err){
        res.status(500).send(err)
    }
}

const deletePost = async(req,res)=>{
    try {
        const updatedBlog = await blogModel.findByIdAndDelete({_id: req.params.id},req.body);
        if(updatedBlog){
            res.status(200).json({message:"Blog Deleted"})
        }
    }
    catch(err){
        res.status(500).send(err)
    }
}


module.exports = {
    getAllBlogs,
    createBlog,
    getUsersBlogs,
    updatePost,
    deletePost,
    getBlogDetail
};