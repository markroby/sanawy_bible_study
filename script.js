document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('studentForm');
    const pointsForm = document.getElementById('pointsForm');
    const resetPointsBtn = document.getElementById('resetPoints');
    const scoreTableBody = document.querySelector('#scoreTable tbody');
    const scoreChart = document.getElementById('scoreChart');

    form?.addEventListener('submit', addStudent);
    pointsForm?.addEventListener('submit', updatePoints);
    resetPointsBtn?.addEventListener('click', resetPoints);

    function addStudent(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        if (name) { // Ensure the name is not empty
            const student = { name, attendance: 0, bibleChurch: 0, bible: 0, task: 0, friend: 0, contest: 0, quiz: 0, total: 0 };
            saveStudentData(student);
            form.reset();
            populateStudentSelect(); // Update the student select options
        } else {
            alert('Please enter a valid student name.');
        }
    }

    function saveStudentData(student) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
    }

    function loadStudentData() {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        // Filter out any invalid or incomplete student entries
        students = students.filter(student => student && student.name);
        return students;
    }

    function updatePoints(e) {
        e.preventDefault();
        const studentSelect = document.getElementById('studentSelect');
        const studentName = studentSelect.value;

        let students = loadStudentData();
        let student = students.find(s => s.name === studentName);

        if (student) {
            student.attendance += document.getElementById('attendance').checked ? 1 : 0;
            student.bibleChurch += document.getElementById('bibleChurch').checked ? 1 : 0;
            student.bible += document.getElementById('bible').checked ? 3 : 0;
            student.task += document.getElementById('task').checked ? 5 : 0;
            student.friend += document.getElementById('friend').checked ? 2 : 0;
            student.contest += document.getElementById('contest').checked ? 150 : 0;
            student.quiz += document.getElementById('quiz').checked ? 120 : 0;

            student.total = student.attendance + student.bibleChurch + student.bible + student.task + student.friend + student.contest + student.quiz;

            saveAllStudentData(students);
            pointsForm.reset();
            renderTable(); // Re-render the table to update the changes
        } else {
            console.error('Student not found!');
        }
    }

    function saveAllStudentData(students) {
        localStorage.setItem('students', JSON.stringify(students));
    }

    function populateStudentSelect() {
        const studentSelect = document.getElementById('studentSelect');
        const students = loadStudentData();

        studentSelect.innerHTML = '';
        students.forEach(student => {
            if (student && student.name) { // Ensure student object is valid and has a name
                const option = document.createElement('option');
                option.value = student.name;
                option.innerText = student.name;
                studentSelect.appendChild(option);
            }
        });
    }

    function renderTable() {
        const students = loadStudentData();
        scoreTableBody.innerHTML = '';

        // Sort students by total score in descending order
        students.sort((a, b) => b.total - a.total);

        students.forEach((student, index) => {
            if (student && student.name) { // Ensure student object is valid and has a name
                const row = scoreTableBody.insertRow();
                row.insertCell(0).innerText = student.name;
                row.insertCell(1).innerText = student.attendance;
                row.insertCell(2).innerText = student.bibleChurch;
                row.insertCell(3).innerText = student.bible;
                row.insertCell(4).innerText = student.task;
                row.insertCell(5).innerText = student.friend;
                row.insertCell(6).innerText = student.contest;
                row.insertCell(7).innerText = student.quiz;
                row.insertCell(8).innerText = student.total;
                row.insertCell(9).innerText = index + 1; // Correctly set the rank based on the sorted order
            }
        });
    }

    function renderChart() {
        const students = loadStudentData();
        const names = students.filter(student => student && student.name).map(student => student.name);
        const totals = students.filter(student => student && student.name).map(student => student.total);

        new Chart(scoreChart, {
            type: 'bar',
            data: {
                labels: names,
                datasets: [{
                    label: 'Total Score',
                    data: totals,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function resetPoints() {
        const studentSelect = document.getElementById('studentSelect');
        const studentName = studentSelect.value;

        let students = loadStudentData();
        let student = students.find(s => s.name === studentName);

        if (student) {
            student.attendance = 0;
            student.bibleChurch = 0;
            student.bible = 0;
            student.task = 0;
            student.friend = 0;
            student.contest = 0;
            student.quiz = 0;
            student.total = 0;

            saveAllStudentData(students);
            pointsForm.reset();
            renderTable(); // Re-render the table to update the changes
        } else {
            console.error('Student not found!');
        }
    }

    if (window.location.pathname.endsWith('ranking-display.html')) {
        renderTable();
        renderChart();
    }

    if (window.location.pathname.endsWith('points-update.html')) {
        populateStudentSelect();
    }

    // Update winner chart
    let students = loadStudentData();
    // Sort students by total score in descending order before displaying the top 3
    students.sort((a, b) => b.total - a.total);

    if (students.length >= 3) {
        document.getElementById('first-place').textContent = students[0].name;
        document.getElementById('second-place').textContent = students[1].name;
        document.getElementById('third-place').textContent = students[2].name;
    }
});
