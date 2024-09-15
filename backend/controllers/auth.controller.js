import { v2 as cloudinary } from "cloudinary";

import { ErrorHandler } from "../middlewares/ErrorHandler.js"
import { User } from "../models/user.model.js"
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'

/** register user */

export const register = async (req, res, next) => {

  const { name, email, phone, address, password, role, firstNiche, secondNiche, thirdNiche, coverLetter } = req.body



  console.log('data', name, email, phone, address, password, role)
  if (!name || !email || !phone || !address || !password || !role) {
    return next(ErrorHandler(400, 'All fields are required'))
  }
  if (role === 'Job Seeker' && (!firstNiche || !secondNiche || !thirdNiche)) {
    return next(ErrorHandler(400, 'Please provide the job niche'))
  }

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(ErrorHandler(400, 'Email already registered'))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    console.log('hashedPasswrod', hashedPassword)

    const userData = {
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      role,
      niches: {
        firstNiche,
        secondNiche,
        thirdNiche
      },
      coverLetter,
    };

    if (req.files && req.files.resume) {
      const { resume } = req.files;
      if (resume) {
        try {

          const cloudinaryResponse = await cloudinary.uploader.upload(
            resume.tempFilePath,
            { folder: "Job_seeker_resume" }
          );

          if (!cloudinaryResponse || cloudinaryResponse.error) {
            return next(ErrorHandler(500, "Failed to upload resume"))
          }

          userData.resume = {
            public_id: cloudinary.public_id,
            url: cloudinary.url
          }


        } catch (error) {
          return next(ErrorHandler(500, "Failed to upload resume"))
        }
      }
    }
    const user = await User.create(userData);
    return res.status(200).json({ success: true, message: "User successfully registered" })
  } catch (error) {
    return next(error)
  }
}


/** login user */


export const login = async (req, res, next) => {

  const { email, password } = req.body;

  if (!email || !password || email == "" || password == "") {
    return next(ErrorHandler(400, 'All fields required'))
  }

  try {

    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(ErrorHandler(404, 'Email not found'))
    }
    const comparePassword = bcryptjs.compareSync(password, validUser.password);
    console.log('cmpare', comparePassword)
    if (!comparePassword) {
      return next(ErrorHandler(404, 'Password does not match'))
    }

    const token = jwt.sign({
      id: validUser._id
    }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE
    })

    console.log('token', token);

    const options = {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true
    }

    const { password: pass, ...rest } = validUser._doc


    return res.status(200).cookie("access_token", token, options).json({
      success: true,
      message: "Login successfully",
      user: rest
    })
  } catch (error) {
    next(error)
  }

}

