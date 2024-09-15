import { ErrorHandler } from "./ErrorHandler.js"

export const IsAuthoirzed = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(ErrorHandler(400, 'You are not allowed to access this resources'))
    }
    next()
  }
}