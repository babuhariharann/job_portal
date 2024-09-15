import { ErrorHandler } from "../middlewares/ErrorHandler.js"
import { Job } from "../models/job.model.js"


/** post new jobs */


export const postJobs = async (req, res, next) => {

  const { title, jobType, location, companyName, introduction, responsibilities, qualification, offers, salary, hiringMultipleCandidates, personalWebsiteTitle, personalWebsiteUrl, jobNiche, newsLetterSent, jobPostedOn, postedBy } = req.body

  if (!title ||
    !jobType ||
    !location ||
    !companyName ||
    !responsibilities ||
    !qualification ||
    !salary ||
    !jobNiche ||
    title == '' ||
    jobType == '' ||
    location == '' ||
    companyName == '' ||
    responsibilities == '' ||
    qualification == '' ||
    salary == '' ||
    jobNiche == ''
  ) {
    return next(ErrorHandler(400, 'All fields are required'))
  }

  if ((personalWebsiteTitle && !personalWebsiteUrl) || (personalWebsiteUrl && !personalWebsiteTitle)) {
    return next(ErrorHandler(400, 'Both website title and url is required.If not leave it blank'))
  }

  try {
    const newJob = {
      title, jobType, location, companyName, introduction, responsibilities, qualification, offers, salary, hiringMultipleCandidates, personalWebsite: {
        title: personalWebsiteTitle,
        url: personalWebsiteUrl
      }, jobNiche, newsLetterSent, jobPostedOn, postedBy: req.user.id
    }
    const job = await Job.create(newJob)
    return res.status(200).json({
      success: true,
      message: "Your job posted successfully",
      job
    })

  } catch (error) {
    next(error)
  }
}



/** find all jobs */

export const findAllJobs = async (req, res, next) => {

  const { niche, city, searchKeyword } = req.query;
  console.log('city', city, niche)

  const query = {};

  try {
    if (city) {
      query.location = city
    }
    if (niche) {
      query.jobNiche = niche
    }
    if (searchKeyword) {
      query.$or = [
        { title: { $regex: searchKeyword, $options: "i" } },
        { introduction: { $regex: searchKeyword, $options: "i" } },
        { companyName: { $regex: searchKeyword, $options: "i" } }
      ]
    }

    console.log('queryr', query)

    const getAllJobs = await Job.find(query);
    return res.status(200).json({
      success: true,
      message: "All job fetch successfully",
      jobs: getAllJobs,
      count: getAllJobs.length
    })
  } catch (error) {
    next(error)
  }
}

/** get my jobs */

export const getMyJobs = async (req, res, next) => {

  const { id } = req.user
  console.log('id', id)
  try {
    const myJobs = await Job.find({ postedBy: id });
    console.log('myjobs', myJobs)
    return res.status(200).json(
      {
        success: true,
        message: "Your posted job fetch successfully",
        jobs: myJobs
      }
    )
  } catch (error) {
    next(error)
  }
}

/** delete jobs */


export const deleteMyJob = async (req, res, next) => {

  console.log('userid', req.user.id)
  try {
    const findJobs = await Job.findById(req.params.id)
    console.log('findjobs', findJobs)
    if (!findJobs) {
      return next(ErrorHandler(404, 'Job not found'))
    }

    console.log('check ids ', findJobs.postedBy.toString())

    if (findJobs.postedBy.toString() !== req.user.id) {
      return next(ErrorHandler(400, 'You are not allowed to delete this job post'))
    }
    await findJobs.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Job deleted successfully"
    })

  } catch (error) {
    next(error)
  }
}

/** get a single job */

export const getSingleJob = async (req, res, next) => {

  const { id } = req.params
  try {
    const findJob = await Job.findById(id);
    if (!findJob) {
      return next(ErrorHandler(404, 'Job not found'))
    }

    return res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      job: findJob
    })

  } catch (error) {

  }
}