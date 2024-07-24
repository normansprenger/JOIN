let filteredTasks = [];
let InProgress = [];
let currentDragElement = [];
let chosenPriority;


async function init() {
    await includeHTML();
    await loadTasks();
    await loadContacts();
    checkUser();
    fillUserInitials();
    renderTasksBoard();
}

function addTask(){
    window.location.href = '/html/add_task.html';
}

function changeCategoryColor(taskId, category) {
    let color = '';
    if (category === "User Story") {
        color = 'userStoryColor'
    }
    else if (category === 'Technical Tasks') {
        color = 'technicalTaskColor';
    }
    document.getElementById(`category${taskId}`).classList.add(`${color}`);
}


function changeProgressInfos(taskId, subTasks) {
    if (subTasks == undefined) {
        document.getElementById(`progressContainer${taskId}`).classList.add('dnone')
    } else {
        let length = subTasks.length;
        document.getElementById(`progressMax${taskId}`).innerHTML = `${length}`;
        let completedCount = subTasks.filter(subTask => subTask.completet).length;
        document.getElementById(`progressCounter${taskId}`).innerHTML = `${completedCount}`;
        let width = Math.round((completedCount / length) * 100);
        document.getElementById(`progress${taskId}`).style.width = `${width}%`;
    }
}


function changeAssignedTos(taskId, assignedTos) {
    document.getElementById(`assignedTo${taskId}`).innerHTML = ``;
    if (assignedTos) {
        for (let i = 0; i < assignedTos.length; i++) {
            let userId = assignedTos[i];
            let contact = findContactById(contacts, userId);
            document.getElementById(`assignedTo${taskId}`).innerHTML += /*html*/ `
        <div class="userIcon" id="userIcon${taskId}${i}">
        <div class="userInitials" id="userInitials${taskId}${i}">NS</div>
        <div>
        `;
            let color = contact['color'];
            document.getElementById(`userIcon${taskId}${i}`).classList.add(`${color}`.replace("#", 'C'));
            document.getElementById(`userInitials${taskId}${i}`).innerHTML = `${contact['initials']}`;
        }
    }
}


function changePriorityImg(taskId, priorityString) {
    document.getElementById(`priority${taskId}`).classList.add(`class${priorityString}`);
}


function findContactById(contacts, id) {
    return contacts.find(contact => contact.id === id);
}


function draggingStart(id) {
    clearNoTaskContainers();
    currentDragElement = id;
    document.getElementById(`${id}`).classList.add('rotate-5deg');
    let taskStatus = tasks.find(task => task.id === id)?.status;
    renderEmptyTask(taskStatus);
}


function draggingEnd(id) {
    document.getElementById(`${id}`).classList.remove('rotate-5deg');
    renderTasksBoard();
}


function clearNoTaskContainers() {
    // Alle div-Elemente mit der Klasse noTaskContainer auswählen
    var elements = document.querySelectorAll('div.noTaskContainer');

    // Über alle ausgewählten Elemente iterieren
    elements.forEach(function (element) {
        // Die Klasse dnone zu jedem Element hinzufügen
        element.classList.add('dnone');
    });
}


function allowDrop(ev) {
    ev.preventDefault();
}


function moveTo(category) {
    let task = tasks.find(task => task.id === currentDragElement);
    task['status'] = category;
    saveTasks();
    renderTasksBoard();
}


function renderEmptyTask(taskStatus) {
    if (taskStatus == 'toDo') {
        document.getElementById('taskContainerContentInProgress').innerHTML += /*html*/`
          <div class="emptyTask"></div>  
        `;
        document.getElementById('taskContainerContentAwaitFeedback').innerHTML += /*html*/`
        <div class="emptyTask"></div>  
        `;
        document.getElementById('taskContainerContentDone').innerHTML += /*html*/`
        <div class="emptyTask"></div>  
        `;
    } else if (taskStatus == 'inProgress') {
        document.getElementById('taskContainerContentToDo').innerHTML += /*html*/`
          <div class="emptyTask"></div>  
        `;
        document.getElementById('taskContainerContentAwaitFeedback').innerHTML += /*html*/`
        <div class="emptyTask"></div>  
        `;
        document.getElementById('taskContainerContentDone').innerHTML += /*html*/`
        <div class="emptyTask"></div>  
        `;
    } else if (taskStatus == 'awaitingFeedback') {
        document.getElementById('taskContainerContentToDo').innerHTML += /*html*/`
          <div class="emptyTask"></div>  
        `;
        document.getElementById('taskContainerContentInProgress').innerHTML += /*html*/`
        <div class="emptyTask"></div>  
        `;
        document.getElementById('taskContainerContentDone').innerHTML += /*html*/`
        <div class="emptyTask"></div>  
        `;
    } else if (taskStatus == 'done') {
        document.getElementById('taskContainerContentToDo').innerHTML += /*html*/`
          <div class="emptyTask"></div>  
        `;
        document.getElementById('taskContainerContentAwaitFeedback').innerHTML += /*html*/`
        <div class="emptyTask"></div>  
        `;
        document.getElementById('taskContainerContentInProgress').innerHTML += /*html*/`
        <div class="emptyTask"></div>  
        `;
    }
}

function filterTasks() {
    let search = document.getElementById('searchMobileInput').value.toLowerCase();
    for (let i = 0; i < tasks.length; i++) {
        // Get the title and description, and convert them to lowercase for case-insensitive comparison
        let title = tasks[i]['title'].toLowerCase();
        let description = tasks[i]['description'].toLowerCase();
        
        // Check if the search term is present in either the title or description
        if (title.includes(search) || description.includes(search)) {
            // If present, remove the 'dnone' class to make the div visible
            document.getElementById(`${tasks[i]['id']}`).classList.remove('dnone');
        } else {
            // If not present, add the 'dnone' class to hide the div
            document.getElementById(`${tasks[i]['id']}`).classList.add('dnone');
        }
    }
}

async function closeSingleView(event) {
    document.getElementById('body').classList.remove('overflowHidden');
    if (event.target === event.currentTarget) {
        document.getElementById('dialogBackground').classList.add('dnone');
        document.getElementById('singleTask').classList.remove('singleTaskEndposition');
        document.getElementById('body').classList.add('overFlowAuto');
    }
    await loadTasks()
    renderTasksBoard();
}


function stopPropagation(event) {
    event.stopPropagation;
}


function showTask(taskId) {
    document.getElementById('body').classList.add('overflowHidden');
    renderSingleTask(taskId);
    document.getElementById('dialogBackground').classList.remove('dnone');
    setTimeout(() => { document.getElementById('singleTask').classList.add('singleTaskEndposition') }, 0);
    document.getElementById('body').classList.remove('overFlowAuto');

}


function renderSingleTask(taskId) {
    let task = tasks.find(task => task.id === taskId);
    let taskpriority = task['priority'].charAt(0).toUpperCase() + task['priority'].slice(1);;
    document.getElementById('singleTask').innerHTML = /*html*/`
            <div class="singleTaskHead">
                <div id="singleTaskCategory" class="singleTaskCategory">${task['category']}</div>
                <img src="../assets/img/closingCrossBoard.svg" alt="" class="closeSingleTaskImg" onclick="closeSingleView(event)">
            </div>
            <div class="singleTaskTitle">${task['title']}</div>
            <div class="singleTaskDescription">${task['description']}</div>
            <div class="singleTaskDueDate">
                <div>Due Date:</div>
                <div>${task['dueDate']}</div>
            </div>
            <div class="singleTaskPriority">
                <div>Priority:</div>
                <div class="singleTaskPrioritySub">
                    <div>${taskpriority}</div>
                    <div class="singleTaskPriorityImg class${task['priority']}"></div>
                </div>
            </div>
            <div id="singleTaskAssignedTo" class="singleTaskAssignedTo">AssignedTo</div>
            <div id="singleTaskSubTasks" class="singleTaskSubTasks">Subtasks</div>
            <div class="singleTaskDeleteEdit">
                <div class="singleTaskDelete" onclick="event.stopPropagation(), deleteTask(${taskId})">
                    <img src="../assets/img/delete.svg" alt="">
                    <div>Delete</div>
                </div>
                <div class="singleTaskDeleteEditSeparator">

                </div>
                <div class="singleTaskDelete" onclick="event.stopPropagation(), editTask(${taskId})">
                    <img src="../assets/img/edit.svg" alt="">
                    <div>Edit</div>
                </div>
            </div>
    `;
    changeSingleTaskCategoryColor(task);
    renderSingleTaskAssignedTo(task);
    renderSingleTaskSubtasks(task);
}


function changeSingleTaskCategoryColor(task) {
    category = task['category'];
    let color = '';
    if (category === "User Story") {
        color = 'userStoryColor'
    }
    else if (category === 'Technical Tasks') {
        color = 'technicalTaskColor';
    }
    document.getElementById(`singleTaskCategory`).classList.add(`${color}`);
}


function renderSingleTaskAssignedTo(task) {
    let assignedTos = task['assignedTo'];
    document.getElementById(`singleTaskAssignedTo`).innerHTML = `
    <div>Assigned to:</div>
    `;
    if (assignedTos) {
        for (let i = 0; i < assignedTos.length; i++) {
            let assignedToIndex = assignedTos[i];
            let contact = findContactById(contacts, assignedToIndex);
            document.getElementById(`singleTaskAssignedTo`).innerHTML += /*html*/ `
        <div class="singleTaskAssignedToSub">
            <div class="userIcon" id="userIcon${i}">
                <div class="userInitials" id="userInitials${i}"></div>
            </div>
            <div class="singleTaskUserName" id="userName${i}"></div>
        </div>
        `;
            let color = contact['color'];
            document.getElementById(`userIcon${i}`).classList.add(`${color}`.replace("#", 'C'));
            document.getElementById(`userInitials${i}`).innerHTML = `${contact['initials']}`;
            document.getElementById(`userName${i}`).innerHTML = `${contact['name']}`;
        }
    }
}


function renderSingleTaskSubtasks(task) {
    document.getElementById('singleTaskSubTasks').innerHTML = `
    <div>Subtasks:</div>
    `
    let subTasks = task['subTasks'];
    if (!subTasks) {
        document.getElementById('singleTaskSubTasks').innerHTML = ``;
    }
    else if (subTasks.length > 0) {
        for (let i = 0; i < subTasks.length; i++) {
            let subTask = subTasks[i];
            document.getElementById('singleTaskSubTasks').innerHTML += /*html*/`
            <div class="subTask">
                <div class="subTaskCheckImg subTaskCompleted${subTask['completet']}" id="checkImg${subTask['id']}" onclick="event.stopPropagation(), changeSubTaskCompletet(${task['id']}, ${subTask['id']})"></div>
                <div>${subTask['content']}</div>
            </div>    
            `;
        }
    }

}


function changeSubTaskCompletet(taskId, subTaskId) {
    let task = tasks.find(task => task.id === taskId);
    if (task) {
        let subTask = task.subTasks.find(subTask => subTask.id === subTaskId);
        if (subTask) {
            if (!subTask.completet) {
                subTask.completet = true;
                document.getElementById(`checkImg${subTaskId}`).classList.remove('subTaskCompletedfalse');
                document.getElementById(`checkImg${subTaskId}`).classList.add('subTaskCompletedtrue');
            } else {
                subTask.completet = false;
                document.getElementById(`checkImg${subTaskId}`).classList.remove('subTaskCompletedtrue');
                document.getElementById(`checkImg${subTaskId}`).classList.add('subTaskCompletedfalse');
            }
        }
        saveTasks();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    location.reload();
}

function editTask(taskId) {
    document.getElementById('singleTask').innerHTML = /*html*/`
    <div class="editForm" name="editForm" id="editForm">
        <div class="editHead">
            <img src="../assets/img/closingCrossBoard.svg" alt="" class="closeSingleTaskImg" onclick="event.stopPropagation(), closeSingleView(event)">
        </div>
        <label for="editTitle">Title</label>
        <input name="editTitle" id="editTitle" placeholder="Enter a title" maxlength="60">
        <label for="editDescription">Description</label>
        <textarea name="editDescription" id="editDescription" placeholder="Enter a description" maxlength="160"></textarea>
        <label for="editDueDate">Due date</label>
        <input id="editDueDate"
           name="editDueDate"
           type="date"
           min="2022-01-01"
           step="1">
        <label for="editPriority">Priority</label>
        <div class="editPriority" name="editPriority">
            <div class="prioritySub" id="prioritySubUrgent" onclick="event.stopPropagation(), changeChosenPriorityToUrgent(${taskId})">
                <div class="editPriorityText" id="editPriorityUrgentText">Urgent</div>
                <div class="priorityUrgentImgNormal" id="editPriorityUrgentImg"></div>
            </div>
            <div class="prioritySub" id="prioritySubMedium" onclick="event.stopPropagation(), changeChosenPriorityToMedium(${taskId})">
                <div class="editPriorityText" id="editPriorityMediumText">Medium</div>
                <div class="priorityMediumImgNormal" id="editPriorityMediumImg"></div>
            </div>
            <div class="prioritySub" id="prioritySubLow" onclick="event.stopPropagation(), changeChosenPriorityToLow(${taskId})">
                <div class="editPriorityText"id="editPriorityUrgentText">Low</div>
                <div class="priorityLowImgNormal" id="editPriorityLowImg"></div>
            </div>
        </div>
        <div class="editAssignedTo">
            <label for="contactsDropDown">AssignedTo</label onclick="event.stopPropagation()">
            <div id="contactsDropDownInputContainer" onclick="event.stopPropagation()">
                <input placeholder="Select contacts to assign" type="search" id="contactsDropDown" onkeyup="editFilterNames()" onfocus="event.stopPropagation(), setInputContainerBorderColor('contactsDropDownInputContainer')" onblur="resetInputContainerBorderColor('contactsDropDownInputContainer')" onclick="event.stopPropagation()">
                <div class="openCloseChoosingListImg" id="openCloseChoosingListImg" onclick="event.stopPropagation(), toggleShowChoosingList()" ></div>
            </div>
            <div id="choosingList" class="choosingList dnone" onclick="event.stopPropagation()"></div>
            <div class="editAssignedTosChosen" id="editAssignedTosChosenEdit">
            </div>
        </div>
        <label for="editSubTasks">Subtasks</label>
        <div id="editSubTasksInputContainer">
            <input type="text" name="editSubTasks" id="editSubTasks" placeholder="Add new subtask" minlength="5" maxlength="20" onfocus="setInputContainerBorderColor('editSubTasksInputContainer')" onblur="resetInputContainerBorderColor('editSubTasksInputContainer')">
            <img class="addSubTaskImg" src="../assets/img/EditTaskAddSubtask.svg" alt="" onclick="event.stopPropagation(), addSubTask(${taskId})">
        </div>
        <div id ="editSubtasksList" class="editSubtasksList">

        </div>
        <div class="editBottom">
            <div class="editBottomSave" onclick="event.stopPropagation(), finishEdit(${taskId})">
                <div>Ok</div>
                <img src="../assets/img/checkEditTaskDark.svg" alt="">
            </div>
        </div>
</div>
    `;
    getPreloadedInputValues(taskId);
    getPreloadedPriority(taskId);
    renderChoosingList(taskId);
    renderAssignedTosEdit(taskId);
    renderSubtasksEdit(taskId);
}

function getPreloadedInputValues(taskId) {
    let task = tasks.find(task => task.id === taskId);
    let preloadedTitle = task['title'];
    document.getElementById('editTitle').value = preloadedTitle;
    let preloadedDescription = task['description'];
    document.getElementById('editDescription').value = preloadedDescription;
    let preloadedDueDate = task['dueDate'];
    document.getElementById('editDueDate').value = preloadedDueDate;
    setEditDueDateMinDate();
}

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

function getPreloadedPriority(taskId) {
    let task = tasks.find(task => task.id === taskId);
    let preloadedPriority = task['priority'];
    if (preloadedPriority == 'urgent') {
        changeChosenPriorityToUrgent(taskId);
    } else if (preloadedPriority == 'medium') {
        changeChosenPriorityToMedium(taskId);
    } else {
        changeChosenPriorityToLow(taskId);
    }
}


function changeChosenPriorityToUrgent(taskId) {
    chosenPriority = 'urgent';
    let task = tasks.find(task => task.id === taskId);
    task['priority'] = 'urgent';
    document.getElementById('prioritySubUrgent').classList.add('backgroundColorUrgent');
    document.getElementById('editPriorityUrgentImg').classList.add('whiteningFilter');
    document.getElementById('prioritySubMedium').classList.remove('backgroundColorMedium');
    document.getElementById('editPriorityMediumImg').classList.remove('whiteningFilter');
    document.getElementById('prioritySubLow').classList.remove('backgroundColorLow');
    document.getElementById('editPriorityLowImg').classList.remove('whiteningFilter');
}

function changeChosenPriorityToMedium(taskId) {
    chosenPriority = 'medium';
    let task = tasks.find(task => task.id === taskId);
    task['priority'] = 'medium';
    document.getElementById('prioritySubMedium').classList.add('backgroundColorMedium');
    document.getElementById('editPriorityMediumImg').classList.add('whiteningFilter');
    document.getElementById('prioritySubUrgent').classList.remove('backgroundColorUrgent');
    document.getElementById('editPriorityUrgentImg').classList.remove('whiteningFilter');
    document.getElementById('prioritySubLow').classList.remove('backgroundColorLow');
    document.getElementById('editPriorityLowImg').classList.remove('whiteningFilter');
}

function changeChosenPriorityToLow(taskId) {
    chosenPriority = 'low';
    let task = tasks.find(task => task.id === taskId);
    task['priority'] = 'low';
    document.getElementById('prioritySubLow').classList.add('backgroundColorLow');
    document.getElementById('editPriorityLowImg').classList.add('whiteningFilter');
    document.getElementById('prioritySubMedium').classList.remove('backgroundColorMedium');
    document.getElementById('editPriorityMediumImg').classList.remove('whiteningFilter');
    document.getElementById('prioritySubUrgent').classList.remove('backgroundColorUrgent');
    document.getElementById('editPriorityUrgentImg').classList.remove('whiteningFilter');
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

function showChoosingList() {
    document.getElementById('choosingList').classList.remove('dnone');
    document.getElementById('openCloseChoosingListImg').classList.add('rotate180');
}

function closeChoosingList() {
    if (document.getElementById('choosingList')) {
        document.getElementById('choosingList').classList.add('dnone');
        document.getElementById('openCloseChoosingListImg').classList.remove('rotate180');
    }
}

function renderChoosingList(taskId) {
    document.getElementById('choosingList').innerHTML = ``;
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let color = contact['color'].replace("#", "C");
        document.getElementById('choosingList').innerHTML += /*html*/`
        <div class="choosingListRow" onclick="toggleAssigned(${contact['id']}, ${taskId}), event.stopPropagation()" id="choosingListRow${contact['id']}">
            <div class="choosingListLeft">
                <div class="choosingListUserIcon ${color}">
                    <div class="choosingListUserInitials">${contact['initials']}</div>
                </div>
                <div>${contact['name']}</div>
            </div>
            <div class="choosingListCheck" id="choosingListCheckImg${contact['id']}"></div>
        </div>
        `;
        fillAssigned(contact, taskId);
    }
}

function fillAssigned(contact, taskId) {
    let task = tasks.find(task => task.id === taskId);
    let UserId = contact['id'];
    if (task.assignedTo && task.assignedTo.includes(Number(UserId))) {
        document.getElementById(`choosingListCheckImg${contact['id']}`).classList.remove('completedFalse');
        document.getElementById(`choosingListCheckImg${contact['id']}`).classList.add('completedTrue');
    } else {
        document.getElementById(`choosingListCheckImg${contact['id']}`).classList.add('completedFalse');
        document.getElementById(`choosingListCheckImg${contact['id']}`).classList.remove('completedTrue');
    }
}

function toggleAssigned(contactId, taskId) {
    let taskIndex = Number(tasks.findIndex(task => task.id === taskId));
    if (!tasks[taskIndex].assignedTo) {
        tasks[taskIndex].assignedTo = [];
    };
    let contactIndex = Number(tasks[taskIndex].assignedTo.indexOf(contactId));
    if (contactIndex === -1) {
        document.getElementById(`choosingListCheckImg${contactId}`).classList.remove('completedFalse');
        document.getElementById(`choosingListCheckImg${contactId}`).classList.add('completedTrue');
        tasks[taskIndex].assignedTo.push(Number(contactId));
    } else {
        document.getElementById(`choosingListCheckImg${contactId}`).classList.remove('completedTrue');
        document.getElementById(`choosingListCheckImg${contactId}`).classList.add('completedFalse');
        tasks[taskIndex].assignedTo.splice(Number(contactIndex), 1);
    }
    renderAssignedTosEdit(taskId);

}

function editFilterNames() {
    let search = document.getElementById('contactsDropDown').value.toLowerCase();
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i]['name'].toLowerCase().includes(search)) {
            document.getElementById(`choosingListRow${contacts[i]['id']}`).classList.remove('dnone');
        } else {
            document.getElementById(`choosingListRow${contacts[i]['id']}`).classList.add('dnone');
        }
    }
}

async function finishEdit(taskId) {
    let task = tasks.find(task => task.id === taskId);
    task['title'] = document.getElementById('editTitle').value;
    task['description'] = document.getElementById('editDescription').value;
    task['dueDate'] = document.getElementById('editDueDate').value;
    await saveTasks();
    renderSingleTask(taskId);
}

function renderAssignedTosEdit(taskId) {
    let task = tasks.find(task => task.id === taskId);
    let assignedTos = task['assignedTo'];
    document.getElementById(`editAssignedTosChosenEdit`).innerHTML = ``;
    if (assignedTos) {
        for (let i = 0; i < assignedTos.length; i++) {
            let userId = assignedTos[i];
            let contact = findContactById(contacts, userId);
            document.getElementById(`editAssignedTosChosenEdit`).innerHTML += /*html*/ `
            <div class="choosingListUserIcon " id="userIconEdit${i}">
                <div class="choosingListUserInitials" id="userInitialsEdit${i}"></div>
            </div>
        `;
            let color = contact['color'];
            document.getElementById(`userIconEdit${i}`).classList.add(`${color}`.replace("#", 'C'));
            document.getElementById(`userInitialsEdit${i}`).innerHTML = `${contact['initials']}`;
        }
    }
}

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
                    <img class="editSubTaskEditImg" src="../assets/img/edit.svg" alt="" onclick="event.stopPropagation(), editEditSubTask(${task['id']},${singleSubtask['id']})">
                    <div class="editSubTaskSeparator"></div>
                    <img class="editSubTaskDeleteImg" src="../assets/img/delete.svg" alt="" onclick="event.stopPropagation(), deleteEditSubTask(${task['id']},${singleSubtask['id']})">
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
                <img class="editSubTaskEditImg" src="../assets/img/delete.svg" alt="" onclick="event.stopPropagation(), deleteEditSubTask(${taskId},${subTaskId})">
                <div class="editSubTaskSeparator"></div>
                <img class="editSubTaskEditImg" src="../assets/img/checkEditTaskBright.svg" alt="" onclick="event.stopPropagation(), changeEditSubTaskContent(${taskId},${subTaskId})">
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

function setInputContainerBorderColor(inputContainerId) {
    document.getElementById(`${inputContainerId}`).classList.add('inputContainerFocus');
}

function resetInputContainerBorderColor(inputContainerId) {
    document.getElementById(`${inputContainerId}`).classList.remove('inputContainerFocus');
}