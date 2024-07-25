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

/**
 * Initializes the Add Task page by performing several asynchronous operations:
 * - Includes HTML templates.
 * - Loads existing tasks and contacts.
 * - Applies the medium orange button style.
 * - Generates a unique task ID based on the current timestamp and assigns it to the new task.
 * - Renders the choosing list and the assigned contacts section for editing.
 * - Sets the minimum date for the due date input field.
 * - Checks the current user.
 * - Fills in user initials.
 * 
 * @async
 * @function initAddTask
 * @returns {Promise<void>} A promise that resolves when all initialization steps are completed.
 */
async function initAddTask() {
    includeHTML();
    await loadTasks();
    await loadContacts();
    ButtonMediumInOrange();
    newTaskId = new Date().getTime();
    newTask['id'] = Number(newTaskId);
    renderChoosingList(newTaskId);
    renderAssignedTosEdit(newTaskId);
    setEditDueDateMinDate();
    checkUser();
    fillUserInitials();
}

// disabled to enabled //

/**
 * Enables or disables the "Create Task" button based on the completion status of the task form fields.
 * 
 * This function checks if the following form fields are filled:
 * - Title (must not be empty after trimming whitespace)
 * - Due Date (must not be empty after trimming whitespace)
 * - Category (must be selected and not equal to 'Select task category')
 * 
 * If all conditions are met, the "Create Task" button is enabled; otherwise, it is disabled.
 * 
 * @function enableCreateTaskButton
 * @returns {void}
 */
function enableCreateTaskButton() {
    const titleFilled = document.getElementById('title').value.trim() !== '';
    const dueDateFilled = document.getElementById('editDueDate').value.trim() !== '';
    const categoryFilled = document.getElementById('category').value !== '' && document.getElementById('category').value !== 'Select task category';

    if (titleFilled && dueDateFilled && categoryFilled) {
        document.getElementById('createTask').disabled = false;
    } else {
        document.getElementById('createTask').disabled = true;
    }
}

// Validate Title and Description //

/**
 * Validates the title input field to ensure it meets specific criteria.
 * 
 * This function checks if the title:
 * - Is between 3 and 40 characters long.
 * 
 * If the title meets the criteria, the custom validity message is cleared.
 * Otherwise, a custom validity message is set to inform the user of the requirements.
 * 
 * @function validateTitle
 * @returns {void}
 */
function validateTitle() {
    let input = document.getElementById('title');
    let title = input.value.trim();
    let titlePattern = /^.{3,40}$/;
    if (titlePattern.test(title)) {
        input.setCustomValidity(''); 
    } else {
        input.setCustomValidity('The title must be at least 3 characters long and max 40 characters long.');
    }
}

/**
 * Validates the description input field to ensure it meets specific criteria.
 * 
 * This function checks if the description:
 * - Is between 3 and 200 characters long.
 * 
 * If the description meets the criteria, the custom validity message is cleared.
 * Otherwise, a custom validity message is set to inform the user of the requirements.
 * 
 * @function validateDescription
 * @returns {void}
 */
function validateDescription() {
    let input = document.getElementById('description');
    let description = input.value.trim();
    let descriptionPattern = /^.{3,200}$/;
    if (descriptionPattern.test(description)) {
        input.setCustomValidity(''); 
    } else {
        input.setCustomValidity('The description must be at least 3 characters long and max 200 characters long.');
    }
}

// Subtask Functions //

/**
 * Adds a new subtask to the current task.
 * 
 * This function retrieves the subtask title from the input field, creates a new subtask object,
 * adds it to the task's subtasks array, clears the input field, and re-renders the subtask list.
 * 
 * @function addSubTask
 * @returns {void}
 */
function addSubTask() {	
    let subTaskTitle = document.getElementById('editSubTasks').value;
    let id = new Date().getTime();
    let newSubTask = {
        completet: false,
        content: subTaskTitle,
        id: Number(id),
    };

    newTask.subTasks.push(newSubTask);

    document.getElementById('editSubTasks').value = '';

    renderSubtasksEdit(newTask.id);
}

/**
 * Renders the list of subtasks for the current task.
 * 
 * This function clears the current subtask list and iterates through the task's subtasks array,
 * generating HTML for each subtask and appending it to the subtask list element.
 * 
 * @function renderSubtasksEdit
 * @returns {void}
 */
function renderSubtasksEdit() {
    document.getElementById('editSubtasksList').innerHTML = ``;

    if (newTask['subTasks']) {
        for (let i = 0; i < newTask['subTasks'].length; i++) {
            let singleSubtask = newTask['subTasks'][i];
            document.getElementById('editSubtasksList').innerHTML += /*html*/ `
            <div class="subTaskEditRow" id="subTaskEditRow${singleSubtask['id']}">
                <div class="subTaskEditName" id="subTaskName${singleSubtask['id']}">&#10625 ${singleSubtask['content']}</div>
                <div class="subTaskEditRowRight">
                    <img class="editSubTaskEditImg" src="../assets/img/edit.svg" alt="" onclick="event.stopPropagation(), editEditSubTask(${singleSubtask['id']})">
                    <div class="editSubTaskSeparator"></div>
                    <img class="editSubTaskDeleteImg" src="../assets/img/delete.svg" alt="" onclick="event.stopPropagation(), deleteEditSubTask(${singleSubtask['id']})">
                </div>
            </div>
            `;
        }
    }
}

/**
 * Deletes a subtask from the current task.
 * 
 * This function finds the subtask in the task's subtasks array by its ID, removes it from the array,
 * and re-renders the subtask list. If the subtask is not found, an error message is logged.
 * 
 * @function deleteEditSubTask
 * @param {number} subTaskId - The ID of the subtask to delete.
 * @returns {void}
 */
function deleteEditSubTask(subTaskId) {
    let subTaskIndex = newTask.subTasks.findIndex(subTask => subTask.id === subTaskId);

    if (subTaskIndex !== -1) {
        newTask.subTasks.splice(subTaskIndex, 1);
    } else {
        console.log(`Subtask with id ${subTaskId} not found.`);
    }

    renderSubtasksEdit();
}

/**
 * Enables editing of a subtask's content.
 * 
 * This function replaces the subtask's display element with an input field preloaded with the
 * current content, allowing the user to rename the subtask. It also adds save and delete icons
 * for the user to confirm or cancel the edit.
 * 
 * @function editEditSubTask
 * @param {number} subTaskId - The ID of the subtask to edit.
 * @returns {void}
 */
function editEditSubTask(subTaskId) {
    let subTaskNameElement = document.getElementById(`subTaskName${subTaskId}`);
    if (!subTaskNameElement) {
        console.error(`Element mit ID subTaskName${subTaskId} nicht gefunden.`);
        return;
    }

    let preloadedValue = subTaskNameElement.innerHTML;
    
    let subTaskEditRowElement = document.getElementById(`subTaskEditRow${subTaskId}`);
    if (!subTaskEditRowElement) {
        console.error(`Element mit ID subTaskEditRow${subTaskId} nicht gefunden.`);
        return;
    }

    subTaskEditRowElement.innerHTML = /*html*/ `
        <div class="editSubTaskInputContainer">
            <input class="editSubTaskEditInput" id="editSubTaskInput${subTaskId}" type="text" minlength="5" maxlength="25" placeholder="Rename subtask">
            <div class="subTaskEditEditRowRight">
                <img class="editSubTaskEditImg" src="../assets/img/delete.svg" alt="" onclick="deleteEditSubTask(${subTaskId})">
                <div class="editSubTaskSeparator"></div>
                <img class="editSubTaskEditImg" src="../assets/img/checkEditTaskBright.svg" alt="" onclick="changeEditSubTaskContent(${subTaskId})">
            </div>
        </div>
    `;

    document.getElementById(`editSubTaskInput${subTaskId}`).value = preloadedValue.substring(2);
}

/**
 * Saves the edited content of a subtask.
 * 
 * This function retrieves the new content from the input field, updates the corresponding
 * subtask's content, and re-renders the subtask list. If the subtask is not found, an error
 * message is logged.
 * 
 * @function changeEditSubTaskContent
 * @param {number} subTaskId - The ID of the subtask to update.
 * @returns {void}
 */
function changeEditSubTaskContent(subTaskId) {
    let subTask = newTask.subTasks.find(subTask => subTask.id === subTaskId);

    if (subTask) {
        let newContent = document.getElementById(`editSubTaskInput${subTaskId}`).value;

        subTask.content = newContent;

        renderSubtasksEdit();
    } else {
        console.log(`Subtask with id ${subTaskId} not found.`);
    }
}

// Clear Task Function //
    
/**
 * Clears the input fields and resets task-related arrays and variables.
 * 
 * This function resets the values of the task input fields including title, description, due date,
 * and category. It also clears the subArray and assignedContacts arrays, and resets the priority variable.
 * 
 * @function clearTask
 * @returns {void}
 */
function clearTask() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("editDueDate").value = "";
    document.getElementById("category").value = "";
    subArray = [];
    assignedContacts = [];
    priority = "";
}

// Create Task //

async function createTask(event) {
    event.preventDefault(); 

    // render Tasks // ??
    await pushTask();
    showDialogAnimation();
    window.location.href = "board.html";
}

async function pushTask() {
    newTask.title = document.getElementById('title').value.trim();
    newTask.description = document.getElementById('description').value.trim();
    newTask.dueDate = document.getElementById('editDueDate').value;
    newTask.category = document.getElementById('category').value;

    newTask.assignedTo = assignedContacts; // Wie hole ich die Assigned To Kontakte??
    newTask.priority = newTask.priority || "medium"; // Falls keine Priorität gewählt wurde, Standardwert setzen
    newTask.subTasks = subArray; 
    newTask.status = "New"; 

    newTaskId = new Date().getTime();
    newTask.id = Number(newTaskId);

    tasks.push(newTask);

    await saveTasks();
}

/**
 * Applies and then removes an animation class to an element to show a dialog animation.
 * 
 * This function adds an animation class to the element with the ID 'addTaskAnimationText',
 * which triggers an animation effect. After a delay of 2000 milliseconds (2 seconds), 
 * the animation class is removed from the element to reset its state.
 * 
 * @function showDialogAnimation
 * @returns {void}
 */
function showDialogAnimation() {
    const showElement = document.getElementById('addTaskAnimationText');

    showElement.classList.add('addTaskAfterAnimationText');

    setTimeout(() => {
        showElement.classList.remove('addTaskAfterAnimationText');
    }, 2000);
}

//createTask(){
//werte aus inputfeldern mit .value in das newTask
//newTask gepusht in das tasks
//saveTasks() zurück in Firebase
//dialog animation
//anschließend weiterleiten zu boardseite
//fertig
//}

