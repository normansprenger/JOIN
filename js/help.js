/**
 * Initializes the help section.
 *
 * This async function ensures the includeHTML() function is completed before proceeding.
 * If the currentUser is null, it hides certain UI elements with a slight delay to ensure they are fully loaded.
 */
async function initHelp() {
    await includeHTML();
    checkUser();
    fillUserInitials();
}

/**
 * Hides the right-side header container elements.
 *
 * This function sets the display style to 'none' for the user icon and help elements
 * in the right-side header container.
 */
function hideHeaderContainerRight() {
    document.getElementById('headerContainerRightUserIcon').style = 'display:none;';
    document.getElementById('headerContainerRightHelp').style = 'display:none;';
}

/**
 * Hides the desktop container.
 *
 * This function sets the display style to 'none' for the desktop container element.
 */
function hideDesktopContainer() {
    document.getElementById('desktopContainer').style = "display: none;";
}

/**
 * Navigates back to the last page.
 *
 * This function logs a message to the console and opens the 'index.html' page in the current window.
 * Note: Functionality for tracking the last page is not implemented.
 */
function backToLastPage() {
    console.log('Function to be completed. Implement last page marker.');
    open("../index.html", "_self");
}