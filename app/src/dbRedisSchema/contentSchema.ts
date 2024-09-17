import mongoose, {Schema} from "mongoose";

const contentSchema = new Schema({
    content : {type: String, required: true},
    expiresAt : {type: Date, default: Date.now}
}, {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

contentSchema.index({expiresAt: 1}, {expireAfterSeconds: 24 * 60 * 60});
const Content = mongoose.model('Content', contentSchema);
export default Content