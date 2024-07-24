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
    startingAnimation();
    loadUsers();
    checkCurrentUser();
    enableDisableButton();
    changePasswordIcon();
    sessionStorage.clear();
    saveCurrentPage();
}

// lädt User aus der Datenbank
async function loadUsers(path = "/users") {
    let response = await fetch(BASE_URL + path + ".json");
    let reponseToJSON = await response.json();
    users = reponseToJSON;
};

// schaut im LocalStorage ob User vorhanden(RememberMe) und wenn da dann zur fillStoredUserInfos 
function checkCurrentUser() {
    let storedUserString = localStorage.getItem('currentUser');
    if (storedUserString) {
        currentUser = JSON.parse(storedUserString);
        fillStoredUserInfos();
    }
}


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

// changes the passwordiconimg and tells when password is filled
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

//toggles the visibility of the passwordtext and fitting img
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

//enable or disables the loginButton
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

//login function
function Login(event) {
    event.preventDefault();
    checkEmail();
}

// checks if the email is there in users if yes next function, if not then errormessage
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

//checks if Email and Passwort are there and matching, if not wrong password
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

// wenn remember me gewählt wurde wird der user im Local Storage und im Session Storage gespeichert, solange bis er sich ausloggt
// wenn remember me nicht ausgewählt wurde wird der user im session storage, gespeichert
function checkRememberMe() {
    if (rememberMe == true) {
        let currentUserAsString = JSON.stringify(currentUser);
        localStorage.setItem('currentUser', currentUserAsString);
        sessionStorage.setItem('currentUser', currentUserAsString);
    }
    else if (rememberMe == false) {
        let currentUserAsString = JSON.stringify(currentUser);
        sessionStorage.setItem('currentUser', currentUserAsString);
        localStorage.clear();
    }
    directToSummary();
}

//validates email 
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

//validates password 
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
    window.location.href = '../html/summary.html';
}


function guestLogin() {
    let currentUser = {
        "initials": "G",
        "name": "Guest"
    };
    let currentUserAsString = JSON.stringify(currentUser);
    sessionStorage.setItem('currentUser', currentUserAsString);
    localStorage.clear();
    directToSummary();
}

function saveCurrentPage() {
    const currentPage = window.location.pathname.split("/").pop();

    // Speichern des Seitennamens in sessionStorage
    sessionStorage.setItem("currentPage", currentPage);
}

function startingAnimation(){
    setTimeout(()=>{document.getElementById('startingImg').classList.add('startingImgEndPos')},500);
    setTimeout(()=>{document.getElementById('startingBackground').classList.add('dnone')},2100);
}