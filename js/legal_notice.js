async function initLegalPolicy() {
    await includeHTML(); // Sicherstellen, dass includeHTML() abgeschlossen ist
    setTimeout(() => {
        hideHeaderContainerRightUserIcon(); // Verzögerte Ausführung
    }, 100); // Beispielhafte Verzögerung, die je nach Ladezeit angepasst werden muss
}

function hideHeaderContainerRightUserIcon() {
    console.log('hallo');
    document.getElementById('headerContainerRightUserIcon').style='display:none;';
}