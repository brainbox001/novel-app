import mongoose, {Schema} from "mongoose"

const contentSchema = new Schema({
    text : {type: String, required: true}
}, {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

// userSchema.index({email: 1}, {background: true})
const Content = mongoose.model('Content', contentSchema);
export default Content