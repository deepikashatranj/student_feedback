const mongoose = require('mongoose');

const connectdb = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`🎯 MongoDB Connected Successfully to Host: ${conn.connection.host} 🎉`)

    }
    catch(error){
        console.error(`❌ Database Connection Fail: ${error.message}`);

        process.exit(1);
    }
};

module.exports = connectdb;