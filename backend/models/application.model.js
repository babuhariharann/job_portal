import mongoose from "mongoose";
import validator from "validator";


const applicationScheme = new mongoose.Schema({
  jobSeekerInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      validata: [validator.isEmail, 'Please provide a valid email']
    },
    coverLetter: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['Job Seeker'],
      required: true
    },
  },
  employerInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    role: {
      type: String,
      required: true,
      enum: ['Employer']
    }
  },
  jobInfo: {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    jobTitle: {
      type: String,
      required: true
    }
  },
  deletedBy: {
    jobSeeker: {
      type: Boolean,
      default: false
    },
    employer: {
      type: Boolean,
      default: false
    }
  }
})

export const Application = mongoose.model('Application', applicationScheme)