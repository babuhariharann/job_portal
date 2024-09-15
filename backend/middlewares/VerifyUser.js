import { User } from "../models/user.model.js";
import { ErrorHandler } from "./ErrorHandler.js";
import jwt from "jsonwebtoken";

export const VerifyUser = (req, res, next) => {

  try {
    const token = req.cookies.access_token;
    if (!token) {
      return next(ErrorHandler(400, 'User is not authenticated'))
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
      if (err) {
        return next(ErrorHandler(400, 'Unauthorized'))
      }
      req.user = await User.findById(user.id);
      next()
    })
  } catch (error) {
    next(error)
  }
}     