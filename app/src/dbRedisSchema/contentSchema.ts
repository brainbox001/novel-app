import mongoose, {Schema} from "mongoose";

const contentSchema = new Schema({
    _novel : {type : Schema.Types.ObjectId},
    content : {type: String, required: true},
    _chapterNum : {type:Number},
    expiresAt : {type: Date, default: () => new Date(Date.now() + (24 * 60 * 60))}
}, {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

contentSchema.index({expiresAt: 1}, {background: true, expireAfterSeconds: 0});
contentSchema.index({_novel:1, _chapterNum: 1}, {background: true});
const Content = mongoose.model('Content', contentSchema);
export default Content