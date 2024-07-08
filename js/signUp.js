let passwordFilled = false;
let privacyPolicyAccepted = false;

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
    if (!document.getElementById('signUpPassword').value == '') {
        document.getElementById('passwordIcon').src = '../assets/img/visibility_off.svg';
        passwordFilled = true;
    }
    else if (document.getElementById('signUpPassword').value == '') {
        document.getElementById('passwordIcon').src = '../assets/img/lock.svg';
        passwordFilled = false;
    }
}

function toggleVisibilityIcon() {
    if (document.getElementById("signUpPassword").type === "password" && passwordFilled == true) {
        document.getElementById('passwordIcon').src = '../assets/img/visibility.svg';
        document.getElementById("signUpPassword").type = "text";
    }
    else if (document.getElementById("signUpPassword").type === "text" && passwordFilled == true) {
        document.getElementById('passwordIcon').src = '../assets/img/visibility_off.svg';
        document.getElementById("signUpPassword").type = "password";
    }
}

function signUp() {
    console.log('registriert Baby');
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

