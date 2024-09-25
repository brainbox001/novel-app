import mongoose, {Schema} from "mongoose";

const preferenceSchema = new Schema({
    userId : {type : Schema.Types.ObjectId, ref: 'User', required: true},
    category : {type : String},
    visitCount: { type: Number, default: 0 },
    novelName : {type: String},
    ttl: { type: Date} 
}, { timestamps: true });

preferenceSchema.index({ userId: 1, category: 1 }, { background: true });
preferenceSchema.index({ userId: 1, visitCount: -1 }, { background: true });
preferenceSchema.index({userId : 1, novelName: 1}, {background: true});
preferenceSchema.index({ttl : -1}, {expireAfterSeconds : 0});

const Preference = mongoose.model('Preference', preferenceSchema);
export default Preference;
