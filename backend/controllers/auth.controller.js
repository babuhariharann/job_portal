import { v2 as cloudinary } from "cloudinary";

import { ErrorHandler } from "../middlewares/ErrorHandler.js"
import { User } from "../models/user.model.js"
import { jwtToken } from "../utils/jwtToken.js";
import bcryptjs from 'bcryptjs'

/** register user */

export const register = async (req, res, next) => {

  const { name, email, phone, address, password, role, firstNiche, secondNiche, thirdNiche, coverLetter } = req.body

  if (req.files && req.files.resume) {
    console.log("resumee", req.files.resume)
  }

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