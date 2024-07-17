let toDos = [];

async function init() {
    await includeHTML();
    await loadTasks();
    checkUser();
    fillUserInitials();
    renderTasksBoard();
}

function renderTasksBoard() {
    renderTodosBoard();
    //renderInProgressBoard();
    //renderAwaitFeedbackBoard();
    //renderDoneBoard();
}

function renderTodosBoard() {
    document.getElementById('taskContainerContentTodo').innerHTML = ``;
    toDos = tasks.filter(task => task.status === "toDo"); //sucht alle Tasks mit status toDo und schreibt sie in toDos
    for (let i = 0; i < toDos.length; i++) {
        let taskId = toDos[i]['id'];
        document.getElementById('taskContainerContentTodo').innerHTML += /*html*/ `
        <div class="task" id="task${taskId}">
                    <div class="taskCategory">${toDos[i]['category']}</div>
                    <span class="taskTitle">${toDos[i]['title']}</span>
                    <span class="taskDescription">${toDos[i]['description']}</span>
                            <div class="progressContainer">
                                <div class="progressBar">
                                    <div class="progress" id="progress${taskId}"></div>
                                </div>
                                <div class="progressText">0/2 Subtasks</div>
                            </div>
                            <div class="taskBottom">
                                <div class="assignedTo">
                                    <div class="userIcon">
                                        <div class="userInitials">NS</div>
                                    </div>
                                </div>
                                <img src="../assets/img/priorityLowBoard.svg" class="taskPriority">
                            </div>
                        </div>
                `;

    }

}

function fillSubTasks(i, subTasksLength, taskId) {
    if (subTasksLength > 0) {
        calcProgressWidth(i, subTasksLength, taskId);
        document.getElementById(`${toDos[i]['id']}`).innerHTML += /*html*/ `
            <div class="progressContainer">
                <div class="progressBar">
                    <div class="progress"></div>
                </div>
                <div class="progressText">0/<span>${subTasksLength}</span> Subtasks</div>
            </div>
            `
    }
}

function calcProgressWidth(i, subTasksLength, taskId) {
}