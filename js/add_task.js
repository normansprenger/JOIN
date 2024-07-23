let assignetTo = document.getElementById("assignedTo");
let category = document.getElementById("category");
let priority;
let subArray = [];
let assignedContacts = [];

async function initAddTask() {
    changePriority(medium);
    renderContactsInAddTasks();
  }

async function renderContactsInAddTasks() {
    await loadContacts();

    const selectElement = document.getElementById('assignedTo');
    
    const firstOption = selectElement.options[0];
    selectElement.innerHTML = '';
    selectElement.appendChild(firstOption);
    
    contacts.forEach(contact => {
        const option = document.createElement('option');
        option.value = contact.id; 
        option.textContent = contact.name; 
        selectElement.appendChild(option);
    });
}

// Prio Button Color function //

function addPrioButtonColor(prio, event) {
    event.preventDefault();
    let buttonUrgent = document.getElementById("buttonUrgent");
    let buttonMedium = document.getElementById("buttonMedium");
    let buttonLow = document.getElementById("buttonLow");
    let imgUrgent = document.getElementById("buttonImg1");
    let imgMedium = document.getElementById("buttonImg2");
    let imgLow = document.getElementById("buttonImg3");
    removeClasses(buttonUrgent, buttonMedium, buttonLow, imgUrgent, imgMedium, imgLow);
    if (prio === "urgent") {
        selectedButtonColor(buttonUrgent, imgUrgent, "backgroundColorRed", "urgent");
    } else if (prio === "medium") {
        selectedButtonColor(buttonMedium, imgMedium, "backgroundColorOrange", "medium");
    } else if (prio === "low") {
        selectedButtonColor(buttonLow, imgLow, "backgroundColorGreen", "low");
    }
}

function removeClasses(buttonUrgent, buttonMedium, buttonLow, imgUrgent, imgMedium, imgLow) {
    buttonUrgent.classList.remove("backgroundColorRed", "buttonPrioWhite");
    buttonMedium.classList.remove("backgroundColorOrange", "buttonPrioWhite");
    buttonLow.classList.remove("backgroundColorGreen", "buttonPrioWhite");
    imgUrgent.src = "../assets/img/addTaskUrgentLogo.svg";
    imgMedium.src = "../assets/img/addTaskMediumLogo.svg";
    imgLow.src = "../assets/img/addTaskLowLogo.svg";
}

function selectedButtonColor(button, img, colorClass, priority) {
    button.classList.add(colorClass, "buttonPrioWhite");
    img.src = `../assets/img/addTask${capitalizeFirstLetter(priority)}LogoWhite.svg`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function ButtonMediumInOrange() {
    let buttonMedium = document.getElementById("buttonMedium");
    let imgMedium = document.getElementById("buttonImg2");
    buttonMedium.classList.add("backgroundColorOrange", "buttonPrioWhite");
    imgMedium.src = "../assets/img/addTaskMediumLogoWhite.svg";
}

// Kalender min = Tagesdatum //

function setEditDueDateMinDate(){
    // Get today's date
    let today = new Date();

    // Format the date to YYYY-MM-DD
    let yyyy = today.getFullYear();
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    let dd = String(today.getDate()).padStart(2, '0');
    let formattedDate = yyyy + '-' + mm + '-' + dd;

    // Set the min attribute of the date input
    document.getElementById('editDueDate').setAttribute('min', formattedDate);
}

// Call the function to set the min date when the page loads
window.onload = setEditDueDateMinDate;