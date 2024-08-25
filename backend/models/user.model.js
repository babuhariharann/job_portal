import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must be contain minimum 3 characters"],
    maxLength: [20, 'Name should not be exceed 20 characters']
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  niches: {
    firstNiche: String,
    secondNiche: String,
    thirdNiche: String
  },
  role: {
    type: String,
    required: true,
    enum: ['Job Seeker', 'Employer']
  },
  coverLetter: {
    type: String
  },
  resume: {
    public_id: String,
    url: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }

});


// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     next()
//   }
//   this.password = await bcrypt.hash(this.password, 10)
// })

// userSchema.methods.comparePassword = async (enterPassword) => {
//   return await bcrypt.compare(enterPassword, this.password)
// }

// userSchema.methods.getJWTtoken = () => {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
//     expiresIn: process.env.JWT_EXPIRE
//   })
// }

export const User = mongoose.model('User', userSchema);
