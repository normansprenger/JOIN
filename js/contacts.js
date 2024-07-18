let contactsData = {};
const userColors = [
  '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF',
  '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B',
];

async function initContacts(){
  await includeHTML();
  loadContacts();
  fetchContacts();
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

  const name = document.getElementById('editFullName').value;
  const email = document.getElementById('editMail').value;
  const phone = document.getElementById('editTelNumber').value;

  contactsData[id].name = name;
  contactsData[id].email = email;
  contactsData[id].phone = phone;

  await saveContacts();
  renderContacts(contactsData);
  closeEditContactPopUp();
}

async function deleteContact(id) {
  console.log(`Delete contact with id ${id}`);

  // Finde den Kontakt im contactsData-Objekt und entferne ihn
  if (contactsData[id]) {
      delete contactsData[id]; 

      // Aktualisiere das contacts-Array, um den gelöschten Kontakt zu entfernen
      contacts = Object.values(contactsData); // Konvertiere das Objekt zurück zu einem Array

      await saveContacts(); 
      fetchContacts(); 
  } else {
      console.error(`Contact with id ${id} not found`);
  }
}

/* render functions */

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
      letterHeader.innerHTML = `
                <h2>${currentLetter}</h2>
                <hr>
            `;
      contactList.appendChild(letterHeader);
    }

    const contactElement = document.createElement("div");
    contactElement.className = "contactItem";
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

  contactDetailsContainer.innerHTML = /*HTML*/ `
    <div class="contactDetailsHeader">
      <div class="shortNameContactDetails" style="background-color: ${
        contact.color
      };">
        <p class="initialsContactDetails">${contact.initials}</p>
      </div>
      <div class="ContactDetailsContainer">
        <h2>${contact.name}</h2>
        <div class="EditDeleteContainer">
          <div class="edit">
            <img src="../assets/img/edit.svg" alt="Edit">
            <p onclick="openEditContactPopUp(${id})">Edit</p>  
          </div>
          <div class="delete">
            <img src="../assets/img/delete.svg" alt="Delete">
            <p onclick="deleteContact(${id})">Delete</p>
          </div>
        </div>
      </div>
    </div>
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
      <div class="ContactMenu" id="ContactMenu" onclick="openContactMenu(${id})">
        <img src="../assets/img/more_vert.svg" alt="Menü">
      </div>
    </div>
  `;

  contactDetailsSection.appendChild(contactDetailsContainer);

  if (window.innerWidth <= 1000) {
    document.querySelector(".listSection").style.display = "none";
    contactDetailsSection.style.display = "block";
  }
}
 
function backToList() {
  document.querySelector(".listSection").style.display = "block";
  document.getElementById("contactDetailsSection").style.display = "none";
}

/* Edit Functions */

function openEditContactPopUp(id) {
  const contact = contactsData[id];
  
  if (!contact) {
    console.error(`Contact with ID ${id} not found`);
    return;
  }

  const popupContainer = document.createElement("div");
  popupContainer.id = "editContactPopup";
  popupContainer.className = "editPopUpContainer";
  popupContainer.innerHTML = /*HTML*/ `
        <div class="editPopUpContent" onclick="closeEditContactPopUp()">
            <div class="popupContentEditContactTitle" onclick="event.stopPropagation()"> 
                <div class="popupCloseEditContactMobile">
                    <img class="closeEditContactPopUpMobile" onclick="closeEditContactPopUp()" src="../assets/img/close.svg" alt="CloseEditContactPopUp">
                </div> 
                <h1>Edit contact</h1>
                <div class="SeperatorLineContentPopUp"></div>
            </div>
            
            <div class="popupContentEditContactDetails" onclick="event.stopPropagation()">
                <div class="ShortNameContainer">
                    <div class="EditContactShortName">
                      <div class="shortNameEditContact" style="background-color: ${contact.color};">
                          <span class="initials">${contact.initials}</span>
                      </div>
                    </div>
                </div>

                <div class="DialogAddEdit">
                    <div class="popupCloseEditContactDesktop">
                      <img class="closeEditContactPopUpDesktop" onclick="closeEditContactPopUp()" src="../assets/img/close_black.svg" alt="CloseEditContactPopUp">
                    </div>

                    <form class="DialogEditContactForm" onsubmit="updateContact(event, ${id})">
                        <div class="inputContainer">
                            <label for="editFullName"></label>
                            <input class="EditContactInput" type="text" id="editFullName" value="${contact.name}" placeholder="Name" required>
                        </div>

                        <div class="inputContainer">
                            <label for="editMail"></label>
                            <input class="EditContactInput" type="email" id="editMail" value="${contact.email}" placeholder="Email" required>
                        </div>
                        
                        <div class="inputContainer">
                            <label for="editTelNumber"></label>
                            <input class="EditContactInput" type="tel" id="editTelNumber" value="${contact.phone || ''}" placeholder="Phone" required>
                        </div>

                        <div class="ContactButtonContainer">
                            <button class="DeleteContactButton" onclick="deleteContact(${id})">Delete</button>
                            <button type="submit" class="UpdateContactButton">Save<img src="../assets/img/check.svg" alt="Check"></button>
                        </div>
                    </form>
                </div>
            </div> 
        </div>
    `;
  document.body.appendChild(popupContainer);
  
  setTimeout(() => {
    popupContainer.classList.add('show');
}, 10);
}

function closeEditContactPopUp() {
const popup = document.getElementById("editContactPopup");
if (popup) {
  popup.classList.remove('show');
  setTimeout(() => {
    document.body.removeChild(popup);
  }, 500);
}
}

function openContactMenu(id) {
  const contact = contactsData[id];

  if (!contact) {
    console.error(`Contact with ID ${id} not found`);
    return;
  }

  const popup = document.createElement("div");
  popup.className = "contactMenuPopup";

  popup.innerHTML = /*HTML*/ `
    <div class="contactMenuPopupContent">
      <div class="editContact">
          <img src="../assets/img/edit.svg" alt="Edit">
          <p onclick="openEditContactPopUp(${id})">Edit</p>
      </div>
      <div class="deleteContact">
          <img src="../assets/img/delete.svg" alt="Delete">
          <p onclick="deleteContact(${id})">Delete</p>                
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  if (window.innerWidth <= 1000) {
    popup.style.animation = "slideIn 0.2s ease forwards";
  }
}
/* Add New Contact Functions / NEUEN KONTAKT HINZUFÜGEN! */

async function pushContacts() {
  let name = document.getElementById('fullName').value;
  let email = document.getElementById('mail').value;
  let phone = document.getElementById('telNumber').value;
  let initials = getInitials(name);
  let color = randomColor(userColors);
  let id = new Date().getTime();
  let contact = {
      'color': `${color}`,
      'email': `${email}`,
      'id': `${id}`,
      'initials': `${initials}`,
      'name': `${name}`,
      'phone': `${phone}`
  };

  contacts.push(contact); 
  await saveContacts(); 
}

function openAddContactPopUp() {
  const popupContainer = document.createElement("div");
  popupContainer.id = "addContactPopup";
  popupContainer.className = "popupContainer";
  popupContainer.innerHTML = /*HTML*/ `
      <div class="popupAnimationBackground" onclick="closeAddContactPopUp()">
          <div class="popupContent">
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
              
              <div class="popupContentAddContactDetails" onclick="event.stopPropagation()">
                  <div class="ShortNameContainer">
                      <div class="CreateContactShortName">
                          <img class="AddContactPerson" src="../assets/img/person_white.svg" alt="AddContactPerson">
                      </div>
                  </div>

                  <div class="DialogAddEdit">
                      <div class="popupCloseAddContactDesktop">
                          <img class="closeAddContactPopUpDesktop" onclick="closeAddContactPopUp()" src="../assets/img/close_black.svg" alt="CloseAddContactPopUp">
                      </div>

                      <form class="DialogAddEditForm" onsubmit="createContact(event)">
                          <div class="inputContainer">
                              <label for="fullName"></label>
                              <input class="CreateContactInput" type="text" id="fullName" placeholder="Name" required>
                          </div>

                          <div class="inputContainer">
                              <label for="mail"></label>
                              <input class="CreateContactInput" type="email" id="mail" placeholder="Email" required>
                          </div>
                          
                          <div class="inputContainer">
                              <label for="telNumber"></label>
                              <input class="CreateContactInput" type="tel" id="telNumber" placeholder="Phone" required>
                          </div>

                          <div class="ContactButtonContainer">
                              <button type="button" class="CancelContactButton" onclick="closeAddContactPopUp()">Cancel<img src="../assets/img/close_black.svg" alt="CloseAddContactPopUp"></button>
                              <button type="submit" class="CreateContactButton">Create contact<img src="../assets/img/check.svg" alt="Check"></button>
                          </div>
                      </form>
                  </div>
              </div>
          </div> 
      </div>
  `;

  document.body.appendChild(popupContainer);

  setTimeout(() => {
      popupContainer.classList.add('show');
  }, 10);
}

function closeAddContactPopUp() {
  const popup = document.getElementById("addContactPopup");
  if (popup) {
      popup.classList.remove('show');
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
    window.location.href = 'contacts.html'; // Weiterleitung zur contacts.html
  } catch (error) {
    console.error('Fehler beim Erstellen des Kontakts:', error);
  }
}

function getInitials(name) {
  let words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  let initials = words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    return initials;
}

function randomColor(colors) {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
  
fetchContacts();
