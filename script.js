
 let students = JSON.parse(localStorage.getItem('students')) || [];
 let editingIndex = -1;


 const themeToggle = document.getElementById('themeToggle');
 const html = document.documentElement;


 const savedTheme = localStorage.getItem('theme') || 'light';
 html.setAttribute('data-theme', savedTheme);
 themeToggle.checked = savedTheme === 'dark';


 themeToggle.addEventListener('change', () => {
     const newTheme = themeToggle.checked ? 'dark' : 'light';
     html.setAttribute('data-theme', newTheme);
     localStorage.setItem('theme', newTheme);
 });


 const form = document.getElementById('studentForm');
 const tableBody = document.getElementById('studentTableBody');
 const submitBtn = document.getElementById('submitBtn');

 
 const validators = {
     studentName: (value) => {
         const nameRegex = /^[a-zA-Z\s]{2,30}$/;
         return nameRegex.test(value) ? '' : 'Name should only contain letters and be 2-30 characters long';
     },
     studentId: (value) => {
         const idRegex = /^\d{1,10}$/;
         return idRegex.test(value) ? '' : 'ID should only contain numbers (max 10 digits)';
     },
     email: (value) => {
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         return emailRegex.test(value) ? '' : 'Please enter a valid email address';
     },
     contact: (value) => {
         const contactRegex = /^\d{10}$/;
         return contactRegex.test(value) ? '' : 'Contact should be exactly 10 digits';
     }
 };


 function validateForm() {
     let isValid = true;
     ['studentName', 'studentId', 'email', 'contact'].forEach(field => {
         const input = document.getElementById(field);
         const error = document.getElementById(`${field.replace('student', '').toLowerCase()}Error`);
         const validationMessage = validators[field](input.value);
         error.textContent = validationMessage;
         if (validationMessage) isValid = false;
     });
     return isValid;
 }

 
 function renderTable() {
     tableBody.innerHTML = students.map((student, index) => `
         <tr>
             <td>${student.name}</td>
             <td>${student.id}</td>
             <td>${student.email}</td>
             <td>${student.contact}</td>
             <td class="action-buttons">
                 <button class="edit-btn" onclick="editStudent(${index})">Edit</button>
                 <button class="delete-btn" onclick="deleteStudent(${index})">Delete</button>
             </td>
         </tr>
     `).join('');
 }


 function saveToStorage() {
     localStorage.setItem('students', JSON.stringify(students));
 }


 form.addEventListener('submit', (e) => {
     e.preventDefault();
     if (!validateForm()) return;

     const studentData = {
         name: document.getElementById('studentName').value,
         id: document.getElementById('studentId').value,
         email: document.getElementById('email').value,
         contact: document.getElementById('contact').value
     };

     if (editingIndex === -1) {
         students.push(studentData);
     } else {
         students[editingIndex] = studentData;
         editingIndex = -1;
         submitBtn.textContent = 'Add Student';
     }

     saveToStorage();
     renderTable();
     form.reset();
 });


 function editStudent(index) {
     const student = students[index];
     document.getElementById('studentName').value = student.name;
     document.getElementById('studentId').value = student.id;
     document.getElementById('email').value = student.email;
     document.getElementById('contact').value = student.contact;
     editingIndex = index;
     submitBtn.textContent = 'Update Student';
 }

 
 function deleteStudent(index) {
     if (confirm('Are you sure you want to delete this student?')) {
         students.splice(index, 1);
         saveToStorage();
         renderTable();
     }
 }


 renderTable();