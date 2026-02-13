const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from uploads

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// MongoDB connection URI
const uri = 'mongodb://localhost:27017/medinavigator';
mongodb://localhost:27017/medinavigator

// Connect to MongoDB using Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Define a schema
const dataSchema = new mongoose.Schema({
    name: String,
    dob: String,
    gender: String,
    email: String,
    age: Number,
    bloodgroup: String,
    height: Number,
    weight: Number,
    patientContact: String,
    emergencyContact: String,
    wardNumber: String,
    medicalHistory: String,
    imagePath: String, // Add imagePath field
});

// Define a model
const Data = mongoose.model('Data', dataSchema);

// Add data with file upload endpoint
app.post('/add', upload.single('image'), async (req, res) => {
    const { name, dob, gender, email, age, bloodgroup, height, weight, patientContact, emergencyContact, wardNumber, medicalHistory } = req.body;
    const imagePath = req.file ? req.file.path.replace('uploads/', '') : ''; // Store relative image path

    const newData = new Data({
        name,
        dob,
        gender,
        email,
        age,
        bloodgroup,
        height,
        weight,
        patientContact,
        emergencyContact,
        wardNumber,
        medicalHistory,
        imagePath
    });

    try {
        await newData.save();
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get data endpoint
app.get('/data', async (req, res) => {
    try {
        const { name, email } = req.query;
        const query = {};

        if (name) {
            query.name = name;
        }

        if (email) {
            query.email = email;
        }

        const allData = await Data.find(query);
        res.json(allData);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete data endpoint
app.delete('/delete/:id', async (req, res) => {
    try {
        const data = await Data.findById(req.params.id);
        if (!data) {
            return res.status(404).send('Data not found');
        }

        // Delete the image file if it exists
        if (data.imagePath) {
            fs.unlink(path.join(__dirname, 'uploads', data.imagePath), (err) => {
                if (err) console.error('Failed to delete image:', err);
            });
        }

        await Data.deleteOne({ _id: req.params.id });
        res.status(200).send('Data and image deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update data endpoint
app.put('/update/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, dob, gender, email, age, bloodgroup, height, weight, patientContact, emergencyContact, wardNumber, medicalHistory } = req.body;
        const imagePath = req.file ? req.file.path.replace('uploads/', '') : undefined;

        const data = await Data.findById(req.params.id);
        if (!data) {
            return res.status(404).send('Data not found');
        }

        // Delete old image file if a new image is uploaded
        if (imagePath && data.imagePath) {
            fs.unlink(path.join(__dirname, 'uploads', data.imagePath), (err) => {
                if (err) console.error('Failed to delete old image:', err);
            });
        }

        // Update data with new image path
        const updateData = {
            name,
            dob,
            gender,
            email,
            age,
            bloodgroup,
            height,
            weight,
            patientContact,
            emergencyContact,
            wardNumber,
            medicalHistory,
            ...(imagePath && { imagePath })
        };

        const result = await Data.updateOne(
            { _id: req.params.id },
            { $set: updateData }
        );

        if (result.nModified === 0) {
            return res.status(404).send('Data not found or no changes made');
        }
        res.status(200).send('Data updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'staff.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
