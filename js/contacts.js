let contactsData = {};

function displayContacts(data) {
    contactsData = {}; // Reset the global variable to an empty object

    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    const contactsArray = Object.values(data); // Convert data to an array
    contactsArray.sort((a, b) => a.name.localeCompare(b.name));

    let currentLetter = '';

    contactsArray.forEach(contact => {
        // Save each contact by its ID in contactsData
        contactsData[contact.id] = contact;

        const firstLetter = contact.name.charAt(0).toUpperCase();

        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;

            const letterHeader = document.createElement('div');
            letterHeader.className = 'letterHeader';
            letterHeader.innerHTML = `
                <h2>${currentLetter}</h2>
                <hr>
            `;
            contactList.appendChild(letterHeader);
        }

        const contactElement = document.createElement('div');
        contactElement.className = 'contactItem';
        contactElement.setAttribute('onclick', `toggleContactView(${contact.id})`);
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

    // Entferne die 'selected'-Klasse von allen Kontakt-Elementen
    const contactItems = document.querySelectorAll('.contactItem');
    contactItems.forEach(item => {
        item.classList.remove('selected');
    });

    // Finde das angeklickte Kontakt-Element und füge die 'selected'-Klasse hinzu
    const selectedContactElement = document.querySelector(`.contactItem[onclick="toggleContactView(${id})"]`);
    if (selectedContactElement) {
        selectedContactElement.classList.add('selected');
    }

    const contactDetailsSection = document.getElementById('contactDetailsSection');
    
    const existingContactDetails = document.getElementById('dynamicContactDetails');
    if (existingContactDetails) {
        contactDetailsSection.removeChild(existingContactDetails);
    }

    const contactDetailsContainer = document.createElement('div');
    contactDetailsContainer.id = 'dynamicContactDetails';

    contactDetailsContainer.innerHTML = /*HTML*/ `
        <div class="contactDetailsHeader" style="display: flex; align-items: center; gap: 16px;">
            <div class="shortNameContactDetails" style="background-color: ${contact.color};">
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
                    <p class="contactDetailsBodyPhone">+${contact.phone || 'N/A'}</p>
                </div>
            <img src="../assets/img/arrowLeft.svg" alt="Back" class="backButton" onclick="backToList()">
        </div>
    `;

    contactDetailsSection.appendChild(contactDetailsContainer);

    if (window.innerWidth <= 1000) {
        document.querySelector('.listSection').style.display = 'none';
        contactDetailsSection.style.display = 'block';
    }
}

function backToList() {
    document.querySelector('.listSection').style.display = 'block';
    document.getElementById('contactDetailsSection').style.display = 'none';
}

function editContact(id) {
    console.log(`Edit contact with id ${id}`);
}

function deleteContact(id) {
    console.log(`Delete contact with id ${id}`);
}

fetchContacts();
