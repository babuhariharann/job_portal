
import bcryptjs from 'bcryptjs';

/** user signout */

import { ErrorHandler } from "../middlewares/ErrorHandler.js"
import { User } from "../models/user.model.js"


/** sign out */

export const singout = (req, res, next) => {

  try {

    return res.status(200).clearCookie("access_token").json({
      success: true,
      message: "User logout successfully"
    })

  } catch (error) {
    next(error)
  }
}

/** get user */

export const getUser = async (req, res, next) => {

  const { id } = req.user

  try {
    const user = await User.findById(id)
    if (!user) {
      return next(ErrorHandler(404, 'User not found'))
    }

    const { password: pass, ...rest } = user._doc;
    return res.status(200).json(
      {
        success: true,
        message: "User fetch successfully",
        user: rest
      }
    )
  } catch (error) {
    next(error)
  }
}


/** Update profile */

export const updateProfile = async (req, res, next) => {
  const { name, email, password, phone, address, role, firstNiche, secondNiche, thirdNiche, coverLetter } = req.body
  const { id } = req.user


  const newUserData = {
    name, email, password, phone, address, role, niches: {
      firstNiche, secondNiche, thirdNiche
    }, coverLetter
  }

  if (role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche || firstNiche == "" || secondNiche == "" || thirdNiche == "")) {
    return next(ErrorHandler(400, 'Role niche is required'))
  }
  try {

    const updateUser = await User.findByIdAndUpdate(id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    })
    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      updateUser
    })

  } catch (error) {
    next(error)
  }

}

/** update password */

export const updatePassword = async (req, res, next) => {

  const { id } = req.user
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword || oldPassword == "" || newPassword == "" || confirmPassword == "") {
    return next(ErrorHandler(400, "All fields are required"))
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(ErrorHandler(400, 'User not found'))
    }
    const comparePassword = bcryptjs.compareSync(oldPassword, user.password)
    if (!comparePassword) {
      next(ErrorHandler(404, 'Old password does not match'))
    }
    if (newPassword !== confirmPassword) {
      return next(ErrorHandler(400, 'New password and confirm password does not match'))
    }

    const hashNewPassword = bcryptjs.hashSync(newPassword, 10)

    user.password = hashNewPassword;
    await user.save();

    const { password: pass, ...rest } = user._doc
    return res.status(200).json({
      success: true,
      message: "Password change successfully",
      user: rest
    })
  } catch (error) {
    next(error)
  }
}