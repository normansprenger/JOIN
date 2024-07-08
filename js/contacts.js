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

    const contactDetailsSection = document.getElementById('contactDetailsSection');
    
    const existingContactDetails = document.getElementById('dynamicContactDetails');
    if (existingContactDetails) {
        contactDetailsSection.removeChild(existingContactDetails);
    }

    const contactDetailsContainer = document.createElement('div');
    contactDetailsContainer.id = 'dynamicContactDetails';

    contactDetailsContainer.innerHTML = /*HTML*/ `
        <div class="contactDetailsHeader" style="display: flex; align-items: center; gap: 16px;">
            <div class="shortName" style="background-color: ${contact.color};">
                <span class="initials">${contact.initials}</span>
            </div>
            <div style="flex-grow: 1;">
                <h2>${contact.name}</h2>
                <div style="display: flex; gap: 16px;">
                    <span class="edit" style="cursor: pointer; color: blue;" onclick="editContact(${id})">Edit</span>
                    <span class="delete" style="cursor: pointer; color: red;" onclick="deleteContact(${id})">Delete</span>
                </div>
            </div>
        </div>
        <div class="contactDetailsBody">
            <h3>Contact Information</h3>
            <p><strong>Email:</strong><br> ${contact.email}</p>
            <p><strong>Phone:</strong><br> +${contact.phone || 'N/A'}</p>
        </div>
    `;

    contactDetailsSection.appendChild(contactDetailsContainer);
}

function editContact(id) {
    console.log(`Edit contact with id ${id}`);
}

function deleteContact(id) {
    console.log(`Delete contact with id ${id}`);
}

fetchContacts();
