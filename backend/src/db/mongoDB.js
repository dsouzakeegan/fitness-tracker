const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DATABASE_URI,{
            useUnifiedTopology:true,
            useNewUrlParser:true
        });
        console.log("Connected to Mongo DB")
    } catch(error) {
        console.error(error)
    }
}

module.exports = { connectDB };