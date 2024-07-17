let currentUser = []; // der Nutzer der momentan angemeldet ist -> wird aus dem SessionStorage geladen
let currentPage = ''; // hier wird die URL gespeichert welche verwendet wurde bevor man auf HELP LEGAL NOTICE oder PRIVACY POLICY geht damit man von dort aus zu der Seite zurückkehren kann.

let users = [];
let contacts = [];
let tasks = [];

const BASE_URL = 'https://remotestoragejoin-d0140-default-rtdb.europe-west1.firebasedatabase.app/';

async function loadUsers(path = "/users") {
    let response = await fetch(BASE_URL + path + ".json");
    let reponseToJSON = await response.json();
    users = reponseToJSON;
};

async function loadContacts(path = "/contacts") {
    let response = await fetch(BASE_URL + path + ".json");
    let reponseToJSON = await response.json();
    contacts = reponseToJSON;
    return contacts;
};

async function loadTasks(path = "/tasks") {
    let response = await fetch(BASE_URL + path + ".json");
    let reponseToJSON = await response.json();
    tasks = reponseToJSON;
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

async function saveTasks(path = "/tasks") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tasks)
    });
}

//schaut in den sessionstorage und holt den currentuser, falls keiner vorhanden dann gehe zur Login
function checkUser() {
    let storedUserString = sessionStorage.getItem('currentUser');
    if (storedUserString) {
        currentUser = JSON.parse(storedUserString);
    }
    else {
        window.location.href = '../index.html';
    }
}

function fillUserInitials() {
    document.getElementById('headerContainerRightUserIconInitials').innerHTML = currentUser['initials'];
}

// leert beide Speicher und kehrt zurück zu Login
function logout() {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '../../index.html';
}

function saveCurrentPage() {
    const currentPage = window.location.pathname.split("/").pop();

    // Speichern des Seitennamens in sessionStorage
    sessionStorage.setItem("currentPage", currentPage);
}

