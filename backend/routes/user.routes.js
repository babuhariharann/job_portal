import express from "express";
import { getUser, singout, updatePassword, updateProfile } from "../controllers/user.controller.js";
import { VerifyUser } from "../middlewares/VerifyUser.js";


const router = express.Router();

router.get('/signout', VerifyUser, singout)
router.get('/get-user', VerifyUser, getUser);
router.put('/update-profile', VerifyUser, updateProfile)
router.put('/update-password', VerifyUser, updatePassword)

export default router