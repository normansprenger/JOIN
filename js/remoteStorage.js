let currentUser = 'test'; // der Nutzer der momentan angemeldet ist muss lokal gespeichert werden -> nicht in die Firebase
let lastPage = null; // hier wird die URL gespeichert welche verwendet wurde bevor man auf HELP LEGAL NOTICE oder PRIVACY POLICY geht damit man von dort aus zu der Seite zurückkehren kann.

const BASE_URL = 'https://remotestoragejoin-d0140-default-rtdb.europe-west1.firebasedatabase.app/';

async function fetchContacts() {
    try {
        const response = await fetch(`${BASE_URL}contacts.json`);
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok');
        }
        const data = await response.json();
        displayContacts(data);
    } catch (error) {
        console.error('Es gab ein Problem mit dem Fetch-Vorgang:', error);
    }
}

function displayContacts(data) {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    const contactsArray = Object.keys(data).map(key => data[key]);
    contactsArray.sort((a, b) => a.name.localeCompare(b.name));

    let currentLetter = '';

    for (const contact of contactsArray) {
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
        contactElement.innerHTML = `
            <div class="shortName" style="background-color: ${contact.color};">
                <span class="initials">${contact.initials}</span> <!-- Initialen aus den Daten -->
            </div>
            <div class="contactDetails">
                <h3>${contact.name}</h3>
                <p>${contact.email}</p>
            </div>
        `;
        contactList.appendChild(contactElement);
    }
}

fetchContacts();
