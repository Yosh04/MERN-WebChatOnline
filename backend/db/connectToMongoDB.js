import  mongoose  from "mongoose";

const connectToMongoDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log('Data base online')
    } catch (error) {
        console.log('Error to connect to Mongo DB', error)
    }
}

export default connectToMongoDB;