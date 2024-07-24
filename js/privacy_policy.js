

/**
 * Initializes the privacy policy section.
 *
 * This async function ensures the includeHTML() function is completed before proceeding.
 * If the currentUser is null, it hides certain UI elements with a slight delay to ensure they are fully loaded.
 *
 * @async
 * @function initPrivacyPolicy
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function initPrivacyPolicy() {
    await includeHTML(); // Ensure includeHTML() has completed
    storedUserString = sessionStorage.getItem('currentUser');
    if (!storedUserString) {
        hideHeaderContainerRight();
        hideDesktopContainer(); 
    } else{
        currentUser = JSON.parse(storedUserString);
        fillUserInitials();
    };
}

function hideHeaderContainerRight() {
    document.getElementById('headerContainerRightUserIcon').style = 'display:none;';
    document.getElementById('headerContainerRightHelp').style = 'display:none;';
    
}

function hideDesktopContainer() {
    document.getElementById('desktopContainer').style = "display: none;";
    document.getElementById('asideMiddle').style = 'display:none;';
}



/**
 * Navigates back to the last page.
 *
 * This function logs a message to the console and opens the 'index.html' page in the current window.
 * Note: Functionality for tracking the last page is not implemented.
 *
 * @function backToLastPage
 */
function backToLastPage() {
    console.log('Function to be completed. Implement last page marker.');
    open("../index.html", "_self");
}

/**
 * Loads data from the Firebase Realtime Database.
 *
 * This async function fetches data from the specified path in the Firebase Realtime Database,
 * logs the JSON response to the console, and updates the inner HTML of the element with the ID 'container'
 * to display the 'name' property from the fetched data.
 *
 * @async
 * @function loadData
 * @param {string} [path=""] - The path to the data in the Firebase Realtime Database.
 * @returns {Promise<void>} A promise that resolves when the data is loaded and displayed.
 */
async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJSON = await response.json();
    console.log(responseToJSON);
    document.getElementById('container').innerHTML = responseToJSON['name'];
}