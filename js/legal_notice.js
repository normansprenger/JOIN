async function initLegalPolicy() {
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

