import mongoose from "mongoose"

const connectDB  = async () : Promise<undefined>   => {
    try {
        await mongoose.connect('mongodb://root:example@mongo:27017/?authSource=admin', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected successfully!');
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message); 
        } else {
            console.error('Unknown error occurred:', error);
        }
    }
};

export default connectDB;
