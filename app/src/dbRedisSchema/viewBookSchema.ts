import mongoose, {Schema} from "mongoose";

const viewedBookSchema = new Schema({
    _user : {type: Schema.Types.ObjectId, required:true},
    _novel : {type: String, required:true}

}, {timestamps: true });

viewedBookSchema.index({_user: 1, _novel:1}, {background: true});
const ViewedBook = mongoose.model('ViewedBook', viewedBookSchema);
export default ViewedBook;