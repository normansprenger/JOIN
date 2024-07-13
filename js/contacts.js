let contactsData = {};
const userColors = [
  '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF',
  '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B',
];


async function init(){
  await includeHTML();
  loadContacts();
  //renderContacts();
}

function displayContacts(data) {
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
              <p onclick="editContact(${id})">Edit</p>  
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

function editContact(id) {
  console.log(`Edit contact with id ${id}`);
}

function deleteContact(id) {
  console.log(`Delete contact with id ${id}`);
}

function openAddContactPopUp() {
  const popupContainer = document.createElement("div");
  popupContainer.id = "addContactPopup";
  popupContainer.className = "popupContainer";
  popupContainer.innerHTML = /*HTML*/ `
        <div class="popupContent">
            <div class="popupContentAddContactTitle"> 
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
            
            <div class="popupContentAddContactDetails">
            
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
                <button class="CancelContactButton" onclick="closeAddContactPopUp()">Cancel<img src="../assets/img/close_black.svg" alt="CloseAddContactPopUp"></button>
                <button type="submit" class="CreateContactButton" >Create contact<img src="../assets/img/check.svg" alt="Check"></button>
              </div>
                </form>
            </div>
        </div> 
    `;
  document.body.appendChild(popupContainer);
}

function closeAddContactPopUp() {
  const popup = document.getElementById("addContactPopup");
  if (popup) {
    document.body.removeChild(popup);
  }
}

async function fetchContacts() {
  try {
    const contacts = await loadContacts();
    displayContacts(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
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
            <p onclick="editContact(${id})">Edit</p>
        </div>
        <div class="deleteContact">
            <img src="../assets/img/delete.svg" alt="Delete">
            <p onclick="deleteContact(${id})">Delete</p>                
        </div>
      </div>
    `;

    document.body.appendChild(popup);
}
  
fetchContacts();

function createContact(event){
  event.preventDefault();
  pushContacts();
  saveContacts();
  displayContacts();
  closeAddContactPopUp();
}

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
    
    // Add to local contacts array
    contacts.push(contact);
  
  }

  function getInitials(name) {
    // Trimmen des Namens und Aufteilen in Wörter
    let words = name.trim().split(/\s+/);

    // Wenn der Name nur aus einem Wort besteht, gebe die erste Initiale zurück
    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    }

    // Wenn der Name aus Vor- und Nachnamen besteht, gebe die Initialen zurück
    let initials = words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    return initials;
}


function randomColor(colors) {
  // Eine zufällige Zahl zwischen 0 und der Länge des Arrays (exklusiv) generieren
  const randomIndex = Math.floor(Math.random() * colors.length);
  // Den Wert an der zufälligen Position zurückgeben
  return colors[randomIndex];
}
  
