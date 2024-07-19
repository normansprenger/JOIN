function renderTasksBoard() {
    renderTodosBoard();
    renderInProgressBoard();
    renderAwaitFeedbackBoard();
    renderDoneBoard();
}

function renderTodosBoard() {
    document.getElementById('taskContainerContentToDo').innerHTML = ``;
    filteredTasks = tasks.filter(task => task.status === "toDo");
    if (filteredTasks.length < 1) {
        document.getElementById('taskContainerContentToDo').innerHTML =/*html*/ `
        <div class="noTaskContainer">
            <span class="noTaskText">No tasks in progress</span>
        </div>
        `
    } else {
        for (let i = 0; i < filteredTasks.length; i++) {
            let taskId = filteredTasks[i]['id'];
            document.getElementById('taskContainerContentToDo').innerHTML += /*html*/ `
        <div class="task" id="${taskId}" onclick="showTask(${taskId})" draggable="true" ondragstart="draggingStart(${taskId})" ondragend="draggingEnd(${taskId})">
                    <div class="taskCategory" id="category${taskId}">${filteredTasks[i]['category']}</div>
                    <span class="taskTitle">${filteredTasks[i]['title']}</span>
                    <span class="taskDescription">${filteredTasks[i]['description']}</span>
                            <div class="progressContainer" id="progressContainer${taskId}">
                                <div class="progressBar">
                                    <div class="progress" id="progress${taskId}"></div>
                                </div>
                                <div class="progressText"><span id="progressCounter${taskId}"></span>/<span id="progressMax${taskId}">5</span> Subtasks</div>
                            </div>
                            <div class="taskBottom">
                                <div class="assignedTo" id="assignedTo${taskId}">
                                    <div class="userIcon">
                                        <div class="userInitials">NS</div>
                                    </div>
                                </div>
                                <img src="../assets/img/priorityLowBoard.svg" class="taskPriority">
                            </div>
                        </div>
                `;
            changeCategoryColor(taskId, filteredTasks[i]['category']);
            changeProgressInfos(taskId, filteredTasks[i]['subTasks']);
            changeAssignedToUsers(taskId, filteredTasks[i]['assignedTo'])
        }
    }
}


function renderInProgressBoard() {
    document.getElementById('taskContainerContentInProgress').innerHTML = ``;
    filteredTasks = tasks.filter(task => task.status === "inProgress"); 
    if (filteredTasks.length < 1) {
        document.getElementById('taskContainerContentInProgress').innerHTML =/*html*/ `
        <div class="noTaskContainer">
            <span class="noTaskText">No tasks in progress</span>
        </div>
        `
    } else {
        for (let i = 0; i < filteredTasks.length; i++) {
            let taskId = filteredTasks[i]['id'];
            document.getElementById('taskContainerContentInProgress').innerHTML += /*html*/ `
        <div class="task" id="${taskId}" onclick="showTask(${taskId})" draggable="true" ondragstart="draggingStart(${taskId})" ondragend="draggingEnd(${taskId})">
                    <div class="taskCategory" id="category${taskId}">${filteredTasks[i]['category']}</div>
                    <span class="taskTitle">${filteredTasks[i]['title']}</span>
                    <span class="taskDescription">${filteredTasks[i]['description']}</span>
                            <div class="progressContainer" id="progressContainer${taskId}">
                                <div class="progressBar">
                                    <div class="progress" id="progress${taskId}"></div>
                                </div>
                                <div class="progressText"><span id="progressCounter${taskId}"></span>/<span id="progressMax${taskId}">5</span> Subtasks</div>
                            </div>
                            <div class="taskBottom">
                                <div class="assignedTo" id="assignedTo${taskId}">
                                    <div class="userIcon">
                                        <div class="userInitials">NS</div>
                                    </div>
                                </div>
                                <img src="../assets/img/priorityLowBoard.svg" class="taskPriority">
                            </div>
                        </div>
                `;
            changeCategoryColor(taskId, filteredTasks[i]['category']);
            changeProgressInfos(taskId, filteredTasks[i]['subTasks']);
            changeAssignedToUsers(taskId, filteredTasks[i]['assignedTo'])
        }
    }
}


function renderAwaitFeedbackBoard() {
    document.getElementById('taskContainerContentAwaitFeedback').innerHTML = ``;
    filteredTasks = tasks.filter(task => task.status === "awaitingFeedback");
    if (filteredTasks.length < 1) {
        document.getElementById('taskContainerContentAwaitFeedback').innerHTML =/*html*/ `
        <div class="noTaskContainer">
            <span class="noTaskText">No tasks awaiting Feedback</span>
        </div>
        `
    } else {
        for (let i = 0; i < filteredTasks.length; i++) {
            let taskId = filteredTasks[i]['id'];
            document.getElementById('taskContainerContentAwaitFeedback').innerHTML += /*html*/ `
        <div class="task" id="${taskId}" onclick="showTask(${taskId})" draggable="true" ondragstart="draggingStart(${taskId})" ondragend="draggingEnd(${taskId})">
                    <div class="taskCategory" id="category${taskId}">${filteredTasks[i]['category']}</div>
                    <span class="taskTitle">${filteredTasks[i]['title']}</span>
                    <span class="taskDescription">${filteredTasks[i]['description']}</span>
                            <div class="progressContainer" id="progressContainer${taskId}">
                                <div class="progressBar">
                                    <div class="progress" id="progress${taskId}"></div>
                                </div>
                                <div class="progressText"><span id="progressCounter${taskId}"></span>/<span id="progressMax${taskId}">5</span> Subtasks</div>
                            </div>
                            <div class="taskBottom">
                                <div class="assignedTo" id="assignedTo${taskId}">
                                    <div class="userIcon">
                                        <div class="userInitials">NS</div>
                                    </div>
                                </div>
                                <img src="../assets/img/priorityLowBoard.svg" class="taskPriority">
                            </div>
                        </div>
                `;
            changeCategoryColor(taskId, filteredTasks[i]['category']);
            changeProgressInfos(taskId, filteredTasks[i]['subTasks']);
            changeAssignedToUsers(taskId, filteredTasks[i]['assignedTo'])
        }
    }
}


function renderDoneBoard() {
    document.getElementById('taskContainerContentDone').innerHTML = ``;
    filteredTasks = tasks.filter(task => task.status === "done");
    if (filteredTasks.length < 1) {
        document.getElementById('taskContainerContentDone').innerHTML =/*html*/ `
        <div class="noTaskContainer">
            <div class="noTaskText">No tasks done</div>
        </div>
        `
    } else {
        for (let i = 0; i < filteredTasks.length; i++) {
            let taskId = filteredTasks[i]['id'];
            document.getElementById('taskContainerContentDone').innerHTML += /*html*/ `
        <div class="task" id="${taskId}" onclick="showTask(${taskId})" draggable="true" ondragstart="draggingStart(${taskId})" ondragend="draggingEnd(${taskId})">
                    <div class="taskCategory" id="category${taskId}">${filteredTasks[i]['category']}</div>
                    <span class="taskTitle">${filteredTasks[i]['title']}</span>
                    <span class="taskDescription">${filteredTasks[i]['description']}</span>
                            <div class="progressContainer" id="progressContainer${taskId}">
                                <div class="progressBar">
                                    <div class="progress" id="progress${taskId}"></div>
                                </div>
                                <div class="progressText"><span id="progressCounter${taskId}"></span>/<span id="progressMax${taskId}">5</span> Subtasks</div>
                            </div>
                            <div class="taskBottom">
                                <div class="assignedTo" id="assignedTo${taskId}">
                                    <div class="userIcon">
                                        <div class="userInitials">NS</div>
                                    </div>
                                </div>
                                <img src="../assets/img/priorityLowBoard.svg" class="taskPriority">
                            </div>
                        </div>
                `;
            changeCategoryColor(taskId, filteredTasks[i]['category']);
            changeProgressInfos(taskId, filteredTasks[i]['subTasks']);
            changeAssignedToUsers(taskId, filteredTasks[i]['assignedTo'])
        }
    }
}