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
    }
}

function stopPropagation(event) {
    event.stopPropagation;
}

function showTask(taskId) {
    renderSingleTask(taskId);
    document.getElementById('dialogBackground').classList.remove('dnone');
    setTimeout(() => { document.getElementById('singleTask').classList.add('singleTaskEndposition') }, 0);

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
                <div class="singleTaskDelete">
                    <img src="../assets/img/delete.svg" alt="">
                    <div>Delete</div>
                </div>
                <div class="singleTaskDeleteEditSeparator">

                </div>
                <div class="singleTaskDelete">
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
    if (subTasks.length > 0) {
        document.getElementById('singleTaskSubTasks').innerHTML += `
        
        `
    } else {
        document.getElementById('singleTaskSubTasks').innerHTML = '';
    }

}

//let tasks = [
//    {
//        "assignedTo": [
//            0,
//            5,
//            6
//        ],
//        "category": "User Story",
//        "description": "Build start page with recipe recommendation.",
//        "dueDate": "2024-07-31",
//        "id": 0,
//        "priority": "medium",
//        "status": "toDo",
//        "subTasks": [
//            {
//                "completet": true,
//                "content": "Implement Recipe Recommendation",
//                "id": 0
//            },
//            {
//                "completet": false,
//                "content": "Start Page Layout",
//                "id": 1
//            }
//        ],
//        "title": "Kochwelt Page & Recipe Recommender"
//    },
//    {
//        "assignedTo": [
//            2,
//            7
//        ],
//        "category": "Technical Tasks",
//        "description": "Define CSS naming conventions and structure",
//        "dueDate": "2024-07-31",
//        "id": 1,
//        "priority": "urgent",
//        "status": "inProgress",
//        "subTasks": [
//            {
//                "completet": true,
//                "content": "Establish CSS Methodology",
//                "id": 0
//            },
//            {
//                "completet": true,
//                "content": "Setup Base Styles",
//                "id": 1
//            }
//        ],
//        "title": "CSS Architecture Planning"
//    },
//    {
//        "assignedTo": [
//            2,
//            3,
//            8
//        ],
//        "category": "Technical Tasks",
//        "description": "Create reusable HTML base templates",
//        "dueDate": "2024-07-31",
//        "id": 2,
//        "priority": "low",
//        "status": "toDo",
//        "title": "HTML Base Template Creation"
//    },
//    {
//        "assignedTo": [
//            1,
//            4,
//            8
//        ],
//        "category": "User Story",
//        "description": "Implement daily recipe and portion calculator",
//        "dueDate": "2024-07-31",
//        "id": 3,
//        "priority": "medium",
//        "status": "awaitingFeedback",
//        "title": "Daily Kochwelt Recipe"
//    },
//    {
//        "assignedTo": [
//            3,
//            4,
//            8
//        ],
//        "category": "User Story",
//        "description": "Create a contac form and imprint page",
//        "dueDate": "2024-07-31",
//        "id": 4,
//        "priority": "medium",
//        "status": "done",
//        "subTasks": [
//            {
//                "completet": false,
//                "content": "Create contact form",
//                "id": 0
//            },
//            {
//                "completet": false,
//                "content": "set up imprint page",
//                "id": 1
//            }
//        ],
//        "title": "Contact Form & Imprint"
//    }
// ]