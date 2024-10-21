import mongoose from 'mongoose';

// Connect to MongoDB

const connectToMongo =  () => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error(err));
}

export default connectToMongo;