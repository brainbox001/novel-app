import mongoose, {Schema} from "mongoose";

const novelSchema = new Schema({
    title: { type: String, required: true, unique: true },
    coverPhoto: {
        mimeType : {type : String},
        buffer : Schema.Types.Mixed
    },
    author: {type: Schema.Types.ObjectId,
            ref : 'User',
            required: true},
    contents : {
        type : Schema.Types.Mixed
    }
}, {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

novelSchema.index({author: 1}, {background: true});

const Novel = mongoose.model('Novel', novelSchema);
export default Novel