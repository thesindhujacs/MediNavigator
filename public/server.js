const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 5000; // Changed to match frontend request

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/medinavigator", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

/* ================== PATIENT MODEL & ROUTES ================== */

// Define Patient Schema
const patientSchema = new mongoose.Schema({
    name: String,
    dob: String,
    gender: String,
    email: String,
    phone: String,
    age: Number,
    bloodgroup: String,
    height: Number,
    weight: Number,
    patientContact: String,
    emergencyContact: String,
    wardNumber: String,
    medicalHistory: String,
    imagePath: String, // Store image path
});

// Create Patient Model
const Patient = mongoose.model("Patient", patientSchema);

// Patient Sign-Up
app.post("/signup", async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const newPatient = new Patient({ name, email, phone });
        await newPatient.save();
        res.status(201).json({ message: "Signup successful!" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Add Patient with Image Upload
app.post("/add", upload.single("image"), async (req, res) => {
    const { name, dob, gender, email, phone, age, bloodgroup, height, weight, patientContact, emergencyContact, wardNumber, medicalHistory } = req.body;
    const imagePath = req.file ? req.file.path.replace("uploads/", "") : "";

    const newPatient = new Patient({
        name, dob, gender, email, phone, age, bloodgroup, height, weight, patientContact, emergencyContact, wardNumber, medicalHistory, imagePath
    });

    try {
        await newPatient.save();
        res.status(201).json({ message: "Patient added successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error adding patient" });
    }
});

// Get All Patients
app.get("/data", async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving patient data" });
    }
});

// Delete Patient
app.delete("/delete/:id", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        // Delete image file if exists
        if (patient.imagePath) {
            fs.unlink(path.join(__dirname, "uploads", patient.imagePath), err => {
                if (err) console.error("Failed to delete image:", err);
            });
        }

        await Patient.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting patient" });
    }
});

// Update Patient
app.put("/update/:id", upload.single("image"), async (req, res) => {
    try {
        const { name, dob, gender, email, phone, age, bloodgroup, height, weight, patientContact, emergencyContact, wardNumber, medicalHistory } = req.body;
        const imagePath = req.file ? req.file.path.replace("uploads/", "") : undefined;

        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        // Delete old image if new one is uploaded
        if (imagePath && patient.imagePath) {
            fs.unlink(path.join(__dirname, "uploads", patient.imagePath), err => {
                if (err) console.error("Failed to delete old image:", err);
            });
        }

        const updateData = {
            name, dob, gender, email, phone, age, bloodgroup, height, weight, patientContact, emergencyContact, wardNumber, medicalHistory,
            ...(imagePath && { imagePath }) // Update image path only if new image uploaded
        };

        await Patient.updateOne({ _id: req.params.id }, { $set: updateData });
        res.status(200).json({ message: "Patient updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating patient" });
    }
});

/* ================== APPOINTMENT MODEL & ROUTES ================== */

// Define Appointment Schema
const appointmentSchema = new mongoose.Schema({
    patientName: String,
    age: Number,
    dob: String,
    gender: String,
    occupation: String,
    doctorRequired: String,
    sicknessReason: String,
    phone: String,
    appointmentDate: String,
    appointmentTime: String
});

// Create Appointment Model
const Appointment = mongoose.model("Appointment", appointmentSchema);

// Book an Appointment
app.post("/api/appointments", async (req, res) => {
    try {
        const appointmentData = req.body;

        // Create and save the new appointment
        const newAppointment = new Appointment(appointmentData);
        await newAppointment.save();

        res.status(201).json({ message: "Appointment booked successfully!" });
    } catch (error) {
        console.error("Error saving appointment:", error);
        res.status(500).json({ message: "Server error while booking appointment" });
    }
});

// Get All Appointments
app.get("/api/appointments", async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving appointments" });
    }
});

/* ================== SERVER SETUP ================== */

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
