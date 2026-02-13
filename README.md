## 🏥 MediNavigator – Healthcare Management System

MediNavigator is a full-stack web-based healthcare management system designed to streamline patient registration, appointment scheduling, and secure medical record management.

Developed using **Node.js, MongoDB, HTML, CSS, and JavaScript**, the system provides role-based access control for Staff, Doctors, and Patients.

---

## 🚀 Features

* 🔐 Secure role-based authentication (Staff / Doctor / Patient)
* 📝 Patient registration (staff-assisted and self-registration)
* 📅 Appointment booking system
* 📂 Medical record storage and retrieval
* 🔎 Real-time patient data search functionality
* 🛡️ MongoDB-backed secure database

---

## 🏗️ Tech Stack

**Frontend**

* HTML
* CSS
* JavaScript

**Backend**

* Node.js

**Database**

* MongoDB

---

## 👥 User Roles

### 👨‍⚕️ Doctor

* View patient history
* Update medical records
* Manage diagnoses and prescriptions

### 🧑‍💼 Staff

* Register patients
* Maintain medical records
* Administrative control

### 🧑 Patient

* Self-register
* Book appointments
* View medical history

---

## 🗂️ Project Structure

```
MediNavigator/
│
├── public/
├── server.js
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/medinavigator.git
cd medinavigator
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file:

```
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

### 4️⃣ Run the Application

```bash
node server.js
```

---

## 🔒 Security Measures

* Role-Based Access Control (RBAC)
* Encrypted data storage
* Secure authentication system
* Controlled record modification

---

## 📌 Future Enhancements

* Real-time notifications
* Advanced analytics dashboard
* JWT authentication
* Deployment to cloud (Render / AWS)

---

## 📄 License

This project is licensed under the MIT License.

---

 project now 🚀
