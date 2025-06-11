//Importing Modules
const express = require('express');
const db = require('./db')

// port value from .env file
require('dotenv').config();
const port = process.env.PORT

//Importing Mongoose models
const Class = require('./models/class')
const Student = require('./models/student');


var app = express();
app.use(express.json());  // for parsing JSON request bodies



// Creating a Class
app.post('/class', async (req,res) => {
    try{
        const {standard, division} = req.body;

        //Check if class with given standard already exists
        const classExist = await Class.findOne({standard,division});
        if (classExist) {
            res.status(400).send('Class already exists')
        } 
        else{    //if not create a new class and save it
        const newClass = new Class(req.body);
        await newClass.save();
        res.status(200).send(newClass);
        }
    }
    catch(error){
        res.status(500).json({"error":error});
    }
});

// Creating a Student
app.post('/student', async (req,res) => {
    try {

    const {name,rollNo,mobileNo,standard,division} = req.body;

    //Finding the class if it is already there
    let cls = await Class.findOne({standard,division});

    //If cls is new and not present-- create a class and save it
    if (!cls && standard && division) {

    cls = new Class({standard,division});
    await cls.save();
    }

    // get the id of the class and create new student with reference to the class
    const clsId = cls._id;
    const newStudent = new Student({ name,rollNo,mobileNo,classId: clsId});
    await newStudent.save();

    res.send(newStudent);
    }
    catch (error) {
        res.status(400).json({"error":error})
    }
})



// Update Students Class with standard and division
app.put('/student/:id/class', async (req,res) => {
    try {
        let cls = await Class.findOne(req.body);
    
    // if class is not present -- create and save it
    if (!cls) {
        cls = new Class(req.body);
        await cls.save();
    } 

    // Update student's classId field
    const student = await Student.findByIdAndUpdate(req.params.id, {classId: cls._id});
    
    res.json(student);

    } 
    catch(error) {
        res.status(400).json({"error":error})
    }
})


// Delete a Class
app.delete('/classes/:id', async (req,res) =>{
    try {
  
    await Student.updateMany({classId:req.params.id}, {classId: null});

    // Then delete the class document
     const deleteData = await Class.findByIdAndDelete(req.params.id);
     if(!deleteData){
        res.status(404).json({message:'The Class in not Present'})
     }
    
    res.sendStatus(204); // No content will be there
    } 
    catch (error) {
       res.status(500).json({message:'Internal server error',error:error})
    }
});

//Delete a Student
app.delete('/student/:id', async (req,res) => {
    try {
    const deleteData = await Student.findByIdAndDelete(req.params.id);

    if(!deleteData){
        res.status(404).json({message:'The Student data in not Present'})
     }
    res.sendStatus(204); // no content will be there
    } 
    catch {
        res.status(404).send("The Student data is not added")
    }
});


//Read all students in a standard or by standard and division
app.get('/student', async (req,res) => {

    try {
        const {standard, division} = req.body;
    
    // Get students from specific standard and division 
    if (standard && division) {
        const cls = await Class.findOne({standard, division});
        const students = await Student.find({classId: cls._id});
        res.json(students);

    }    // Get students from specific standard  (all divisions)
    else if (standard) {
        const classes = await Class.find({standard});
        const classIds = classes.map(cls => cls._id);
        const students = await Student.find({classId: {$in: classIds} });
        res.json(students);   
        
    }
    }
    catch (error) {
        res.status(400).send("No data found")
    }

})




// Starting Server
app.listen(5000, () => {
    console.log('Server listening on port 5000')  //for printing in the console
});


