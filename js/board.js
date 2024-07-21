let filteredTasks = [];
let InProgress = [];
let currentDragElement = [];


async function init() {
    await includeHTML();
    await loadTasks();
    await loadContacts();
    checkUser();
    fillUserInitials();
    renderTasksBoard();
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


function closeSingleView(event) {
    if (event.target === event.currentTarget) {
        document.getElementById('dialogBackground').classList.add('dnone');
        document.getElementById('singleTask').classList.remove('singleTaskEndposition');
        document.getElementById('body').classList.add('overFlowAuto');
    }
}


function stopPropagation(event) {
    event.stopPropagation;
}


function showTask(taskId) {
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
            <div>${task['description']}</div>
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
                <div class="singleTaskDelete" onclick="deleteTask(${taskId})">
                    <img src="../assets/img/delete.svg" alt="">
                    <div>Delete</div>
                </div>
                <div class="singleTaskDeleteEditSeparator">

                </div>
                <div class="singleTaskDelete" onclick="editTask(${taskId})">
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
    let assignedTos = task['assignedTo']
    document.getElementById(`singleTaskAssignedTo`).innerHTML = `
    <div>Assigned to:</div>
    `;
    for (let i = 0; i < assignedTos.length; i++) {
        let userId = assignedTos[i];
        let contact = findContactById(contacts, userId);
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
                <div class="subTaskCheckImg subTaskCompleted${subTask['completet']}" id="checkImg${subTask['id']}" onclick="changeSubTaskCompletet(${task['id']}, ${subTask['id']})"></div>
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

function editTask(task) {
    document.getElementById('singleTask').innerHTML = /*html*/`
    <form action="" class="editForm">
        <label for="editTitle">Title</label>
        <input name="editTitle" id="editTitle" placeholder="Enter a title">
        <label for="editDescription">Description</label>
        <textarea name="editDescription" id="editDescription" placeholder="Enter a description"></textarea>
        <label for="editDueDate">Due date</label>
        <input id="editDueDate"
               name="editDueDate"
               type="date"
               min="2024-01-01"
               step="1">
        <label for="editPriority">Priority</label>
        <div class="editPriority" name="editPriority">
            <div class="prioritySub">
                <div>Urgent</div>
                <img src="../assets/img/priorityUrgentBoard.svg" alt="">
            </div>
            <div class="prioritySub">
            <div>Medium</div>
            <img src="../assets/img/priorityMediumBoard.svg" alt="">
            </div>
            <div class="prioritySub">
            <div>Low</div>
            <img src="../assets/img/priorityLowBoard.svg" alt="">
            </div>
        </div>
        <div class="editAssignedTo">
            <label for="Contacts">AssignedTo</label>
            <select name="Contacts" id="ContactsDropDown" aria-placeholder="SelectContacts to assign">
            <option value="" disabled selected>Select Contacts to assign</option>
            </select>
            <div class="editAssignedTosChosen">
                <div class="userIcon">
                    <div class="userInitials"></div>
                </div>
            </div>
        </div>
        <label for="editSubTasks">Subtasks</label>
        <div class="editSubTasksInputContainer">
            <input type="text" name="editSubTasks">
            <img src="../assets/img/EditTaskAddSubtask.svg" alt="">
        </div>
        <div class="editSubtasksList">

        </div>
    </form>
    `;
}