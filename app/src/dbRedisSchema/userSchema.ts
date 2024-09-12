import mongoose, {Schema} from "mongoose"

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        string: {type: String, required: true},
        salt : {type: String, required: true}
    },
    emailIsVerified : {type: Boolean}
    
}, {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

userSchema.index({email: 1}, {background: true})

const User = mongoose.model('User', userSchema)
export default User
