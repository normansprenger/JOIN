let userId = "";
let contactsData = {};
const userColors = [
  '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF',
  '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B',
];

/**
 * Initializes the contacts by including HTML, checking the user,
 * filling user initials, loading contacts, fetching contacts, 
 * and choosing the added user.
 * @async
 * @function initContacts
 * @returns {Promise<void>}
 */
async function initContacts() {
  await includeHTML();
  checkUser();
  fillUserInitials();
  loadContacts();
  await fetchContacts();
  chooseAddedUser();
}

/**
 * Fetches contacts, loads them, and renders them.
 * If an error occurs during fetching, it logs the error to the console.
 * @async
 * @function fetchContacts
 * @returns {Promise<void>}
 */
async function fetchContacts() {
  try {
    await loadContacts();
    renderContacts(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
  }
}

/**
 * Updates a contact's information based on the input fields, saves the contacts,
 * re-renders the contacts, closes the edit contact pop-up, and toggles the contact view.
 * @async
 * @function updateContact
 * @param {Event} event - The event triggered by submitting the contact update form.
 * @param {number} id - The ID of the contact to be updated.
 * @returns {Promise<void>}
 */
async function updateContact(event, id) {
  event.preventDefault();

  const name = document.getElementById("editFullName").value;
  const email = document.getElementById("editMail").value;
  const phone = document.getElementById("editTelNumber").value;

  contactsData[id].name = name;
  contactsData[id].email = email;
  contactsData[id].phone = phone;

  await saveContacts();
  renderContacts(contactsData);
  closeEditContactPopUp();
  toggleContactView(id);
}

/**
 * Deletes a contact by its ID, saves the updated contacts, fetches the contacts,
 * and reloads the page. Logs an error if the contact with the given ID is not found.
 * @async
 * @function deleteContact
 * @param {number} id - The ID of the contact to be deleted.
 * @returns {Promise<void>}
 */
async function deleteContact(id) {
  if (contactsData[id]) {
    delete contactsData[id];

    contacts = Object.values(contactsData);

    await saveContacts();
    fetchContacts();
    location.reload();
  } else {
    console.error(`Contact with id ${id} not found`);
  }
}

/* render Functions */

/**
 * Renders the contacts list on the page.
 * 
 * @param {Object} data - The contact data, where each key is a contact ID and each value is a contact object.
 * @property {string} data[].id - The ID of the contact.
 * @property {string} data[].name - The name of the contact.
 * @property {string} data[].email - The email of the contact.
 * @property {string} data[].color - The background color for the contact's initials.
 * @property {string} data[].initials - The initials of the contact.
 */
function renderContacts(data) {
  contactsData = {};

  const contactList = document.getElementById("contactList");
  contactList.innerHTML = "";

  const contactsArray = Object.values(data);
  contactsArray.sort((a, b) => a.name.localeCompare(b.name));

  let currentLetter = "";

  contactsArray.forEach((contact) => {
    contactsData[contact.id] = contact;

    const firstLetter = contact.name.charAt(0).toUpperCase();

    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;

      const letterHeader = document.createElement("div");
      letterHeader.className = "letterHeader";
      letterHeader.innerHTML = /*HTML*/ `
                <h2>${currentLetter}</h2>
                <hr>`;
      contactList.appendChild(letterHeader);
    }

    const contactElement = document.createElement("div");
    contactElement.className = "contactItem";
    contactElement.id = `UserId${contact.id}`;
    contactElement.setAttribute("onclick", `toggleContactView(${contact.id})`);
    contactElement.innerHTML = /*HTML*/ `
            <div class="shortName" style="background-color: ${contact.color};">
                <span class="initials">${contact.initials}</span>
            </div>
            <div class="contactDetails">
                <h3>${contact.name}</h3>
                <p>${contact.email}</p>
            </div>
        `;
    contactList.appendChild(contactElement);
  });
}

/**
 * Toggles the detailed view of a contact when clicked.
 * 
 * @param {number} id - The ID of the contact to display.
 */
function toggleContactView(id) {
  const contact = contactsData[id];

  if (!contact) {
    console.error(`Contact with ID ${id} not found`);
    return;
  }

  const contactItems = document.querySelectorAll(".contactItem");
  contactItems.forEach((item) => {
    item.classList.remove("selected");
  });

  const selectedContactElement = document.querySelector(
    `.contactItem[onclick="toggleContactView(${id})"]`
  );
  if (selectedContactElement) {
    selectedContactElement.classList.add("selected");
  }

  const contactDetailsSection = document.getElementById(
    "contactDetailsSection"
  );

  const existingContactDetails = document.getElementById(
    "dynamicContactDetails"
  );
  if (existingContactDetails) {
    contactDetailsSection.removeChild(existingContactDetails);
  }

  const contactDetailsContainer = document.createElement("div");
  contactDetailsContainer.id = "dynamicContactDetails";

  contactDetailsContainer.innerHTML =
    createContactDetailsHeader(contact) + createContactDetailsBody(contact);

  contactDetailsSection.appendChild(contactDetailsContainer);

  if (window.innerWidth <= 1000) {
    document.querySelector(".listSection").style.display = "none";
    contactDetailsSection.style.display = "block";
  }
}

/**
 * Creates the header HTML for the contact details view.
 * 
 * @param {Object} contact - The contact object.
 * @property {string} contact.id - The ID of the contact.
 * @property {string} contact.name - The name of the contact.
 * @property {string} contact.color - The background color for the contact's initials.
 * @property {string} contact.initials - The initials of the contact.
 * @returns {string} The HTML string for the contact details header.
 */
function createContactDetailsHeader(contact) {
  return /*HTML*/ `
    <div class="contactDetailsHeader">
      <div class="shortNameContactDetails" style="background-color: ${contact.color};">
        <p class="initialsContactDetails">${contact.initials}</p>
      </div>
      <div class="ContactDetailsContainer">
        <h2>${contact.name}</h2>
        <div class="EditDeleteContainer">
          <div class="edit" onclick="openEditContactPopUp(${contact.id})">
            <img src="../assets/img/edit.svg" alt="Edit">
            <p>Edit</p>  
          </div>
          <div class="delete" onclick="deleteContact(${contact.id})">
            <img src="../assets/img/delete.svg" alt="Delete">
            <p>Delete</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Creates the body HTML for the contact details view.
 * 
 * @param {Object} contact - The contact object.
 * @property {string} contact.email - The email of the contact.
 * @property {string} contact.phone - The phone number of the contact.
 * @returns {string} The HTML string for the contact details body.
 */
function createContactDetailsBody(contact) {
  return /*HTML*/ `
    <div class="contactDetailsBodyContainer">
      <h3>Contact Information</h3>
      <div class="contactDetailsBodyEmailContainer">
        <p>Email:</p>
        <p class="contactDetailsBodyEmail">${contact.email}</p>
      </div>
      <div class="contactDetailsBodyPhoneContainer">
        <p>Phone:</p>
        <p class="contactDetailsBodyPhone">${contact.phone || "N/A"}</p>
      </div>
      <img src="../assets/img/arrowLeft.svg" alt="Back" class="backButton" onclick="backToList()">
      <div class="ContactMenu" id="ContactMenu" onclick="openContactMenu(${contact.id})">
        <img src="../assets/img/more_vert.svg" alt="Menu">
      </div>
    </div>
  `;
}

/**
 * Switches the view back to the contacts list.
 */
function backToList() {
  document.querySelector(".listSection").style.display = "block";
  document.getElementById("contactDetailsSection").style.display = "none";
}

/* Edit Functions */

/**
 * Creates the container element for the edit contact popup.
 * 
 * @returns {HTMLDivElement} The div element for the popup container.
 */
function createPopupContainer() {
  const popupContainer = document.createElement("div");
  popupContainer.id = "editContactPopup";
  popupContainer.className = "editPopUpContainer";
  return popupContainer;
}

/**
 * Creates the title section for the edit contact popup.
 * 
 * @returns {string} The HTML string for the popup title.
 */
function createPopupTitle() {
  return /*HTML*/ `
    <div class="popupContentEditContactTitle" onclick="event.stopPropagation()"> 
        <div class="popupCloseEditContactMobile">
            <img class="closeEditContactPopUpMobile" onclick="closeEditContactPopUp()" src="../assets/img/close.svg" alt="CloseEditContactPopUp">
        </div> 
        <h1>Edit contact</h1>
        <div class="SeperatorLineContentPopUp"></div>
    </div>
  `;
}

/**
 * Creates the short name container for the edit contact popup.
 * 
 * @param {Object} contact - The contact object.
 * @property {string} contact.color - The background color for the contact's initials.
 * @property {string} contact.initials - The initials of the contact.
 * @returns {string} The HTML string for the short name container.
 */
function createShortNameContainer(contact) {
  return /*HTML*/ `
    <div class="ShortNameContainer">
        <div class="EditContactShortName">
          <div class="shortNameEditContact" style="background-color: ${contact.color};">
              <span class="initials">${contact.initials}</span>
          </div>
        </div>
    </div>
  `;
}

/**
 * Creates the close button for the desktop view of the edit contact popup.
 * 
 * @returns {string} The HTML string for the close button.
 */
function createCloseButtonDesktop() {
  return /*HTML*/ `
    <div class="popupCloseEditContactDesktop">
        <img class="closeEditContactPopUpDesktop" onclick="closeEditContactPopUp()" src="../assets/img/close_black.svg" alt="CloseEditContactPopUp">
    </div>
  `;
}

/**
 * Creates the form for editing the contact.
 * 
 * @param {Object} contact - The contact object.
 * @property {string} contact.id - The ID of the contact.
 * @property {string} contact.name - The name of the contact.
 * @property {string} contact.email - The email of the contact.
 * @property {string} contact.phone - The phone number of the contact.
 * @returns {string} The HTML string for the form.
 */
function createForm(contact) {
  return /*HTML*/ `
    <form class="DialogEditContactForm" onsubmit="updateContact(event, ${contact.id})">
        ${createInputContainer('editFullName', 'text', contact.name, 'Name')}
        ${createInputContainer('editMail', 'email', contact.email, 'Email')}
        ${createInputContainer('editTelNumber', 'tel', contact.phone || '', 'Phone')}

        <div class="ContactButtonContainer">
            <button class="DeleteContactButton" onclick="deleteContact(${contact.id})">Delete</button>
            <button type="submit" class="UpdateContactButton">Save<img src="../assets/img/check.svg" alt="Check"></button>
        </div>
    </form>
  `;
}

/**
 * Creates the content for the edit contact popup.
 * 
 * @param {Object} contact - The contact object.
 * @returns {string} The HTML string for the popup content.
 */
function createPopupContent(contact) {
  return /*HTML*/ `
    <div class="editPopUpContent" onclick="closeEditContactPopUp()">
        ${createPopupTitle()}
        <div class="popupContentEditContactDetails" onclick="event.stopPropagation()">
            ${createShortNameContainer(contact)}
            <div class="DialogAddEdit">
                ${createCloseButtonDesktop()}
                ${createForm(contact)}
            </div>
        </div> 
    </div>
  `;
}

/**
 * Creates an input container for the form in the edit contact popup.
 * 
 * @param {string} id - The ID of the input element.
 * @param {string} type - The type of the input element.
 * @param {string} value - The value of the input element.
 * @param {string} placeholder - The placeholder text for the input element.
 * @returns {string} The HTML string for the input container.
 */
function createInputContainer(id, type, value, placeholder) {
  return /*HTML*/ `
    <div class="inputContainer">
        <label for="${id}"></label>
        <input class="EditContactInput" type="${type}" id="${id}" value="${value}" placeholder="${placeholder}" required>
    </div>
  `;
}

/**
 * Opens the edit contact popup.
 * 
 * @param {number} id - The ID of the contact to edit.
 */
function openEditContactPopUp(id) {
  const contact = contactsData[id];

  if (!contact) {
    console.error(`Contact with ID ${id} not found`);
    return;
  }

  const popupContainer = createPopupContainer();
  popupContainer.innerHTML = createPopupContent(contact);
  document.body.appendChild(popupContainer);

  setTimeout(() => {
    popupContainer.classList.add("show");
  }, 10);
}

/**
 * Closes the edit contact popup.
 */
function closeEditContactPopUp() {
  const popup = document.getElementById("editContactPopup");
  if (popup) {
    popup.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 500);
  }
}

/**
 * Opens the contact menu popup for a contact.
 * 
 * @param {number} id - The ID of the contact.
 */
function openContactMenu(id) {
  const contact = contactsData[id];
  const popup = document.createElement("div");
  popup.className = "contactMenuPopup";
  popup.style.position = "fixed";
  popup.innerHTML = createPopupContentFromContactMenu(id);

  const popupContainer = createPopupContainerFromContactMenu();
  popupContainer.appendChild(popup);
  document.body.appendChild(popupContainer);

  if (window.innerWidth <= 1000) {
    popup.style.animation = "slideIn 0.2s ease forwards";
  }

  popupContainer.onclick = function () {
    popup.style.animation = "slideOut 0.2s ease forwards";
    setTimeout(() => {
      document.body.removeChild(popupContainer);
    }, 300);
  };
}

/**
 * Creates the container for the contact menu popup.
 * 
 * @returns {HTMLDivElement} The div element for the popup container.
 */
function createPopupContainerFromContactMenu() {
  const popupContainer = document.createElement("div");
  popupContainer.style.position = "fixed";
  popupContainer.style.top = 0;
  popupContainer.style.left = 0;
  popupContainer.style.width = "100%";
  popupContainer.style.height = "100%";
  popupContainer.style.zIndex = 1000;
  return popupContainer;
}

/**
 * Creates the content for the contact menu popup.
 * 
 * @param {number} id - The ID of the contact.
 * @returns {string} The HTML string for the popup content.
 */
function createPopupContentFromContactMenu(id) {
  return /*HTML*/ `
    <div class="contactMenuPopupContent" onclick="event.stopPropagation()">
        ${createEditContactOption(id)}
        ${createDeleteContactOption(id)}
    </div>
  `;
}

/**
 * Creates the edit contact option in the contact menu popup.
 * 
 * @param {number} id - The ID of the contact.
 * @returns {string} The HTML string for the edit contact option.
 */
function createEditContactOption(id) {
  return /*HTML*/ `
    <div class="editContact" onclick="openEditContactPopUp(${id})">
        <img src="../assets/img/edit.svg" alt="Edit">
        <p>Edit</p>
    </div>
  `;
}

/**
 * Creates the delete contact option in the contact menu popup.
 * 
 * @param {number} id - The ID of the contact.
 * @returns {string} The HTML string for the delete contact option.
 */
function createDeleteContactOption(id) {
  return /*HTML*/ `
    <div class="deleteContact" onclick="deleteContact(${id})">
        <img src="../assets/img/delete.svg" alt="Delete">
        <p>Delete</p>                
    </div>
  `;
}

/* Add New Contact Functions */

/**
 * Adds a new contact to the contact list and saves it.
 * 
 * @async
 * @returns {Promise<void>}
 */
async function pushContacts() {
  let name = document.getElementById("fullName").value;
  let email = document.getElementById("mail").value;
  let phone = document.getElementById("telNumber").value;
  let initials = getInitials(name);
  let color = randomColor(userColors);
  let id = new Date().getTime();
  let contact = {
    color: `${color}`,
    email: `${email}`,
    id: Number(id),
    initials: `${initials}`,
    name: `${name}`,
    phone: `${phone}`,
  };
  userId = id;
  sessionStorage.setItem("userId", userId);
  contacts.push(contact);
  await saveContacts();
  location.reload();
}

/**
 * Creates the container element for the add contact popup.
 * 
 * @returns {HTMLDivElement} The div element for the popup container.
 */
function createPopupContainerFromAddContactPopUp() {
  const popupContainer = document.createElement("div");
  popupContainer.id = "addContactPopup";
  popupContainer.className = "popupContainer";
  return popupContainer;
}

/**
 * Creates the animation background for the add contact popup.
 * 
 * @returns {string} The HTML string for the animation background.
 */
function createPopupAnimationBackgroundFromAddContactPopUp() {
  return /*HTML*/ `
    <div class="popupAnimationBackground" onclick="closeAddContactPopUp()">
        ${createPopupContentFromAddContactPopUp()}
    </div>
  `;
}

/**
 * Creates the content for the add contact popup.
 * 
 * @returns {string} The HTML string for the popup content.
 */
function createPopupContentFromAddContactPopUp() {
  return /*HTML*/ `
    <div class="popupContent">
        ${createPopupContentTitleFromAddContactPopUp()}
        ${createPopupContentDetailsFromAddContactPopUp()}
    </div>
  `;
}

/**
 * Creates the title section for the add contact popup.
 * 
 * @returns {string} The HTML string for the popup title.
 */
function createPopupContentTitleFromAddContactPopUp() {
  return /*HTML*/ `
    <div class="popupContentAddContactTitle" onclick="event.stopPropagation()"> 
        <div class="popupCloseAddContactMobile">
            <img class="closeAddContactPopUpMobile" onclick="closeAddContactPopUp()" src="../assets/img/close.svg" alt="CloseAddContactPopUp">
        </div>
        <div class="logoAddContactPopUpDesktop">
            <img src="../assets/img/logoBright.svg" alt="Join Logo">
        </div>   
        <h1>Add contact</h1>
        <p>Tasks are better with a team!</p>
        <div class="SeperatorLineContentPopUp"></div>
    </div>
  `;
}

/**
 * Creates the details section for the add contact popup.
 * 
 * @returns {string} The HTML string for the popup details.
 */
function createPopupContentDetailsFromAddContactPopUp() {
  return /*HTML*/ `
    <div class="popupContentAddContactDetails" onclick="event.stopPropagation()">
        ${createShortNameContainerFromAddContactPopUp()}
        ${createFormFromAddContactPopUp()}
    </div>
  `;
}

/**
 * Creates the short name container for the add contact popup.
 * 
 * @returns {string} The HTML string for the short name container.
 */
function createShortNameContainerFromAddContactPopUp() {
  return /*HTML*/ `
    <div class="ShortNameContainer">
        <div class="CreateContactShortName">
            <img class="AddContactPerson" src="../assets/img/person_white.svg" alt="AddContactPerson">
        </div>
    </div>
  `;
}

/**
 * Creates the form content for the add contact popup.
 * 
 * @returns {string} The HTML string for the form content.
 */
function createFormFromAddContactPopUp() {
  return /*HTML*/ `
    <div class="DialogAddEdit">
        <div class="popupCloseAddContactDesktop">
            <img class="closeAddContactPopUpDesktop" onclick="closeAddContactPopUp()" src="../assets/img/close_black.svg" alt="CloseAddContactPopUp">
        </div>

        <form class="DialogAddEditForm" onsubmit="createContact(event)">
            ${createInputContainerFromAddContactPopUp('fullName', 'text', 'Name')}
            ${createInputContainerFromAddContactPopUp('mail', 'email', 'Email')}
            ${createInputContainerFromAddContactPopUp('telNumber', 'tel', 'Phone')}

            <div class="ContactButtonContainer">
                <button type="button" class="CancelContactButton" onclick="closeAddContactPopUp()">Cancel<img src="../assets/img/close_black.svg" alt="CloseAddContactPopUp"></button>
                <button type="submit" class="CreateContactButton">Create contact<img src="../assets/img/check.svg" alt="Check"></button>
            </div>
        </form>
    </div>
  `;
}

/**
 * Creates an input container for the add contact popup form.
 * 
 * @param {string} id - The id of the input element.
 * @param {string} type - The type of the input element.
 * @param {string} placeholder - The placeholder text for the input element.
 * @returns {string} The HTML string for the input container.
 */
function createInputContainerFromAddContactPopUp(id, type, placeholder) {
  return /*HTML*/ `
    <div class="inputContainer">
        <label for="${id}"></label>
        <input class="CreateContactInput" type="${type}" id="${id}" placeholder="${placeholder}" required>
    </div>
  `;
}

/**
 * Opens the add contact popup.
 */
function openAddContactPopUp() {
  const popupContainer = createPopupContainerFromAddContactPopUp();
  popupContainer.innerHTML = createPopupAnimationBackgroundFromAddContactPopUp();
  document.body.appendChild(popupContainer);

  setTimeout(() => {
    popupContainer.classList.add("show");
  }, 10);
}

/**
 * Closes the add contact popup.
 */
function closeAddContactPopUp() {
  const popup = document.getElementById("addContactPopup");
  if (popup) {
    popup.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 500);
  }
}

/**
 * Creates a new contact and handles form submission.
 * 
 * @param {Event} event - The form submission event.
 * @async
 * @returns {Promise<void>}
 */
async function createContact(event) {
  event.preventDefault();
  try {
    await pushContacts();
    renderContacts();
    closeAddContactPopUp();
    renderContacts();
    window.location.href = "contacts.html";
  } catch (error) {
    console.error("Error creating contact:", error);
  }
}

/**
 * Gets the initials from a given name.
 * 
 * @param {string} name - The full name of the contact.
 * @returns {string} The initials of the contact.
 */
function getInitials(name) {
  let words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  let initials =
    words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
  return initials;
}

/**
 * Chooses a random color from an array of colors.
 * 
 * @param {string[]} colors - An array of color strings.
 * @returns {string} A random color from the array.
 */
function randomColor(colors) {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

/**
 * Highlights the newly added user in the contact list.
 */
function chooseAddedUser() {
  userId = sessionStorage.getItem("userId");
  if (userId) {
    document.getElementById(`UserId${userId}`).classList.add("selected");
    if (window.innerWidth > 1000) {
      toggleContactView(userId);
    }
    document
      .getElementById(`UserId${userId}`)
      .scrollIntoView({ behavior: "smooth", block: "start" });
    userId = "";
    sessionStorage.setItem("userId", userId);
    showAddedMessage();
  }
}

/**
 * Displays a message indicating a user was added.
 */
function showAddedMessage() {
  const mobileElement = document.getElementById('userAddedTextMobile');
  const desktopElement = document.getElementById('userAddedTextDesktop');

  if (window.innerWidth <= 1000) {
    mobileElement.classList.add('userAddedTextAfterMobile');
    setTimeout(() => {
      mobileElement.classList.remove('userAddedTextAfterMobile');
    }, 2100);
  } else {
    desktopElement.classList.add('userAddedTextAfterDesktop');
    setTimeout(() => {
      desktopElement.classList.remove('userAddedTextAfterDesktop');
    }, 2100);
  }
}