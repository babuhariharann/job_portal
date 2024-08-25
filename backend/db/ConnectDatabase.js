import mongoose from "mongoose"


export const ConnectDataBase = async () => {
  await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Mongodb is connected successfully'))
    .catch((err) => console.log("Error while connect with db", err))
}