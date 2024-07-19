let filteredTasks = [];
let InProgress = [];

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

function changeAssignedToUsers(taskId, assignedTos) {
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


function changePriorityImg(taskId, priorityString){
    document.getElementById(`priority${taskId}`).classList.add(`class${priorityString}`);
}


function findContactById(contacts, id) {
    return contacts.find(contact => contact.id === id);
}
