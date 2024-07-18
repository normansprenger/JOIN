let userId = "";
let contactsData = {};
const userColors = [
  '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF',
  '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B',
];

async function initContacts() {
  await includeHTML();
  checkUser();
  fillUserInitials();
  loadContacts();
  await fetchContacts();
  chooseAddedUser();
}

async function fetchContacts() {
  try {
    await loadContacts();
    renderContacts(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
  }
}

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

function createContactDetailsHeader(contact) {
  return /*HTML*/ `
    <div class="contactDetailsHeader">
      <div class="shortNameContactDetails" style="background-color: ${contact.color};">
        <p class="initialsContactDetails">${contact.initials}</p>
      </div>
      <div class="ContactDetailsContainer">
        <h2>${contact.name}</h2>
        <div class="EditDeleteContainer">
          <div class="edit">
            <img src="../assets/img/edit.svg" alt="Edit">
            <p onclick="openEditContactPopUp(${contact.id})">Edit</p>  
          </div>
          <div class="delete">
            <img src="../assets/img/delete.svg" alt="Delete">
            <p onclick="deleteContact(${contact.id})">Delete</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

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
        <img src="../assets/img/more_vert.svg" alt="Menü">
      </div>
    </div>
  `;
}

function backToList() {
  document.querySelector(".listSection").style.display = "block";
  document.getElementById("contactDetailsSection").style.display = "none";
}

/* Edit Functions */

function createPopupContainer() {
  const popupContainer = document.createElement("div");
  popupContainer.id = "editContactPopup";
  popupContainer.className = "editPopUpContainer";
  return popupContainer;
}

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

function createCloseButtonDesktop() {
  return /*HTML*/ `
    <div class="popupCloseEditContactDesktop">
        <img class="closeEditContactPopUpDesktop" onclick="closeEditContactPopUp()" src="../assets/img/close_black.svg" alt="CloseEditContactPopUp">
    </div>
  `;
}

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

function createInputContainer(id, type, value, placeholder) {
  return /*HTML*/ `
    <div class="inputContainer">
        <label for="${id}"></label>
        <input class="EditContactInput" type="${type}" id="${id}" value="${value}" placeholder="${placeholder}" required>
    </div>
  `;
}

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

function closeEditContactPopUp() {
  const popup = document.getElementById("editContactPopup");
  if (popup) {
    popup.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 500);
  }
}

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

function createPopupContentFromContactMenu(id) {
  return /*HTML*/ `
    <div class="contactMenuPopupContent" onclick="event.stopPropagation()">
        ${createEditContactOption(id)}
        ${createDeleteContactOption(id)}
    </div>
  `;
}

function createEditContactOption(id) {
  return /*HTML*/ `
    <div class="editContact">
        <img src="../assets/img/edit.svg" alt="Edit">
        <p onclick="openEditContactPopUp(${id})">Edit</p>
    </div>
  `;
}

function createDeleteContactOption(id) {
  return /*HTML*/ `
    <div class="deleteContact">
        <img src="../assets/img/delete.svg" alt="Delete">
        <p onclick="deleteContact(${id})">Delete</p>                
    </div>
  `;
}

/* Add New Contact Functions */

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
    id: `${id}`,
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

function createPopupContainerFromAddContactPopUp() {
  const popupContainer = document.createElement("div");
  popupContainer.id = "addContactPopup";
  popupContainer.className = "popupContainer";
  return popupContainer;
}

function createPopupAnimationBackgroundFromAddContactPopUp() {
  return /*HTML*/ `
    <div class="popupAnimationBackground" onclick="closeAddContactPopUp()">
        ${createPopupContentFromAddContactPopUp()}
    </div>
  `;
}

function createPopupContentFromAddContactPopUp() {
  return /*HTML*/ `
    <div class="popupContent">
        ${createPopupContentTitleFromAddContactPopUp()}
        ${createPopupContentDetailsFromAddContactPopUp()}
    </div>
  `;
}

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

function createPopupContentDetailsFromAddContactPopUp() {
  return /*HTML*/ `
    <div class="popupContentAddContactDetails" onclick="event.stopPropagation()">
        ${createShortNameContainerFromAddContactPopUp()}
        ${createFormFromAddContactPopUp()}
    </div>
  `;
}

function createShortNameContainerFromAddContactPopUp() {
  return /*HTML*/ `
    <div class="ShortNameContainer">
        <div class="CreateContactShortName">
            <img class="AddContactPerson" src="../assets/img/person_white.svg" alt="AddContactPerson">
        </div>
    </div>
  `;
}

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

function createInputContainerFromAddContactPopUp(id, type, placeholder) {
  return /*HTML*/ `
    <div class="inputContainer">
        <label for="${id}"></label>
        <input class="CreateContactInput" type="${type}" id="${id}" placeholder="${placeholder}" required>
    </div>
  `;
}

function openAddContactPopUp() {
  const popupContainer = createPopupContainerFromAddContactPopUp();
  popupContainer.innerHTML = createPopupAnimationBackgroundFromAddContactPopUp();
  document.body.appendChild(popupContainer);

  setTimeout(() => {
    popupContainer.classList.add("show");
  }, 10);
}

function closeAddContactPopUp() {
  const popup = document.getElementById("addContactPopup");
  if (popup) {
    popup.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 500);
  }
}

async function createContact(event) {
  event.preventDefault();
  try {
    await pushContacts();
    renderContacts();
    closeAddContactPopUp();
    window.location.href = "contacts.html";
  } catch (error) {
    console.error("Fehler beim Erstellen des Kontakts:", error);
  }
}

function getInitials(name) {
  let words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  let initials =
    words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
  return initials;
}

function randomColor(colors) {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function chooseAddedUser() {
  userId = sessionStorage.getItem("userId");
  if (!userId == "") {
    document.getElementById(`UserId${userId}`).classList.add("selected");
    if (window.innerWidth > 1000) {
      toggleContactView(userId);
    }
    document
      .getElementById(`UserId${userId}`)
      .scrollIntoView({ behavior: "smooth", block: "start" });
    userId = "";
    sessionStorage.setItem("userId", userId);
  }
}