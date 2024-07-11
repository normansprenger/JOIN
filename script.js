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
let currentUser = undefined;


function init() {
    loadUsers();
}


async function loadUsers(path = "/users") {
    let response = await fetch(BASE_URL + path + ".json");
    let reponseToJSON = await response.json();
    users = reponseToJSON;
};

async function saveUsers(path = "/users") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(users)
    });
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


function changeConfirmPasswordIcon() {
    if (!document.getElementById('signUpConfirmPassword').value == '' && confirmPasswordFilled == false) {
        document.getElementById('confirmPasswordIcon').src = '../assets/img/visibility_off.svg';
        confirmPasswordFilled = true;
    }
    else if (document.getElementById('signUpConfirmPassword').value == '') {
        document.getElementById('confirmPasswordIcon').src = '../assets/img/lock.svg';
        document.getElementById("signUpConfirmPassword").type = "password";
        confirmPasswordFilled = false;
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


function toggleVisibilityConfirmPasswordIcon() {
    if (document.getElementById("signUpConfirmPassword").type === "password" && confirmPasswordFilled == true) {
        document.getElementById('confirmPasswordIcon').src = '../assets/img/visibility.svg';
        document.getElementById("signUpConfirmPassword").type = "text";
    }
    else if (document.getElementById("signUpConfirmPassword").type === "text" && confirmPasswordFilled == true) {
        document.getElementById('confirmPasswordIcon').src = '../assets/img/visibility_off.svg';
        document.getElementById("signUpConfirmPassword").type = "password";
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

async function LogIn(event) {
    event.preventDefault();
    
}

function checkLogin() {
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    let emailsearch = users.find(user => user.email === email && user.password === password);
    if(!emailsearch){
        document.getElementById
    }
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


function clearInputs() {
    document.getElementById('loginName').value = '';
    document.getElementById('loginUpEmail').value = '';
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


function signUpSuccess() {
    document.getElementById('blackBackground').style.display = "flex";

    // Verzögere das Anzeigen der Erfolgsmeldung um 50ms, um sicherzustellen, dass der Hintergrund zuerst erscheint
    setTimeout(() => {
        document.getElementById('successMessage').classList.add("messageAfter");
    }, 100);

    // Verzögere das Weiterleiten zur Login-Seite um 2050ms (2000ms für die Animation + 100ms Verzögerung)
    setTimeout(directToLogin, 2100);
}


function directToLogin() {
    window.location.href = '../../index.html';
}