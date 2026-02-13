document.getElementById('dataForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('nameInput').value);
    formData.append('dob', document.getElementById('dobInput').value);
    formData.append('gender', document.getElementById('genderInput').value);
    formData.append('email', document.getElementById('emailInput').value);
    formData.append('age', document.getElementById('ageInput').value);
    formData.append('bloodgroup', document.getElementById('bloodgroupInput').value);
    formData.append('height', document.getElementById('heightInput').value);
    formData.append('weight', document.getElementById('weightInput').value);
    formData.append('patientContact', document.getElementById('patientContactInput').value);
    formData.append('emergencyContact', document.getElementById('emergencyContactInput').value);
    formData.append('wardNumber', document.getElementById('wardNumberInput').value);
    formData.append('medicalHistory', document.getElementById('medicalHistoryInput').value);
    formData.append('image', document.getElementById('imageInput').files[0]);

    // Clear inputs
    document.getElementById('nameInput').value = '';
    document.getElementById('dobInput').value = '';
    document.getElementById('genderInput').value = '';
    document.getElementById('emailInput').value = '';
    document.getElementById('ageInput').value = '';
    document.getElementById('bloodgroupInput').value = '';
    document.getElementById('heightInput').value = '';
    document.getElementById('weightInput').value = '';
    document.getElementById('patientContactInput').value = '';
    document.getElementById('emergencyContactInput').value = '';
    document.getElementById('wardNumberInput').value = '';
    document.getElementById('medicalHistoryInput').value = '';
    document.getElementById('imageInput').value = '';

     // Send data to the server
     fetch('http://localhost:3000/add', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            alert('Patient data added successfully!');
            // Optionally, refresh the form or reload data
            loadData();  // Refresh the data list
        } else {
            alert('Failed to add patient data.');
        }
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });

    // Refresh the data list
    loadData();
});

async function loadData() {
    const response = await fetch('http://localhost:3000/data');
    const dataList = await response.json();
    const dataListElement = document.getElementById('dataList');
    dataListElement.innerHTML = '';
    dataList.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `Name: ${item.name}, DOB: ${item.dob}, Gender: ${item.gender}, Email: ${item.email}, Age: ${item.age}, Blood Group: ${item.bloodgroup}, Height (cm): ${item.height}, Weight (kg): ${item.weight}, Patient Contact Number: ${item.patientContact}, Emergency Contact Number: ${item.emergencyContact}, Ward Number: ${item.wardNumber}, Medical History: ${item.medicalHistory}`;

        // Optionally display image preview
        if (item.imagePath) {
            const img = document.createElement('img');
            img.src = `http://localhost:3000/${item.imagePath}`;
            img.style.width = '100px'; // Adjust size as needed
            img.style.height = '100px'; // Adjust size as needed
            li.appendChild(img);
        }

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteData(item._id));

        // Create update button
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => showUpdateForm(item));

        li.appendChild(deleteButton);
        li.appendChild(updateButton);
        dataListElement.appendChild(li);
    });
}

async function deleteData(id) {
    const response = await fetch(`http://localhost:3000/delete/${id}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        alert('Data deleted successfully');
        loadData(); // Refresh the data list
    } else {
        alert('Failed to delete data');
    }
}

function showUpdateForm(item) {
    document.getElementById('updateForm').style.display = 'block';
    document.getElementById('updateId').value = item._id;
    document.getElementById('updateName').value = item.name;
    document.getElementById('updateDOB').value = item.dob;
    document.getElementById('updateGender').value = item.gender;
    document.getElementById('updateEmail').value = item.email;
    document.getElementById('updateAge').value = item.age;
    document.getElementById('updateBloodGroup').value = item.bloodgroup;
    document.getElementById('updateHeight').value = item.height;
    document.getElementById('updateWeight').value = item.weight;
    document.getElementById('updatePatientContact').value = item.patientContact;
    document.getElementById('updateEmergencyContact').value = item.emergencyContact;
    document.getElementById('updateWardNumber').value = item.wardNumber;
    document.getElementById('updateMedicalHistory').value = item.medicalHistory;
    // Optional: clear previous image
    document.getElementById('updateImage').value = '';
}

document.getElementById('updateForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('updateId').value;
    const formData = new FormData();
    formData.append('name', document.getElementById('updateName').value);
    formData.append('dob', document.getElementById('updateDOB').value);
    formData.append('gender', document.getElementById('updateGender').value);
    formData.append('email', document.getElementById('updateEmail').value);
    formData.append('age', document.getElementById('updateAge').value);
    formData.append('bloodgroup', document.getElementById('updateBloodGroup').value);
    formData.append('height', document.getElementById('updateHeight').value);
    formData.append('weight', document.getElementById('updateWeight').value);
    formData.append('patientContact', document.getElementById('updatePatientContact').value);
    formData.append('emergencyContact', document.getElementById('updateEmergencyContact').value);
    formData.append('wardNumber', document.getElementById('updateWardNumber').value);
    formData.append('medicalHistory', document.getElementById('updateMedicalHistory').value);
    formData.append('image', document.getElementById('updateImage').files[0]);

    // Send update request to the server
    await fetch(`http://localhost:3000/update/${id}`, {
        method: 'PUT',
        body: formData,
    });

    // Hide the update form and refresh the data list
    document.getElementById('updateForm').style.display = 'none';
    loadData();
});

document.getElementById('searchForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const response = await fetch(`/data?name=${name}&email=${email}`);
    const data = await response.json();
    const resultsDiv = document.getElementById('results');

    resultsDiv.innerHTML = '';

    if (data.length === 0) {
        resultsDiv.innerHTML = '<p>No data found</p>';
    } else {
        data.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <p>Name: ${item.name}</p>
                <p>DOB: ${item.dob}</p>
                <p>Gender: ${item.gender}</p>
                <p>Email: ${item.email}</p>
                <p>Age: ${item.age}</p>
                <p>Blood Group: ${item.bloodgroup}</p>
                <p>Height (cm): ${item.height}<p>
                <p>Weight (kg): ${item.weight}</p>
                <p>Patient Contact Number: ${item.patientContact}</p>
                <p>Emergency Contact Number: ${item.emergencyContact}</p>
                <p>Ward Number: ${item.wardNumber}</p>
                <p>Medical History: ${item.medicalHistory}</p>
                <p><img src="${item.imagePath}" alt="Image" width="100"></p>
            `;
            resultsDiv.appendChild(itemDiv);
        });
    }
});

// Initial load of data
loadData();
