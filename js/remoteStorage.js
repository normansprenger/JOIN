const BASE_URL = 'https://remotestoragejoin-d0140-default-rtdb.europe-west1.firebasedatabase.app/';

// Funktion zum Abrufen der Kontakte
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

// Funktion zum Anzeigen der Kontakte auf der Seite
function displayContacts(data) {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = ''; // Vorhandene Inhalte löschen

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const contact = data[key];
            const contactElement = document.createElement('div');
            contactElement.className = 'contactItem';
            contactElement.innerHTML = `
                <div class="contactColor" style="background-color: ${contact.color};">
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
}

// Direktes Aufrufen der Funktion, um die Kontakte zu laden
fetchContacts();
