let rememberMe = false;
let passwordFilled = false;
let confirmPasswordFilled = false;
let privacyPolicyAccepted = false;
let users = [];
let contacts = [];
const BASE_URL = "https://remotestoragejoin-d0140-default-rtdb.europe-west1.firebasedatabase.app"
const userColors = [
    '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF',
    '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B',
];
let currentUser = [];

// lädt User und schaut ob user noch gespeichert ist
function init() {
    loadUsers();
    checkCurrentUser();
    enableDisableButton();
    changePasswordIcon();
    sessionStorage.clear();
}

// lädt User aus der Datenbank
async function loadUsers(path = "/users") {
    let response = await fetch(BASE_URL + path + ".json");
    let reponseToJSON = await response.json();
    users = reponseToJSON;
};

// schaut im LocalStorage ob User RememberMe gewählt hatte
function checkCurrentUser() {
    let storedUserString = localStorage.getItem('currentUser');
    if (storedUserString) {
        currentUser = JSON.parse(storedUserString);
        fillStoredUserInfos();
    }
}

// füllt die Eingabefelder mit Email und Passwort
function fillStoredUserInfos() {
    document.getElementById('loginEmail').value = currentUser['email'];
    document.getElementById('loginPassword').value = currentUser['password'];
    document.getElementById('rememberCheckedImg').style.display = 'block';
    document.getElementById('rememberImg').style.display = 'none';
    rememberMe = true;
}

function changeRememberImg() {
    if (document.getElementById('rememberImg').style.display == 'none') {
        document.getElementById('rememberCheckedImg').style.display = 'none';
        document.getElementById('rememberImg').style.display = 'block';
        rememberMe = false;
    } else {
        document.getElementById('rememberCheckedImg').style.display = 'block';
        document.getElementById('rememberImg').style.display = 'none';
        rememberMe = true;
    }
}


function changePasswordIcon() {
    if (!document.getElementById('loginPassword').value == '' && passwordFilled == false) {
        document.getElementById('passwordIcon').src = '../assets/img/visibility_off.svg';
        passwordFilled = true;
    }
    else if (document.getElementById('loginPassword').value == '') {
        document.getElementById('passwordIcon').src = '../assets/img/lock.svg';
        document.getElementById("loginPassword").type = "password";
        passwordFilled = false;
    }
}


function toggleVisibilityPasswordIcon() {
    if (document.getElementById("loginPassword").type === "password" && passwordFilled == true) {
        document.getElementById('passwordIcon').src = '../assets/img/visibility.svg';
        document.getElementById("loginPassword").type = "text";
    }
    else if (document.getElementById("loginPassword").type === "text" && passwordFilled == true) {
        document.getElementById('passwordIcon').src = '../assets/img/visibility_off.svg';
        document.getElementById("loginPassword").type = "password";
    }
}


function enableDisableButton() {
    if ((!document.getElementById('loginEmail').value == '') &&
        (!document.getElementById('loginPassword').value == '')) {
        document.getElementById('loginBtn').disabled = false;
    }
    else { document.getElementById('loginBtn').disabled = true; }
}


function changeBordorColorEmail() {
    document.getElementById('inputContainerEmail').style.border = "1px solid #29ABE2";
}


function originalBorderColorEmail() {
    document.getElementById('inputContainerEmail').style.border = "1px solid #D1D1D1";
}


function changeBordorColorPassword() {
    document.getElementById('inputContainerPassword').style.border = "1px solid #29ABE2";
}


function originalBorderColorPassword() {
    document.getElementById('inputContainerPassword').style.border = "1px solid #D1D1D1";
}

async function Login(event) {
    event.preventDefault();
    checkEmail();
}


function checkEmail() {
    let email = document.getElementById('loginEmail').value;
    let emailsearch = users.find(user => user.email === email);
    if (!emailsearch) {
        document.getElementById('wrongEmailMsg').classList.remove('dnone');
    }
    else if (emailsearch) {
        checkCombination();
    }
}

function checkCombination() {
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    let combinationSearch = users.find(user => user.email === email && user.password === password);
    if (!combinationSearch) {
        document.getElementById('wrongPasswordMsg').classList.remove('dnone');
        document.getElementById('wrongEmailMsg').classList.add('dnone');
    }
    else {
        currentUser = combinationSearch;
        checkRememberMe();
    }
}

// wenn remember me gewählt wurde wird der user im Local Storage gespeichert, solange bis er sich ausloggt
// wenn remember me nicht ausgewählt wurde wird der user im session storage, gespeichert
function checkRememberMe() {
    if (rememberMe == true) {
        let currentUserAsString = JSON.stringify(currentUser);
        localStorage.setItem('currentUser', currentUserAsString);
    }
    else if (rememberMe == false) {
        let currentUserAsString = JSON.stringify(currentUser);
        sessionStorage.setItem('currentUser', currentUserAsString);
        localStorage.clear();
    }
    directToSummary();
}


function validateEmail() {
    var input = document.getElementById('loginEmail');
    var email = input.value.trim();
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(email)) {
        input.setCustomValidity('');
    } else {
        input.setCustomValidity('Please enter a valid email address.');
    }
}


function validatePassword() {
    var input = document.getElementById('loginPassword');
    var password = input.value.trim();

    // Example password validation criteria:
    // - At least 4 characters long
    // - Contains at least one uppercase letter
    // - Contains at least one lowercase letter
    // - Contains at least one digit
    // - Contains at least one special character
    var passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;

    if (passwordPattern.test(password)) {
        input.setCustomValidity('');
    } else {
        input.setCustomValidity('The password must be at least 4 characters long and contain uppercase letters, lowercase letters, a number and a special character.');
    }
}

//leert die Eingabefelder
function clearInputs() {
    document.getElementById('loginName').value = '';
    document.getElementById('loginUpEmail').value = '';
}

//Weiterleitung zu Summary
function directToSummary() {
    window.location.href = '../html/legal_notice.html';
}

function resetUserDatabase() {
    users = [{
        "color": "#FF70AA",
        "email": "simon.matter@gmx.de",
        "id": 0,
        "initials": "SM",
        "name": "Simon Matter",
        "password": "Simon1!",
        "phone": "015204679261"
    },
    {
        "color": "#FFC700",
        "email": "normansprenger@gmail.com",
        "id": 1,
        "initials": "NS",
        "name": "Norman Sprenger",
        "password": "Test1!",
        "phone": "01779706478"
    }]
    saveUsers();
    window.alert('Database Users Reset')
}


function resetContactsDatabase() {
    contacts = [{
        "color": "#FF70AA",
        "email": "simon.matter@gmx.de",
        "id": 0,
        "initials": "SM",
        "name": "Simon Matter",
        "phone": "015204679261"
    },
    {
        "color": "#7AE229",
        "email": "linus.dubbler@yahoo.de",
        "id": 9,
        "initials": "LD",
        "name": "Linus Dubbler",
        "phone": "015245679261"
    },
    {
        "color": "#FFC700",
        "email": "normansprenger@gmail.com",
        "id": 1,
        "initials": "NS",
        "name": "Norman Sprenger",
        "phone": "01779706478"
    },
    {
        "color": "#FF3D00",
        "email": "jürg.meier@gmx.de",
        "id": 2,
        "initials": "JM",
        "name": "Jürg Meier",
        "phone": "01654860134"
    },
    {
        "color": "#0038FF",
        "email": "anna.bobic@jus.de",
        "id": 3,
        "initials": "AB",
        "name": "Anna Bobic",
        "phone": "03583165989"
    },
    {
        "color": "#7AE229",
        "email": "sarah.costa@tmobile.de",
        "id": 4,
        "initials": "SC",
        "name": "Sarah Costa",
        "phone": "01532165989"
    },
    {
        "color": "#9327FF",
        "email": "melanie.kuster@dmx.de",
        "id": 5,
        "initials": "MK",
        "name": "Melanie Kuster",
        "phone": "01776934444"
    },
    {
        "color": "#1FD7C1",
        "email": "michele.hummels@gmx.de",
        "id": 6,
        "initials": "MH",
        "name": "Michele Hummels",
        "phone": "01446935335"
    },
    {
        "color": "#FF001F",
        "email": "mike.conzelmann@hispeed.ch",
        "id": 7,
        "initials": "MC",
        "name": "Mike Conzelmann",
        "phone": "01446935467"
    },
    {
        "color": "#FF70AA",
        "email": "andrin.kostic@gmail.com",
        "id": 8,
        "initials": "AK",
        "name": "Andrin Kostic",
        "phone": "01446935555"
    }]
    saveContacts();
    window.alert('Database Contacts Reset')
}