const mongoose = require('mongoose');

// Schema for Class Collection
const classSchema = new mongoose.Schema({
    standard: String,  //Standard or grade
    division: String   //Division or section
});

//Ensuring uniqueness for each combo of standard and division
classSchema.index({ standard: 1, division: 1 }, { unique: true });

//exporting schema as a mongoose model
module.exports = mongoose.model('Class', classSchema);
