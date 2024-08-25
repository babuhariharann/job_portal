import { ErrorHandler } from "./ErrorHandler.js";

export const VerifyUser = (req, res, next) => {

  const token = req.cookies.access_token;

  if (!token) {
    return next(ErrorHandler(400, 'unauthorized'))
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next(ErrorHandler(400, 'Unauthorized'))
    }
    req.user = user;
    next()
  })
}     