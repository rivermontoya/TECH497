"use strict";

/*------- NAV BAR IMPLEMENTATION -------*/
//on window load, run loadMenu function
window.onload = function loadMenu() {
    //get the ul element by its id
    var Menu = document.getElementById("mainNav");
    //add all links to site as needed
    Menu.innerHTML = "<a href=\"index.html\">Home</a>";
    Menu.innerHTML += "<a href=\"services.html\">Services</a>";
    Menu.innerHTML += "<a href=\"about.html\">About</a>";
    Menu.innerHTML += "<a href=\"costestimator.html\">Cost Estimator</a>";
    Menu.innerHTML += "<a href=\"contact.html\">Contact</a>";

    /*------- FOOTER IMPLEMENTATION -------*/
    //get p element by id for footer
    var Footer = document.getElementById("addFooter");

    //working on centering footer better... styled with footer img
    //in main.css
    Footer.innerHTML = "<a href=\"index.html\"><img src=\"images/favicon.svg\" alt=\"favicon\"></a>";
    Footer.innerHTML += "<p>WebDevs</p>";
    Footer.innerHTML += "<p id=\"footDetails\">Developed by Team 1</p>";
    Footer.innerHTML += "<p><a href=\"contact.html\">Contact Us for a free Quote</a></p>";
}
//NOTE: The " character must be escaped for the script to work properly.