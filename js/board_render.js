function renderTasksBoard() {
    renderTodosBoard();
    renderInProgressBoard();
    renderAwaitFeedbackBoard();
    renderDoneBoard();
}

function renderTodosBoard() {
    document.getElementById('taskContainerContentTodo').innerHTML = ``;
    filteredTasks = tasks.filter(task => task.status === "toDo"); //sucht alle Tasks mit status toDo und schreibt sie in filteredTasks
    if (filteredTasks.length < 1) {
        document.getElementById('taskContainerContentTodo').innerHTML =/*html*/ `
        <div class="noTaskContainer">
            <span class="noTaskText">No tasks to do</span>
        </div>
        `
    } else {
        for (let i = 0; i < filteredTasks.length; i++) {
            let taskId = filteredTasks[i]['id'];
            document.getElementById('taskContainerContentTodo').innerHTML += /*html*/ `
        <div class="task" id="task${taskId}" onclick="showTask(${taskId})">
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
                                <div id="priority${taskId}" src="../assets/img/priorityLowBoard.svg" class="taskPriority"></div>
                            </div>
                        </div>
                `;
            changeCategoryColor(taskId, filteredTasks[i]['category']);
            changeProgressInfos(taskId, filteredTasks[i]['subTasks']);
            changeAssignedToUsers(taskId, filteredTasks[i]['assignedTo'])
            changePriorityImg(taskId, filteredTasks[i]['priority']);
        }
    }
}


function renderInProgressBoard() {
    document.getElementById('taskContainerContentInProgress').innerHTML = ``;
    filteredTasks = tasks.filter(task => task.status === "inProgress"); //sucht alle Tasks mit status toDo und schreibt sie in filteredTasks
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
        <div class="task" id="task${taskId}" onclick="showTask(${taskId})">
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
    document.getElementById('taskContainerAwaitFeedback').innerHTML = ``;
    filteredTasks = tasks.filter(task => task.status === "awaitingFeedback"); //sucht alle Tasks mit status toDo und schreibt sie in filteredTasks
    if (filteredTasks.length < 1) {
        document.getElementById('taskContainerAwaitFeedback').innerHTML =/*html*/ `
        <div class="noTaskContainer">
            <span class="noTaskText">No tasks awaiting Feedback</span>
        </div>
        `
    } else {
        for (let i = 0; i < filteredTasks.length; i++) {
            let taskId = filteredTasks[i]['id'];
            document.getElementById('taskContainerAwaitFeedback').innerHTML += /*html*/ `
        <div class="task" id="task${taskId}" onclick="showTask(${taskId})">
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
    document.getElementById('taskContainerDone').innerHTML = ``;
    filteredTasks = tasks.filter(task => task.status === "done"); //sucht alle Tasks mit status toDo und schreibt sie in filteredTasks
    if (filteredTasks.length < 1) {
        document.getElementById('taskContainerDone').innerHTML =/*html*/ `
        <div class="noTaskContainer">
            <span class="noTaskText">No tasks awaiting Feedback</span>
        </div>
        `
    } else {
        for (let i = 0; i < filteredTasks.length; i++) {
            let taskId = filteredTasks[i]['id'];
            document.getElementById('taskContainerDone').innerHTML += /*html*/ `
        <div class="task" id="task${taskId}" onclick="showTask(${taskId})">
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