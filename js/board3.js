/**
 * Renders an edit input for a sub-task, allowing the user to modify its content.
 *
 * This function replaces the existing HTML of a sub-task's row with an input field where the user can rename the sub-task.
 * It also adds buttons for deleting or saving the changes to the sub-task. The current sub-task name is preloaded into the input field.
 *
 * @param {number|string} taskId - The unique identifier of the task that contains the sub-task to be edited.
 * @param {number|string} subTaskId - The unique identifier of the sub-task to be edited.
 * 
 * @returns {void}
 * 
 * @example
 * // Render the edit input for sub-task with ID 456 in the task with ID 123
 * editEditSubTask(123, 456);
 */
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


/**
 * Updates the content of a specific sub-task with new values provided by the user.
 *
 * This function finds the specified task and sub-task, then updates the sub-task's content based on the value entered by the user.
 * If the task or sub-task is not found, it logs an appropriate message to the console.
 * After updating the sub-task content, it re-renders the list of sub-tasks to reflect the changes.
 *
 * @param {number|string} taskId - The unique identifier of the task that contains the sub-task to be updated.
 * @param {number|string} subTaskId - The unique identifier of the sub-task to be updated.
 *
 * @returns {void}
 * 
 * @example
 * // Change the content of sub-task with ID 456 in the task with ID 123
 * changeEditSubTaskContent(123, 456);
 */
function changeEditSubTaskContent(taskId, subTaskId) {
    let task = tasks.find(task => task.id === taskId);
    if (task) {
        let subTask = task.subTasks.find(subTask => subTask.id === subTaskId);
        if (subTask) {
            let newContent = document.getElementById(`editSubTaskInput${subTaskId}`).value;
            subTask.content = newContent;
        } else {
            console.log(`Subtask with id ${subTaskId} not found.`);
        }
    } else {
        console.log(`Task with id ${taskId} not found.`);
    }
    renderSubtasksEdit(taskId);
}


/**
 * Adds a focus style to the specified input container by applying a CSS class.
 *
 * This function sets the border color of an input container to indicate that it is in focus.
 * It achieves this by adding the `inputContainerFocus` CSS class to the element with the given ID.
 *
 * @param {string} inputContainerId - The ID of the input container element to which the focus style should be applied.
 */
function setInputContainerBorderColor(inputContainerId) {
    document.getElementById(`${inputContainerId}`).classList.add('inputContainerFocus');
}


/**
 * Adds a CSS class to the specified input container element to apply a focus style.
 *
 * This function modifies the appearance of the input container by adding the `inputContainerFocus` 
 * class to the element with the provided ID. This is typically used to visually indicate focus or 
 * active state for user input elements.
 *
 * @param {string} inputContainerId - The ID of the input container element to which the CSS class will be added.
 *
 * @returns {void}
 *
 * @example
 * // Add focus style to the input container with ID 'usernameInputContainer'
 * setInputContainerBorderColor('usernameInputContainer');
 */
function setInputContainerBorderColor(inputContainerId) {
    document.getElementById(`${inputContainerId}`).classList.add('inputContainerFocus');
}


/**
 * Removes the CSS class from the specified input container element to reset its border color.
 *
 * This function removes the `inputContainerFocus` class from the element with the provided ID, 
 * which typically resets the visual indication of focus or active state for user input elements.
 *
 * @param {string} inputContainerId - The ID of the input container element from which the CSS class will be removed.
 *
 * @returns {void}
 *
 * @example
 * // Remove focus style from the input container with ID 'usernameInputContainer'
 * resetInputContainerBorderColor('usernameInputContainer');
 */
function resetInputContainerBorderColor(inputContainerId) {
    document.getElementById(`${inputContainerId}`).classList.remove('inputContainerFocus');
}


/**
 * Validates the title input field to ensure it meets specified length requirements.
 *
 * This function checks the value of the input field with ID 'editTitle'. The title must be 
 * at least 3 characters long and no more than 40 characters. If the title is valid, any 
 * previous custom validity message is cleared. If the title is invalid, a custom validity 
 * message is set, which will be used by form validation to inform the user.
 *
 * @returns {void}
 *
 * @example
 * // Call the function to validate the title input field
 * validateTitle();
 */
function validateTitle() {
    let input = document.getElementById('editTitle');
    let title = input.value.trim();
    let titlePattern = /^.{3,40}$/;
    if (titlePattern.test(title)) {
        input.setCustomValidity(''); // Gültiger Titel, keine Fehlermeldung
    } else {
        input.setCustomValidity('The title must be at least 3 characters long and max 40 characters long.');
    }
}


/**
 * Validates the description input field to ensure it meets specified length requirements.
 *
 * This function checks the value of the input field with ID 'editDescription'. The description 
 * must be at least 3 characters long and no more than 200 characters. If the description is 
 * valid, any previous custom validity message is cleared. If the description is invalid, a custom 
 * validity message is set, which will be used by form validation to inform the user.
 *
 * @returns {void}
 *
 * @example
 * // Call the function to validate the description input field
 * validateDescription();
 */
function validateDescription() {
    let input = document.getElementById('editDescription');
    let description = input.value.trim();
    let descriptionPattern = /^.{3,200}$/;
    if (descriptionPattern.test(description)) {
        input.setCustomValidity(''); // Gültiger Titel, keine Fehlermeldung
    } else {
        input.setCustomValidity('The title must be at least 3 characters long and max 200 characters long.');
    }
}

