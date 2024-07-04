async function initPrivacyPolicy() {
    await includeHTML(); // Sicherstellen, dass includeHTML() abgeschlossen ist
    setTimeout(() => {
        hideHeaderContainerRightUserIcon(); // Verzögerte Ausführung
    }, 100); // Beispielhafte Verzögerung, die je nach Ladezeit angepasst werden muss
}

function hideHeaderContainerRightUserIcon() {
    document.getElementById('headerContainerRightUserIcon').style='display:none;';
}