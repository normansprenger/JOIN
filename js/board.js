async function init() {
    await includeHTML();
    await loadTasks();
    checkUser();
    fillUserInitials();
    renderTasksBoard();
}

function renderTasksBoard() {

}