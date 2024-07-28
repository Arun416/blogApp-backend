const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    content:{
        type:String,
        require:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users',
    },
    image:{
        type:String,
    }
},{timestamps:true})


const blog = mongoose.model("blogs",blogPostSchema);

module.exports = blog;