const mongoose = require('mongoose');

// Schema for Student Collection
const studentSchema = new mongoose.Schema({
    name: String,
    rollNo: Number,
    mobileNo: String,
    classId: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'} //Stores objectid of referenced class 
});


module.exports= mongoose.model('Student', studentSchema);




