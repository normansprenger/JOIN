let passwordFilled = false;
let confirmPasswordFilled = false;
let privacyPolicyAccepted = false;
const userColors = [
    '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF',
    '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B',
];
let users = [];
const BASE_URL = "https://remotestoragejoin-d0140-default-rtdb.europe-west1.firebasedatabase.app"


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
    if (document.getElementById("signUpPassword").type === "password" && passwordFilled == true) {
        document.getElementById('passwordIcon').src = '../assets/img/visibility.svg';
        document.getElementById("signUpPassword").type = "text";
    }
    else if (document.getElementById("signUpPassword").type === "text" && passwordFilled == true) {
        document.getElementById('passwordIcon').src = '../assets/img/visibility_off.svg';
        document.getElementById("signUpPassword").type = "password";
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
        await saveUsers();
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
        'id': `${id}`,
        'initials': `${initials}`,
        'name': `${name}`,
        'password': `${password}`,
        'phone': `${phone}`
    };
    users.push(User);
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
        input.setCustomValidity('Bitte geben Sie Vorname und Nachname ein.');
    }
}

function validateEmail() {
    var input = document.getElementById('signUpEmail');
    var email = input.value.trim();
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(email)) {
        input.setCustomValidity('');
    } else {
        input.setCustomValidity('Bitte geben Sie eine gültige Email-Adresse ein.');
    }
}

function validatePassword() {
    var input = document.getElementById('signUpPassword');
    var password = input.value.trim();

    // Example password validation criteria:
    // - At least 8 characters long
    // - Contains at least one uppercase letter
    // - Contains at least one lowercase letter
    // - Contains at least one digit
    // - Contains at least one special character
    var passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;

    if (passwordPattern.test(password)) {
        input.setCustomValidity('');
    } else {
        input.setCustomValidity('Das Passwort muss mindestens 4 Zeichen lang sein und Großbuchstaben, Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten.');
    }
}

function clearInputs() {
    document.getElementById('signUpName').value = '';
    document.getElementById('signUpEmail').value = '';
    document.getElementById('signUpPassword').value = '';
    document.getElementById('signUpConfirmPassword').value = '';
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
    window.alert('Datenbank zurückgesetzt')
}

function signUpSuccess() {
    // Display the background
    document.getElementById('blackBackground').style.display = "flex";
    // Trigger the transition by changing the class
    const message = document.getElementById('successMessage');
    message.classList.remove("messageBefore");
    message.classList.add("messageAfter");
    // Redirect to login after 2000ms
    setTimeout(directToLogin, 2000);
}

function directToLogin() {
    window.location.href = '../../index.html';
}