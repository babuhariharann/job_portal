import { deleteApplications, employerGetAllApplication, jobSeekerGetAllApplications, postApplication } from "../controllers/application.controller.js";
import express from "express";
import { VerifyUser } from "../middlewares/VerifyUser.js";
import { IsAuthoirzed } from "../middlewares/IsAuthorized.js";


const router = express.Router();

router.post('/post/:id', VerifyUser, IsAuthoirzed('Job Seeker'), postApplication);
router.get('/employer/getall', VerifyUser, IsAuthoirzed('Employer'), employerGetAllApplication);
router.get('/jobseeker/getall', VerifyUser, IsAuthoirzed('Job Seeker'), jobSeekerGetAllApplications);
router.delete('/delete/:id', VerifyUser, deleteApplications)


export default router