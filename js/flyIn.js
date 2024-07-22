/**
 * Toggles the visibility of the mobile header menu.
 *
 * This function checks the current position of the mobile menu element with the ID 'headerMobileMenu'.
 * If the menu is hidden (right position is '-180px'), it moves the menu into view (right position '10px').
 * If the menu is visible, it hides the menu by moving it out of view (right position '-180px').
 */
function showHeaderMenu(){
    if(document.getElementById('headerMobileMenu').style.right == "-180px"){
    document.getElementById('headerMobileMenu').style.right = "10px"}
    else{
        document.getElementById('headerMobileMenu').style.right = "-180px"
    };
}