import mongoose, {Schema} from "mongoose"

const novelSchema = new Schema({
    title: { type: String, required: true },
    coverPhoto: {type: Buffer},
    author: {type: String, required: true},
    contents : {
        chapter : {type: String}
    }
}, {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

// userSchema.index({email: 1}, {background: true})
const Novel = mongoose.model('Novel', novelSchema);
export default Novel