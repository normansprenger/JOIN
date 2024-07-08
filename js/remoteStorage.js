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
        displayContacts(data); // displayContacts wird aufgerufen, auch wenn es in contacts.js definiert ist
    } catch (error) {
        console.error('Es gab ein Problem mit dem Fetch-Vorgang:', error);
    }
}

fetchContacts();