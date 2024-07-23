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

// Min DayDate //

function setEditDueDateMinDate() {
    let today = new Date();

    let yyyy = today.getFullYear();
    let mm = String(today.getMonth() + 1).padStart(2, '0'); 
    let dd = String(today.getDate()).padStart(2, '0');
    let formattedDate = yyyy + '-' + mm + '-' + dd;

    document.getElementById('editDueDate').setAttribute('min', formattedDate);
}

function renderChoosingList(taskId) {
    document.getElementById('choosingList').innerHTML = ``;
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let color = contact['color'].replace("#", "C");
        document.getElementById('choosingList').innerHTML += /*html*/`
        <div class="choosingListRow" onclick="toggleAssigned(${contact['id']})" id="choosingListRow${contact['id']}">
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

    if (contactIndex === -1) { 
        document.getElementById(`choosingListCheckImg${contactId}`).classList.remove('completedFalse');
        document.getElementById(`choosingListCheckImg${contactId}`).classList.add('completedTrue');
        newTask['assignedTo'].push(Number(contactId));
    } else { 
        document.getElementById(`choosingListCheckImg${contactId}`).classList.remove('completedTrue');
        document.getElementById(`choosingListCheckImg${contactId}`).classList.add('completedFalse');
        newTask['assignedTo'].splice(contactIndex, 1);
    }
}

function editFilterNames() {
    let search = document.getElementById('contactsDropDown').value.toLowerCase();
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i]['name'].toLowerCase().includes(search)) {
            document.getElementById(`choosingListRow${contacts[i]['id']}`).style = "display: flex"
        } else {
            document.getElementById(`choosingListRow${contacts[i]['id']}`).style = "display: none"
        }
    }
}

// Subtasks //

function addSubTask(taskId) {
    let task = tasks.find(task => task.id === taskId);
    let subTaskTitle = document.getElementById('editSubTasks').value;
    let id = new Date().getTime();
    let newSubTask = {
        completet: false,
        content: subTaskTitle,
        id: Number(id),
    };
    if (!task.subTasks) {
        task.subTasks = [];
    }
    task.subTasks.push(newSubTask);
    document.getElementById('editSubTasks').value = '';
    let taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = task;
    }
    renderSubtasksEdit(taskId);
}

function renderSubtasksEdit(taskId) {
    let task = tasks.find(task => task.id === taskId);
    document.getElementById('editSubtasksList').innerHTML = ``;
    if (task['subTasks']) {
        for (let i = 0; i < task['subTasks'].length; i++) {
            let singleSubtask = task['subTasks'][i];
            document.getElementById('editSubtasksList').innerHTML +=/*html*/`
            <div class="subTaskEditRow" id="subTaskEditRow${singleSubtask['id']}">
                <div class="subTaskEditName" id="subTaskName${singleSubtask['id']}">&#10625 ${singleSubtask['content']}</div>
                <div class="subTaskEditRowRight">
                    <img class="editSubTaskEditImg" src="../assets/img/edit.svg" alt="" onclick="editEditSubTask(${task['id']},${singleSubtask['id']})">
                    <div class="editSubTaskSeparator"></div>
                    <img class="editSubTaskDeleteImg" src="../assets/img/delete.svg" alt="" onclick="deleteEditSubTask(${task['id']},${singleSubtask['id']})">
                </div>
            </div>
            `;
        }
    }
}

function deleteEditSubTask(taskId, subTaskId) {
    // Find the task with the given taskId
    let task = tasks.find(task => task.id === taskId);

    if (task) {
        // Find the index of the subtask with the given subTaskId
        let subTaskIndex = task.subTasks.findIndex(subTask => subTask.id === subTaskId);

        // If the subtask exists, remove it
        if (subTaskIndex !== -1) {
            task.subTasks.splice(subTaskIndex, 1);
        } else {
            console.log(`Subtask with id ${subTaskId} not found.`);
        }
    } else {
        console.log(`Task with id ${taskId} not found.`);
    };
    renderSubtasksEdit(taskId);
}

function editEditSubTask(taskId, subTaskId) {
    let preloadedValue = document.getElementById(`subTaskName${subTaskId}`).innerHTML;
    document.getElementById(`subTaskEditRow${subTaskId}`).innerHTML =/*html*/`
        <div class="editSubTaskInputContainer">
            <input class="editSubTaskEditInput" id="editSubTaskInput${subTaskId}" type="text" minlength="5" maxlength="25" placeholder="Rename subtask">
            <div class="subTaskEditEditRowRight">
                <img class="editSubTaskEditImg" src="../assets/img/delete.svg" alt="" onclick="deleteEditSubTask(${taskId},${subTaskId})">
                <div class="editSubTaskSeparator"></div>
                <img class="editSubTaskEditImg" src="../assets/img/checkEditTaskBright.svg" alt="" onclick="changeEditSubTaskContent(${taskId},${subTaskId})">
            </div>
        </div>
    `;
    document.getElementById(`editSubTaskInput${subTaskId}`).value = preloadedValue.substring(2);
}

function changeEditSubTaskContent(taskId, subTaskId) {
    // Find the task with the given taskId
    let task = tasks.find(task => task.id === taskId);

    if (task) {
        // Find the subtask with the given subTaskId
        let subTask = task.subTasks.find(subTask => subTask.id === subTaskId);

        if (subTask) {
            // Get the new content from the input field
            let newContent = document.getElementById(`editSubTaskInput${subTaskId}`).value;

            // Update the subtask content
            subTask.content = newContent;
        } else {
            console.log(`Subtask with id ${subTaskId} not found.`);
        }
    } else {
        console.log(`Task with id ${taskId} not found.`);
    }
    renderSubtasksEdit(taskId);
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