const BASE_URL = 'https://remotestoragejoin-d0140-default-rtdb.europe-west1.firebasedatabase.app/';

async function initPrivacyPolicy() {
    await includeHTML(); // Sicherstellen, dass includeHTML() abgeschlossen ist
    if (currentUser == null) {
        setTimeout(() => {
            hideHeaderContainerRight(); // Verzögerte Ausführung
        }, 100); // Beispielhafte Verzögerung, die je nach Ladezeit angepasst werden muss
        setTimeout(() => {
            hideDesktopContainer(); // Verzögerte Ausführung
        }, 100); // Beispielhafte Verzögerung, die je nach Ladezeit angepasst werden muss
    }
}


function hideHeaderContainerRight() {
    document.getElementById('headerContainerRightUserIcon').style = 'display:none;';
    document.getElementById('headerContainerRightHelp').style = 'display:none;';
}


function hideDesktopContainer() {
    document.getElementById('desktopContainer').style = "display: none;"
}


function backToLastPage() {
    console.log('Funktion fertig stellen. Merker für letzte Seite implementieren');
    open("../index.html", "_self");
}

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let reponseToJSON = await response.json();
    console.log(reponseToJSON);
    document.getElementById('container').innerHTML = reponseToJSON['name'];
}

