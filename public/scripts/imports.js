"use strict";
/*    
      JavaScript for menu and footer
      Author: Elisabeth Ryder
      Date:   2/5/23

      Filename: imports.js
*/

/*------- NAV BAR IMPLEMENTATION -------*/

//on window load, run loadMenu function
window.onload = function loadMenu() {
    //get the ul element by its id
    if(document.getElementsByClassName('loggedInPage').length >= 1)
    {
        var Menu = document.getElementById("mainNav");//[0]
    }
    else if (document.getElementsByClassName('payPage').length >= 1) {
        var Menu = document.getElementById("mainNav");//[0]
    }
    else {
        var Menu = document.getElementsByClassName("mainNav")[0];
    }
    //add all links to site as needed
    Menu.innerHTML = "<a href=\"index.html\"><img id=\"headHomeLogo\" src=\"images/favicon.svg\" alt=\"WebDev Home Page header Favicon\"></a>";
    Menu.innerHTML += "<a id=\"topNavBarLink\" href=\"services.html\">Services</a>";
    Menu.innerHTML += "<a id=\"topNavBarLink\" href=\"about.html\">About</a>";
    Menu.innerHTML += "<a id=\"topNavBarLink\" href=\"costestimator.html\">Cost Estimator</a>";
    Menu.innerHTML += "<a id=\"topNavBarLink\" href=\"contact.html\">Contact</a>";

    //determine if current page is the logged in page
    if(document.getElementsByClassName('loggedInPage').length >= 1)
    {
        //Do not add login form button if user is already logged in.
    }
    else if (document.getElementsByClassName('payPage').length >= 1) {
        var Menu = document.getElementById("mainNav");//[0]
    }
    else{
        //Log in form:
        Menu.innerHTML += "<button class=\"topnav-right\" onclick=\"openForm()\">Login</button>";
        var LoginForm = document.getElementById("addLoginForm");
        LoginForm.innerHTML += "<div class=\"form-popup\" id=\"myForm\"><form action=\"loggedin.html\" method=\"get\" class=\"form-container\"><h1>Login</h1><label for=\"email\"><b>Email</b></label><input type=\"text\" placeholder=\"Enter Email\" name=\"email\" required><label for=\"psw\"><b>Password</b></label><input type=\"password\" placeholder=\"Enter Password\" name=\"psw\" required><button type=\"submit\" class=\"btn\">Login</button><button type=\"button\" class=\"btn cancel\" onclick=\"closeForm()\">Close</button></form>";
    }

    /*------- FOOTER IMPLEMENTATION -------*/
    //get p element by id for footer
    var Footer = document.getElementById("addFooter");

    // Get current year
    let currentYear = new Date().getFullYear();

    //working on centering footer better... styled with footer img
    //in main.css
    Footer.innerHTML = "<p>Copyright " + currentYear + " </p>";
    Footer.innerHTML += "<a href=\"index.html\"><img src=\"images/favicon.svg\" alt=\"WebDev Home Page footer favicon\"></a>";
    Footer.innerHTML += "<p><a href=\"index.html\">WebDevs</a></p>";
    Footer.innerHTML += "<p id=\"footDetails\"><a href=\"about.html\">Developed by Team 1</a></p>";
    Footer.innerHTML += "<p><a href=\"contact.html\">Send Us an Email</a></p>";
    Footer.innerHTML += "<p><a href=\"ada.html\" style=\"padding-left:50px\">ADA</a></p>";
}
//NOTE: The " character must be escaped for the script to work properly.