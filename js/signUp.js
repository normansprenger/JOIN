let passwordFilled = false;
let confirmPasswordFilled = false;
let privacyPolicyAccepted = false;
let users = [];
const BASE_URL = "https://remotestoragejoin-d0140-default-rtdb.europe-west1.firebasedatabase.app"


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





function validateEmail() {
    const emailElement = document.getElementById('email');
    const email = emailElement.value;
    const validations = [
        { condition: email.indexOf('@') < 1, message: 'Die E-Mail-Adresse muss ein @-Symbol enthalten.\n' },
        { condition: email.lastIndexOf('.') <= email.indexOf('@') + 1, message: 'Die E-Mail-Adresse muss einen Punkt (.) nach dem @-Symbol enthalten.\n' },
        { condition: email.lastIndexOf('.') === email.length - 1, message: 'Die E-Mail-Adresse darf nicht mit einem Punkt (.) enden.\n' },
        { condition: !/^[a-zA-Z0-9._%+-]+@/.test(email), message: 'Der lokale Teil der E-Mail-Adresse enthält ungültige Zeichen.\n' },
        { condition: !/[a-zA-Z]{2,}$/.test(email.split('.').pop()), message: 'Die Top-Level-Domain muss mindestens zwei Buchstaben lang sein.\n' }
    ];
    const errorMessage = validations.reduce((msg, val) => val.condition ? msg + val.message : msg, '');
    emailElement.setCustomValidity(errorMessage);
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

function signUp(event) {
    event.preventDefault()
    passwordsEqual = false;
    checkPasswords();
    console.log('REGISTRATION started');
    if (passwordsEqual == true) {
        let name = document.getElementById('signUpName').value;
        let email = document.getElementById('signUpEmail').value;
        let password = document.getElementById('signUpName').value;
        users.push({ "name": name, "email": email, "password": password })
    }
}

function checkPasswords() {
    if (document.getElementById('signUpPassword').value == document.getElementById('signUpConfirmPassword').value) {
        document.getElementById('inputContainerConfirmPassword').style.border = "1px solid #D1D1D1";
        document.getElementById('errorMessage').style.display = "none";
        return passwordsEqual = true;
    }
    else {
        document.getElementById('inputContainerConfirmPassword').style.border = "1px solid #FF8190";
        document.getElementById('errorMessage').style.display = "block";
    }
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

