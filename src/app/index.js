const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
})

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/Thermal_Data",{ useNewUrlParser: true });

//it is for list of measurements 2nd page
const ThermalSchema = {
    Sensor_Name : String,
	Thermal_Date : Date,
	Thermal_Value : Array,
    Number_Of_People : Number,
    Image_Result : Number,
    Thermal_Image : String,
    Normal_Image : String,
    Processed : String,
};

const ThermalData= mongoose.model("ThermalSchema", ThermalSchema);


app.get("/getdata", (req, res) => {
    ThermalData.find().then(documents => {
        res.status(200).json({
            message: 'add building data fetched successfully',
            posts: documents
        });
        // console.log(documents)
    })
})

app.get('/getdata/name/:Sensor_Name', (req,res,next)=>{
    ThermalData.find({Sensor_Name: req.params.Sensor_Name}).then(documents => {
        // console.log("assetname");
        res.status(200).json({
            message: 'fetched successfully',
            posts: documents,
        });
    })
})


app.get('/getdata/measurement/view/:id', (req,res,next)=>{
    ThermalData.findOne({_id: req.params.id}).then(documents => {
        // console.log("assetname");
        res.status(200).json({
            message: 'fetched successfully',
            posts: documents,
        });
    })
})

// app.put('/getdata/measurement/view/update/:id', (req,res,next)=>{
//     console.log("hello");
//     ThermalData.updateOne({_id: req.params.id}, {$set:{Image_Result: 1}},(err, doc) => {
//         if (err) {
//             console.log("Something wrong when updating data!");
//         }
    
//         console.log(doc);
//     })
// })
/*
app.post('/AddThermal/measurement/view/:id', (req,res,next)=>{
    console.log("hello");
    ThermalData.findByID({_id: req.params.id},(err,data) =>{
        console.log("hello");
        data.Thermal_Date= req.body.Thermal_Date,
        data.Thermal_Value= req.body.Thermal_Value,
        data.Number_Of_People = req.body.Number_Of_People,
        data.Sensor_Name= req.body.Sensor_Name,
        data.Image_Result= req.body.Image_Result,
        data.Thermal_Image= req.body.Thermal_Image,
        data.Normal_Image= req.body.Normal_Image,
        data.Processed= req.body.Processed;
    })
    ThermalData.save();
    // var item = {
        // Thermal_Date: req.body.Thermal_Date,
        // Thermal_Value: req.body.Thermal_Value,
        // Number_Of_People : req.body.Number_Of_People,
        // Sensor_Name: req.body.Sensor_Name,
        // Image_Result: req.body.Image_Result,
        // Thermal_Image: req.body.Thermal_Image,
        // Normal_Image: req.body.Normal_Image,
        // Processed: req.body.Processed,
    // };
    // console.log("hello");
    // ThermalData.updateOne({_id: req.params.id}, {$set: item},(err, doc) => {
    //     if (err) {
    //         console.log("Something wrong when updating data!");
    //     }
    
    //     console.log(doc);
    // })
})*/

app.post('/AddThermal/measurement/view/:id', (req,res,next)=>{
    console.log("hello");
    var item = {
        Image_Result: req.body.Image_Result,
    };
    ThermalData.updateOne({_id: req.params.id}, {$set: item})
    .then(doc => {
        res.status(201).json({
            message: 'success Updated',
            result: doc,
        })
        // console.log(result);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

app.post("/AddThermal", (req, res) => {
    var NewDate = new Date();
    var arrData = req.body.v.split(",")
    var arrData1 = arrData.map(Number)
    var sensor_id = req.body.i
    NewDate = NewDate.toLocaleString('en-GB', {timeZone: 'Asia/Kolkata'});
    const add = new ThermalData({
        Thermal_Date: NewDate,
        Thermal_Value: arrData1,
        Number_Of_People : 5,
        Sensor_Name: sensor_id,
        Image_Result: 0,
        Thermal_Image: "thermal+image+3.jpg",
        Normal_Image: "group+image.jpg",
        Processed: "N",
    });
    console.log("newData");
    add.save()
        .then(result => {
            res.status(201).json({
                message: 'success add',
                result: result,
            })
            // console.log(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
    })
})






//it sis for list of sensors 1st page
// const sensorSchema = {
//     Sensor_Name : String,
// 	// Location : String,
// };

// const sensorData= mongoose.model("sensorSchema", sensorSchema);

// app.post("/sensorname", (req, res) => {
//     var sensor_id = req.body.i
//     const add = new sensorData({
//         Sensor_Name: sensor_id,
//     });
//     // console.log(sensorList);
//     add.save()
//         .then(result => {
//             res.status(201).json({
//                 message: 'success add',
//                 result: result
//             })
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err
//             })
//     })
// })








//model for setting customer

const customerSchema = {
    customer : String,
    location : String,
    thermal_sensors : String,
	// Location : String,
};

const customerData= mongoose.model("customerSchema", customerSchema);

//settings screen customer list

app.post("/customerlist", (req, res) => {
    const add = new customerData({
        customer: req.body.customer,
        location: req.body.location,
        thermal_sensors: req.body.thermal_sensors,
    });
    // console.log(sensorList);
    add.save()
        .then(result => {
            res.status(201).json({
                message: 'success add',
                result: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
    })
})

app.get('/customerlist', (req,res)=>{
    customerData.find().then(documents => {
        res.status(200).json({
            message: "success",
            posts: documents
        })
    })
})

app.get('/customerlist/name/:Sensor_Name', (req,res,next)=>{
    ThermalData.find({Sensor_Name: req.params.Sensor_Name}).then(documents => {
        // console.log("assetname");
        res.status(200).json({
            message: 'fetched successfully',
            posts: documents,
        });
    })
})



app.listen(3000, function() {
	console.log("Server started on port 3000");
});
