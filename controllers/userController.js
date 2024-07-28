const userModel = require('../models/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signUpUsers = async(req,res)=>{
    try
    {
       const user = await userModel.findOne({email: req.body.email});
       if(!user){
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        const user_Obj = new userModel({
            username: req.body.username,
            email: req.body.email,
            password: hash
        })

       const result = await user_Obj.save();
       if(result){
        res.status(200).json({message:"User Successfully Created"})
       }
       }
       else { res.status(400).json({message:"This Email choosed Already!!"}) }
    }
    catch(err){  res.send(err); }
}


const loginUser = async(req,res)=>{
    try {
        const user = await userModel.findOne({email:req.body.email});
        if(!user){ res.status(400).json({message:"User Not Found"})}
        else {
             const passwordValidation = await bcrypt.compare(req.body.password,user.password);
             if(!passwordValidation) { res.status(400).json({message:"InCorrect Password,Please try again"})}
             else {
                const accessToken = jwt.sign({
                    username: user.username,
                    email: user.email,
                    _id: user._id
                }, process.env.JWT_SECRET_KEY, {
                    expiresIn: '1h'
                });

                return res.status(200).json({ token: accessToken ,message:"Login Success"});
             }
        }
    }
    catch(err){ res.status(500).send(err)}
}



const updateUserProfile = async(req,res)=>{
    console.log(req.body,"body Object1");
    const {first_Name,last_Name,email,mobile_No,dob,profile_picture,country,bio
    } = req.body;
    try {
         const user = {
            first_Name :first_Name,
            last_Name :last_Name,
            email:email,
            mobile_No: mobile_No,
            dob:dob,
            profile_picture: req.file ? `/public/uploads/${req.file.filename}` : profile_picture,
            country:country,
            bio:bio
        }

            const { id } = req.params;
            const updatedUser = await userModel.findByIdAndUpdate(id, user) 
            
            if(!updatedUser){
                res.status(400).json({message:"Invalid User"})
            }
            else {
                const User = await userModel.find({ _id : id });
                res.status(200).json({message:"Profile Updated",data: User})
            }
    }
    catch(err){res.status(500).send(err)}
}


const getUserProfile = async(req,res)=>{
    const userId  =  req.params.id;
    try {
        const userData = await userModel.find({_id: userId});
        if(!userData){
            res.status(400).json({message:"User not Found"})
        }
        else {
            res.status(200).json({data: userData});
        }
    }
    catch(err){
        res.status(500).send(err)
    }
}


module.exports = {
    signUpUsers,
    loginUser,
    updateUserProfile,
    getUserProfile
}