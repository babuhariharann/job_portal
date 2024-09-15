import express from 'express'
import { deleteMyJob, findAllJobs, getMyJobs, getSingleJob, postJobs } from '../controllers/job.controller.js'
import { IsAuthoirzed } from '../middlewares/IsAuthorized.js'
import { VerifyUser } from '../middlewares/VerifyUser.js'


const router = express.Router()

router.post('/post-job', VerifyUser, IsAuthoirzed('Employer'), postJobs);
router.get('/get-all-jobs', findAllJobs);
router.get('/get-my-jobs', VerifyUser, IsAuthoirzed('Employer'), getMyJobs);
router.delete('/delete/:id', VerifyUser, IsAuthoirzed('Employer'), deleteMyJob)
router.get('/get/:id', getSingleJob)



export default router