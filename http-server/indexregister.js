function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function checkValidity(dob, email) {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    const age = calculateAge(dob);
    
    if (age < 18 || age > 55) {
        alert('Your age must be between 18 and 55 to register.');
        return false;
    }

    return true;
}

const retrieveEntries = () => {
    let entries = localStorage.getItem("userLocalEntries");
    if (entries) {
        entries = JSON.parse(entries);
    } else {
        entries = [];
    }
    return entries;
}

const displayEntries = () => {
    const entries = retrieveEntries();
    const validEntries = entries.filter((entry) => {
        const age = calculateAge(entry.dob);
        return age >= 18 && age <= 55;
    });
    
    const tableEntries = validEntries.map((entry) => {
        const nameCell = `<td class='border px-4 py-2'>${entry.name}</td>`;
        const emailCell = `<td class='border px-4 py-2'>${entry.email}</td>`;
        const passwordCell = `<td class='border px-4 py-2'>${entry.password}</td>`;
        const dobCell = `<td class='border px-4 py-2'>${entry.dob}</td>`;
        const acceptTermsCell = `<td class='border px-4 py-2'>${entry.acceptedTermsAndconditions ? 'true' : 'false'}</td>`;
        const row = `<tr>${nameCell} ${emailCell} ${passwordCell} ${dobCell} ${acceptTermsCell}</tr>`;
        return row;
    }).join("\n");

    const table = `
    <table class="table-auto w-full">
        <tr>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Email</th>
            <th class="px-4 py-2">Password</th>
            <th class="px-4 py-2">Dob</th>
            <th class="px-4 py-2">Accepted terms?</th>
        </tr>
        ${tableEntries || ""}
    </table>`;

    document.getElementById("userEntries").innerHTML = table;
}

const saveUserForm = (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const dob = document.getElementById("dob").value;
    const acceptedTermsAndconditions = document.getElementById("acceptTerms").checked;

    if (!checkValidity(dob, email)) {
        return; 
    }
    
    const entry = {
        name,
        email,
        password,
        dob,
        acceptedTermsAndconditions
    };
    
    let userEntries = retrieveEntries();
    userEntries.push(entry);
    localStorage.setItem("userLocalEntries", JSON.stringify(userEntries)); 
    displayEntries();
}

document.getElementById('user-form').addEventListener("submit", saveUserForm);

displayEntries();