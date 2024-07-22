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


function init() {
    loadUsers();
    loadContacts();
}


async function loadUsers(path = "/users") {
    let response = await fetch(BASE_URL + path + ".json");
    let reponseToJSON = await response.json();
    users = reponseToJSON;
};


async function loadContacts(path = "/contacts") {
    let response = await fetch(BASE_URL + path + ".json");
    let reponseToJSON = await response.json();
    contacts = reponseToJSON;
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


async function saveContacts(path = "/contacts") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(contacts)
    });
}


function changeCheckImg() {
    if (document.getElementById('checkedImg').style.display == 'none') {
        document.getElementById('checkImg').style.display = 'none';
        document.getElementById('checkedImg').style.display = 'block';
        privacyPolicyAccepted = true;
        enableDisableButton();
    } else {
        document.getElementById('checkImg').style.display = 'block';
        document.getElementById('checkedImg').style.display = 'none';
        privacyPolicyAccepted = false;
        enableDisableButton();
    }
}


function changePasswordIcon() {
    if (!document.getElementById('signUpPassword').value == '' && passwordFilled == false) {
        document.getElementById('passwordIcon').src = '../assets/img/visibility_off.svg';
        passwordFilled = true;
    }
    else if (document.getElementById('signUpPassword').value == '') {
        document.getElementById('passwordIcon').src = '../assets/img/lock.svg';
        document.getElementById("signUpPassword").type = "password";
        passwordFilled = false;
    }
}

function toggleVisibilityPasswordIcon() {
    if (document.getElementById("signUpPassword").type === "password" && passwordFilled == true) {
        document.getElementById('passwordIcon').src = '../assets/img/visibility.svg';
        document.getElementById("signUpPassword").type = "text";
    }
    else if (document.getElementById("signUpPassword").type === "text" && passwordFilled == true) {
        document.getElementById('passwordIcon').src = '../assets/img/visibility_off.svg';
        document.getElementById("signUpPassword").type = "password";
    }
}

function enableDisableButton() {
    if ((privacyPolicyAccepted)
        && (!document.getElementById('signUpName').value == '')
        && (!document.getElementById('signUpEmail').value == '')
        && (!document.getElementById('signUpPassword').value == '')
        && (!document.getElementById('signUpConfirmPassword').value == '')) { document.getElementById('signUpButton').disabled = false; }
    else { document.getElementById('signUpButton').disabled = true; }

}


function changeBordorColorName() {
    document.getElementById('inputContainerName').style.border = "1px solid #29ABE2";
}


function originalBorderColorName() {
    document.getElementById('inputContainerName').style.border = "1px solid #D1D1D1";
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


function changeBordorColorConfirmPassword() {
    document.getElementById('inputContainerConfirmPassword').style.border = "1px solid #29ABE2";
}


function originalBorderColorConfirmPassword() {
    document.getElementById('inputContainerConfirmPassword').style.border = "1px solid #D1D1D1";
}


async function signUp(event) {
    event.preventDefault();
    if (document.getElementById('signUpPassword').value == document.getElementById('signUpConfirmPassword').value) {
        document.getElementById('inputContainerConfirmPassword').style.border = "1px solid #D1D1D1";
        document.getElementById('errorMessage').style.display = "none";
        pushUser();
        pushContacts();
        await saveUsers();
        await saveContacts();
        clearInputs();
        signUpSuccess();
    }
    else {
        document.getElementById('inputContainerConfirmPassword').style.border = "1px solid #FF8190";
        document.getElementById('errorMessage').style.display = "block";
    }
}


function pushUser() {
    let name = document.getElementById('signUpName').value;
    let email = document.getElementById('signUpEmail').value;
    let password = document.getElementById('signUpPassword').value;
    let initials = getInitials(name);
    let color = randomColor(userColors);
    let id = new Date().getTime();
    let phone = '';
    let User = {
        'color': `${color}`,
        'email': `${email}`,
        'id': Number(id),
        'initials': `${initials}`,
        'name': `${name}`,
        'password': `${password}`,
        'phone': `${phone}`
    };
    users.push(User);
}


function pushContacts() {
    let name = document.getElementById('signUpName').value;
    let email = document.getElementById('signUpEmail').value;
    let initials = getInitials(name);
    let color = randomColor(userColors);
    let id = new Date().getTime();
    let phone = '';
    let contact = {
        'color': `${color}`,
        'email': `${email}`,
        'id': Number(id),
        'initials': `${initials}`,
        'name': `${name}`,
        'phone': `${phone}`
    };
    contacts.push(contact);
}


function getInitials(name) {
    // Trimmen des Namens und Aufteilen in Wörter
    let words = name.trim().split(/\s+/);

    // Wenn der Name nur aus einem Wort besteht, gebe die erste Initiale zurück
    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    }

    // Wenn der Name aus Vor- und Nachnamen besteht, gebe die Initialen zurück
    let initials = words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    return initials;
}


function randomColor(colors) {
    // Eine zufällige Zahl zwischen 0 und der Länge des Arrays (exklusiv) generieren
    const randomIndex = Math.floor(Math.random() * colors.length);
    // Den Wert an der zufälligen Position zurückgeben
    return colors[randomIndex];
}


function validateName() {
    var input = document.getElementById('signUpName');
    var name = input.value.trim();
    var nameParts = name.split(' ');

    if (nameParts.length >= 2 && nameParts[0].length > 0 && nameParts[1].length > 0) {
        input.setCustomValidity('');
    } else {
        input.setCustomValidity('Please enter your first name and last name.');
    }
}


function validateEmail() {
    var input = document.getElementById('signUpEmail');
    var email = input.value.trim();
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(email)) {
        input.setCustomValidity('');
    } else {
        input.setCustomValidity('Please enter a valid email address.');
    }
}


function validatePassword() {
    var input = document.getElementById('signUpPassword');
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
    document.getElementById('signUpName').value = '';
    document.getElementById('signUpEmail').value = '';
    document.getElementById('signUpPassword').value = '';
    document.getElementById('signUpConfirmPassword').value = '';
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