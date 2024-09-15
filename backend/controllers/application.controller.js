import { ErrorHandler } from "../middlewares/ErrorHandler.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js"

/** post application */


export const postApplication = async (req, res, next) => {

  const { id } = req.params;
  console.log('id', req.user)
  const { name, email, coverLetter, phone, address } = req.body

  try {
    const jobSeekerInfo = {
      id: req.user._id,
      name,
      email,
      coverLetter,
      phone,
      address,
      role: "Job Seeker"
    }
    if (name == '' ||
      email == "" ||
      coverLetter == "" ||
      phone == "" ||
      address == "" ||
      !name ||
      !email ||
      !coverLetter ||
      !phone ||
      !address) {
      return next(ErrorHandler(400, 'All fields are required'))
    }
    const findJob = await Job.findById(id);
    if (!findJob) {
      return next(ErrorHandler(404, 'Job not found'))
    }

    const alreadyApplied = await Application.findOne({
      "jobInfo.jobId": id,
      "jobSeekerInfo.id": req.user._id
    });
    if (alreadyApplied) {
      return next(ErrorHandler(400, 'You already applied this job'))
    }

    console.log('applicationfind', alreadyApplied)

    const employerInfo = {
      id: findJob.postedBy,
      role: "Employer"
    }

    const jobInfo = {
      jobId: id,
      jobTitle: findJob.title
    }

    const applicationCreate = await Application.create({
      jobSeekerInfo, employerInfo, jobInfo
    })
    return res.status(200).json({
      success: true,
      message: "you application for successfully posted to this job",
      application: applicationCreate
    })
  } catch (error) {
    next(error)
  }
}


/** employer get all application */

export const employerGetAllApplication = async (req, res, next) => {

  const employerId = req.user._id
  try {

    const findApplications = await Application.find({
      "employerInfo.id": employerId,
      "deletedBy.employer": false
    })

    if (!findApplications) {
      return next(ErrorHandler(400, 'Your job does not have any applications yet'))
    }

    return res.status(200).json({
      success: true,
      message: "Applications for your posted job fetched successfully",
      applications: findApplications

    })

  } catch (error) {
    next(error)
  }
}

/** job seeker get all applications */

export const jobSeekerGetAllApplications = async (req, res, send) => {

  const userId = req.user._id
  try {

    const findApplications = await Application.find({
      "jobSeekerInfo.id": userId,
      "deletedBy.jobSeeker": false
    });

    if (!findApplications) {
      return next(ErrorHandler(400, 'You dont have any job applications'))
    }
    return res.status(200).json({
      success: true,
      message: "Successfully fetched your applied job applications",
      applications: findApplications
    })
  } catch (error) {
    next(error)
  }
}

/** delete applications */

export const deleteApplications = async (req, res, next) => {

  const { id } = req.params
  const { role } = req.user
  try {
    const applications = await Application.findById(id);

    if (!applications) {
      return next(ErrorHandler(404, 'Application not found'))
    }

    switch (role) {
      case "Job Seeker":
        applications.deletedBy.jobSeeker = true;
        await applications.save();
        break;
      case "Employer":
        applications.deletedBy.employer = true;
        await applications.save();
        break;
      default:
        console.log('Default case for application delete function');
        break
    }

    if (applications.deletedBy.jobSeeker === true && applications.deletedBy.employer === true) {
      return applications.deleteOne()
    }
    return res.status(200).json({
      success: true,
      message: "Application deleted successfully"
    })
  } catch (error) {
    next(error)
  }
}