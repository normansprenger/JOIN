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
                    <div class="taskCategory" id="category${taskId}">${toDos[i]['category']}</div>
                    <span class="taskTitle">${toDos[i]['title']}</span>
                    <span class="taskDescription">${toDos[i]['description']}</span>
                            <div class="progressContainer" id="progressContainer${taskId}">
                                <div class="progressBar">
                                    <div class="progress" id="progress${taskId}"></div>
                                </div>
                                <div class="progressText">0/<span id="progressText${taskId}">5</span> Subtasks</div>
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
    changeCategoryColor(taskId, toDos[i]['category']);
    changeProgressInfos(taskId, toDos[i]['subTasks']);
    changeAssignedToUsers(taskId, toDos[i])
    }
}


function changeCategoryColor(taskId, category){
    let color = '';
    if(category === "User Story"){
        color = 'userStoryColor'
    } 
    else if (category === 'Technical Tasks'){
        color = 'technicalTaskColor'
    }
    document.getElementById(`category${taskId}`).classList.add(`${color}`);
}


function changeProgressInfos(taskId, subTasks){
    if(subTasks == undefined){
        document.getElementById(`progressContainer${taskId}`).classList.add('dnone')
    } else {
        let length = subTasks.length;
        document.getElementById(`progressText${taskId}`).innerHTML = `${length}`;
        let completedCount = subTasks.filter(subTask => subTask.completet).length;
        let width = Math.round((completedCount / length) * 100);
        document.getElementById(`progress${taskId}`).style.width = `${width}%`;
    }
}

