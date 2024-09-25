import mongoose, {Schema} from "mongoose";

const recommendSchema = new Schema({
    _user : {type: Schema.Types.ObjectId, ref: 'User', required:true},
    _novel : {type: Schema.Types.ObjectId, ref : 'Novel', required:true},
    ttl : {type : Date, default : () => new Date(Date.now() + 60 * 60 * 24 * 1000 * 10)}

}, {timestamps: true });

recommendSchema.index({_user:1}, {background : true});
recommendSchema.index({ttl : 1}, {background : true, expireAfterSeconds : 0});
const Recommend =  mongoose.model('Recommend', recommendSchema);
export default Recommend;
