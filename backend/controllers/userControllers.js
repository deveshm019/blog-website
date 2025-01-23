const HttpError = require("../models/errorModel.js");
const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const {v4: uuid} = require("uuid")
const fs = require('fs')
const path = require('path')

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password) {
      return next(new HttpError("Fill all fields!", 422));
    }
    const actualEmail = email.toLowerCase();
    const emailExists = await User.findOne({ email: actualEmail });
    if (emailExists) {
      return next(new HttpError("Email already exists!", 422));
    }
    if (password.trim().length < 6) {
      return next(
        new HttpError("Password should have minimum 6 characters!", 422)
      );
    }
    if (password != confirmPassword) {
      return next(new HttpError("Passwords do not match!!", 422));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name: name,
      email: actualEmail,
      password: hashedPassword,
    });
    res.status(201).json(`User ${newUser.email} registered!`)
  } catch (error) {
    return next(new HttpError("User registration failed!", 422));
  }
};

const loginUser = async (req, res, next) => {
  try {
    const {email,password} = req.body;
    if(!email || !password){
        return next(new HttpError("Fill all fields!",422))
    }
    const actualEmail = email.toLowerCase();
    const user = await User.findOne({email:actualEmail})
    if(!user){
        return next(new HttpError("User does not exist!",422))
    }
    const comparePassword = await bcrypt.compare(password,user.password)
    if(!comparePassword){
        return next(new HttpError("Invalid password!",422))
    }

    const {_id:id,name:name} = user;
    const token = jwt.sign({id,name},process.env.JWT_SECRET,{expiresIn:"1d"})
    res.status(200).json({token,id,name})
  } catch (error) {
    return next(new HttpError("Invalid credentials!",422))
  }
};

const getUser = async (req, res, next) => {
    try {
      const {id} = req.params;
      const user = await User.findById(id).select('-password')
      if(!user){
        return next(new HttpError("User not found!",404))
      }
      res.status(200).json(user)
    } catch (error) {
      return next(new HttpError(error))
    }
  };

const getAuthors = async (req, res, next) => {
  try {
    const authors = await User.find().select('-password')
    res.json(authors)
  } catch (error) {
    return next(error)
  }
};

const changeAvatar = async (req, res, next) => {
  try {
    if(!req.files.avatar){
      return next(new HttpError("Please choose an Image!",422))
    }
    const user = await User.findById(req.user.id)
    if(user.avatar){
      fs.unlink(path.join(__dirname,'..','uploads',user.avatar),(error)=>{
        if(error){
          return next(new HttpError(error))
        }

      })
    }
    const {avatar} = req.files;
    if(avatar.size > 500000){
      return next(new HttpError("Image should be less than 500kb!",422))
    }
    let filename;
    filename = avatar.name;
    let splittedFilename = filename.split('.')
    let newFilename = splittedFilename[0] + uuid() + '.' + splittedFilename[splittedFilename.length-1]
    avatar.mv(path.join(__dirname,"..","uploads",newFilename), async (error)=>{
      if(error){
       return next(new HttpError(error)) 
      }
      const updatedAvatar = await User.findByIdAndUpdate(req.user.id,{avatar:newFilename},{new:true})
      if(!updatedAvatar){
        return next(new HttpError('Failed to change profile!',422))
      }
      res.status(200).json(updatedAvatar)
    })
  } catch (error) {
    return next(new HttpError(error))
  }
};

const editUser = async (req, res, next) => {
  try {
    const {name, email, currentPassword, newPassword, confirmNewPassword} = req.body;
    if(!name || !email || !currentPassword || !newPassword){
      return next(new HttpError("Please fill all fields!",422))
    }
    const user = await User.findById(req.user.id);
    if(!user){
      return next(new HttpError("User not found!",403))
    }
    const emailExists = await User.findOne({email:email})
    if(emailExists && (emailExists.id != req.user.id)){
      return next(new HttpError("Email already exists!",422))
    }
    const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
    if(!validateUserPassword){
      return next(new HttpError("Current password invalid!"),422)
    }
    if(newPassword != confirmNewPassword){
      return next(new HttpError("New passwords don't match!",422))
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword,salt)
    const newInfo = await User.findByIdAndUpdate(req.user.id,{name:name, email: email, password: hashedPassword},{new:true})
    res.status(200).json(newInfo)

  } catch (error) {
    return next(new HttpError(error))
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
};
