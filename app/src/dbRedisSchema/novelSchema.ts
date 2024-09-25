import mongoose, {Schema} from "mongoose";

const novelSchema = new Schema({
    title: { type: String, required: true, unique: true },
    coverPhoto: {
        mimeType : {type : String},
        buffer : {type: Schema.Types.Mixed}
    },
    author: {type: Schema.Types.ObjectId,
            ref : 'User',
            required: true},
    _cct : {type: Number, default:0},
    category : {type: String, required: true}
}, {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

novelSchema.index({category: 1}, {background: true});
const Novel = mongoose.model('Novel', novelSchema);
export default Novel