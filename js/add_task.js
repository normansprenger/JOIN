let assignetTo = document.getElementById("assignedTo");
let category = document.getElementById("category");
let priority;
let subArray = [];
let assignedContacts = [];
let newTaskId;
let newTask = {
    "assignedTo": [],
    "category": "",
    "description": "",
    "dueDate": "",
    "id": undefined,
    "priority": "",
    "status": "",
    "subTasks": [],
    "title": ""
  };


async function initAddTask() {
    includeHTML();
    await loadTasks();
    await loadContacts();
    ButtonMediumInOrange();
    newTaskId = new Date().getTime();
    newTask['id'] = Number(newTaskId);
    renderChoosingList(newTaskId);
    setEditDueDateMinDate();
}

// Prio Button Color function //

function addPrioButtonColor(prio, event) {
    event.preventDefault();
    let buttonUrgent = document.getElementById("buttonUrgent");
    let buttonMedium = document.getElementById("buttonMedium");
    let buttonLow = document.getElementById("buttonLow");
    let imgUrgent = document.getElementById("buttonImg1");
    let imgMedium = document.getElementById("buttonImg2");
    let imgLow = document.getElementById("buttonImg3");
    removeClasses(buttonUrgent, buttonMedium, buttonLow, imgUrgent, imgMedium, imgLow);
    if (prio === "urgent") {
        selectedButtonColor(buttonUrgent, imgUrgent, "backgroundColorRed", "urgent");
        newTask['priority'] = "urgent";
    } else if (prio === "medium") {
        selectedButtonColor(buttonMedium, imgMedium, "backgroundColorOrange", "medium");
        newTask['priority'] = "medium";
    } else if (prio === "low") {
        selectedButtonColor(buttonLow, imgLow, "backgroundColorGreen", "low");
        newTask['priority'] = "low";
    }
}

function removeClasses(buttonUrgent, buttonMedium, buttonLow, imgUrgent, imgMedium, imgLow) {
    buttonUrgent.classList.remove("backgroundColorRed", "buttonPrioWhite");
    buttonMedium.classList.remove("backgroundColorOrange", "buttonPrioWhite");
    buttonLow.classList.remove("backgroundColorGreen", "buttonPrioWhite");
    imgUrgent.src = "../assets/img/addTaskUrgentLogo.svg";
    imgMedium.src = "../assets/img/addTaskMediumLogo.svg";
    imgLow.src = "../assets/img/addTaskLowLogo.svg";
}

function selectedButtonColor(button, img, colorClass, priority) {
    button.classList.add(colorClass, "buttonPrioWhite");
    img.src = `../assets/img/addTask${capitalizeFirstLetter(priority)}LogoWhite.svg`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function ButtonMediumInOrange() {
    let buttonMedium = document.getElementById("buttonMedium");
    let imgMedium = document.getElementById("buttonImg2");
    buttonMedium.classList.add("backgroundColorOrange", "buttonPrioWhite");
    imgMedium.src = "../assets/img/addTaskMediumLogoWhite.svg";
    newTask['priority'] = "medium";
}

// Kalender min = Tagesdatum //

function setEditDueDateMinDate() {
    // Get today's date
    let today = new Date();

    // Format the date to YYYY-MM-DD
    let yyyy = today.getFullYear();
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    let dd = String(today.getDate()).padStart(2, '0');
    let formattedDate = yyyy + '-' + mm + '-' + dd;

    // Set the min attribute of the date input
    document.getElementById('editDueDate').setAttribute('min', formattedDate);
}

function renderChoosingList(taskId) {
    document.getElementById('choosingList').innerHTML = ``;
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let color = contact['color'].replace("#", "C");
        document.getElementById('choosingList').innerHTML += /*html*/`
        <div class="choosingListRow" onclick="toggleAssigned(${contact['id']}), event.stopPropagation()" id="choosingListRow${contact['id']}">
            <div class="choosingListLeft">
                <div class="choosingListUserIcon ${color}">
                    <div class="choosingListUserInitials">${contact['initials']}</div>
                </div>
                <div>${contact['name']}</div>
            </div>
            <div class="choosingListCheck completedFalse" id="choosingListCheckImg${contact['id']}"></div>
        </div>
        `;
    }
}

function toggleShowChoosingList() {
    let list = document.getElementById('choosingList');
    if (list.classList.contains('dnone')) {
        list.classList.remove('dnone');
        document.getElementById('openCloseChoosingListImg').classList.add('rotate180');
    } else {
        list.classList.add('dnone');
        document.getElementById('openCloseChoosingListImg').classList.remove('rotate180');
    }
}

function toggleAssigned(contactId) {
    const contactIndex = newTask['assignedTo'].indexOf(Number(contactId));

    if (contactIndex === -1) { // contactId is not in the array
        document.getElementById(`choosingListCheckImg${contactId}`).classList.remove('completedFalse');
        document.getElementById(`choosingListCheckImg${contactId}`).classList.add('completedTrue');
        newTask['assignedTo'].push(Number(contactId));
    } else { // contactId is in the array
        document.getElementById(`choosingListCheckImg${contactId}`).classList.remove('completedTrue');
        document.getElementById(`choosingListCheckImg${contactId}`).classList.add('completedFalse');
        newTask['assignedTo'].splice(contactIndex, 1);
    }
}

//form onsubmit="createTask()"
//(div input input select textarea)
// der Create taskbutton bekommt keine funktion der bekommt nur den type="submit" aber muss im formular drin sind



//createTask(){
//werte aus inputfeldern mit .value in das newTask
//newTask gepusht in das tasks
//saveTasks() zurück in Firebase
//dialog animation
//anschließend weiterleiten zu boardseite
//fertig
//}

//in die Init checkuser und fillinitisls einfügen (wie immer)