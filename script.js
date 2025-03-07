var url = "http://localhost:3000/post";

let noteIdCounter = 0;
let currSelected = 0;
let notes = [];
let access = false;

/*
FUNCTIONALITY FOR PAGE ONLOAD (HEADER WHEN LOGGED IN/NOT LOGGED IN + THEME SET)
*/
window.onload = function() {
    if(window.location.href.split('/').pop() == "home.html" || window.location.href.split('/').pop() == "about.html"
    || window.location.href.split('/').pop() == "index.html" || window.location.href.split('/').pop() == "settings.html") 
    {
        $.post(url+'?data='+JSON.stringify({"action":"checkLoggedIn"}), response);
    }
    $.post(url+'?data='+JSON.stringify({"action":"getTheme"}), response);
    $.post(url+'?data='+JSON.stringify({"action":"getFont"}), response);
    console.log("2" > "A" && "1" < "A");
}

/*
FUNCTIONALITY FOR CREATE ACC
*/

function create() {
    var u = document.getElementById("username").value;
    var p = document.getElementById("password").value;
    var p2 = document.getElementById("confirmpassword").value;

    //check if any empty values have been inputted
    if (u == "" || p == "" || p2 == "") {
        alert("Please enter valid account parameters.");
        return;
    }

    //check if passwords match
    if (p != p2) {
        resetCreateAcc();
        alert("Passwords do not match.");
        return;
    }

    //check if password length is at least 5
    if (p.length < 5) {
        resetCreateAcc();
        alert("Password is too short (please use at least 5 characters).")
        return;
    }

    //check if password has a capital character in it
    var flag = false;
    for (var i = 0; i < p.length; i++) {
        if (p[i] >= "A" && p[i] <= "Z") {
            flag = true;
        }
    }

    if (flag == false) {
        resetCreateAcc();
        alert("Please use at least one capital letter in your password.")
        return;
    }

    //check if password has at least one of the specified special characters in it
    if (!p.includes('_') && !p.includes('-') && !p.includes('*') && !p.includes('#') && !p.includes('@')) {
        resetCreateAcc();
        alert("Please use at least one of the valid special characters in your password.");
        return;
    }

    //sends username and password to server if all above conditions are satisfied
    $.post(url+'?data='+JSON.stringify({
        "action": "createAcc",
        "username": u,
        "password": p,
    }), response);
}

//code reduction
function resetCreateAcc() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmpassword").value = "";
}

/*
FUNCTIONALITY FOR LOGINS
*/
function login() {

    var u = document.getElementById("username").value;
    var p = document.getElementById("password").value;

    if (u == "" || p == "") {
        alert("Please enter valid login credentials.")
    }
    else {

        $.post(url+'?data='+JSON.stringify({
            "action": "accCheck",
            "username": u,
            "password": p
        }), response);
    }
}

/*
FUNCTIONALITY FOR ACCESSING NOTES, SETTINGS OR ABOUT US PAGE
*/

function siteAccess(n) {
    if (access && n == 1) {
        location.href = "index.html";
    }
    else if (access && n == 2) {
        location.href = "settings.html";
    }
    else if (n == 3) {
        location.href = "about.html"
    }
    else {
        alert("Please log in to access this page.")
        location.href = "login.html";
    }
}

/*
FUNCTIONALITY FOR LOGGING OUT
*/

function logout() {
    $.post(url+'?data='+JSON.stringify({"action":"logout"}), response);
}

/* 
FUNCTIONALITY FOR CHANGING PASSWORD
*/

function changePass() {
    var old = document.getElementById("old").value;
    var n = document.getElementById("new").value;
    var n2 = document.getElementById("new2").value;

    if (old == "" || n == "" || n2 == "") {
        alert("Please enter valid password parameters.");
        return;
    }
    
    if (n != n2) {
        alert("Passwords do not match.");
        return;
    }

    //check if password length is at least 5
    if (n.length < 5) {
        alert("Password is too short (please use at least 5 characters).");
        return;
    }

    //check if password has a capital character in it
    var flag = false;
    for (var i = 0; i < n.length; i++) {
        if (n[i] >= "A" && n[i] <= "Z") {
            flag = true;
        }
    }

    if (flag == false) {
        alert("Please use at least one capital letter in your password.");
        return;
    }

    //check if password has at least one of the specified special characters in it
    if (!n.includes('_') && !n.includes('-') && !n.includes('*') && !n.includes('#') && !n.includes('@')) {
        alert("Please use at least one of the valid special characters in your password.");
        return;
    }

    $.post(url+'?data='+JSON.stringify({
        "action": "changePass",
        "old": old,
        "new": n,
        "newConfirm": n2
    }), response);
}

/*
FUNCTIONALITY FOR CHANGING THEME
*/
function changeTheme(n) {
    if (n == 1) {
        $.post(url+'?data='+JSON.stringify({"action":"theme1"}), response);
    }

    if (n == 2) {
        $.post(url+'?data='+JSON.stringify({"action":"theme2"}), response);
    }
}

/*
FUNCTIONALITY FOR CHANGING FONT
*/

function changeFont(obj) {
    $.post(url+'?data='+JSON.stringify({"action":"setFont","font":obj.value}), response);
}

/*
SERVER SIDE RESPONSES
*/
function response(data, status) {
    var response = JSON.parse(data);
    console.log(data);

    if (response["isLoggedIn"]) {
        location.replace("home.html");
    }
    if (response["isLoggedIn"] == false) {
        alert("This account does not exist.");
    }

    if (response["isConflicting"]) {
        alert("An account with this username already exists.");
    }

    if (response["accCreated"]) {
        location.replace("login.html");
    }

    if (response["setHeader"] == 1) {
        document.getElementById("headerbutton").style.visibility = "hidden";
        document.getElementById("headerbutton").style.zIndex = "-1";
        document.getElementById("dropdown").style.visibility = "visible";
        document.getElementById("dropdown").style.zIndex = "1";
    }
    
    if (response["setHeader"] == 2) {
        document.getElementById("headerbutton").style.visibility = "visible";
        document.getElementById("headerbutton").style.zIndex = "1";
        document.getElementById("dropdown").style.visibility = "hidden";
        document.getElementById("dropdown").style.zIndex = "-1";
    }

    if (response["siteAccess"]) {
        access = true;
    }

    if (response["siteAccess"] == false) {
        access = false;
    }

    if (response["loggedOut"]) {
        access = false;
        location.replace("home.html");
    }

    if (response["passChanged"]) {
        alert("You have successfully changed your password. Please log in with your new password.")
        logout();
    }

    if (response["passChanged"] == false) {
        alert("The current password is incorrect.")
    }

    if (response["themeSet"] == 1) {
        document.getElementById("style").href = "dark.css";
        document.getElementById("logo").src = "QNotes.png";
    }

    if (response["themeSet"] == 2) {
        document.getElementById("style").href = "light.css";
        document.getElementById("logo").src = "QNotes-light.png";
    }

    if (response["fontSet"] == 1) {
        document.body.style.fontFamily = "system-ui, 'Segoe UI', sans-serif";
    }

    if (response["fontSet"] == 2) {
        document.body.style.fontFamily = "'Times New Roman', Times, serif";
    }
    if (response["fontSet"] == 3) {
        document.body.style.fontFamily = "Arial, Helvetica, sans-serif";
    }

}

/*
FUNCTIONALITY FOR NOTES
*/
function createNewNote() {
    // Create a new button element
    var newButton = document.createElement("button");


    var name = prompt("Enter a new note name:", "");

    if (name.length == 0) {
        name = "New Note " + (noteIdCounter + 1);
    }

    var newNote = {
        id: noteIdCounter,
        name: name,
        content: "This is note " + (noteIdCounter + 1)
    };

    // Set the button text and click event handler
    newButton.textContent = newNote.name;
    newButton.setAttribute("class", "note-button");

    newButton.onclick = function () {
        changeMainContent(newNote.id);
    };

    newButton.ondblclick = function () {
        changeNoteName(newButton);
    };

    // Add the new button to the old-notes-list
    var oldNotesList = document.getElementById("old-notes-list");
    oldNotesList.appendChild(newButton);

    // Add the new note to the notes array
    notes.push(newNote);

    noteIdCounter++;

    // Select the new note
    changeMainContent(newNote.id);
}

function changeMainContent(noteID) {
    // Get the main-content div
    document.getElementById("notename").innerHTML = notes[noteID].name;
    var mainContent = document.querySelector(".main-content");
    var notesDiv = document.getElementById("notes");

    // Remove all children of the notes div and update the currently selected content
    save();

    notesDiv.innerHTML = "";

    currSelected = noteID;

    // Create and append the new content (for example, a new message)
    var newContent = document.createElement("p");
    newContent.setAttribute("id","notetext");
    newContent.textContent = notes[noteID].content;
    newContent.setAttribute("contenteditable", "true")
    notesDiv.appendChild(newContent);
}

// This function is fine as-is
function changeNoteName(noteContainer) {
    // Prompt the user to change the note name
    const newNoteName = prompt("Enter a new note name:", "New Note");

    if (newNoteName !== null) {
        noteContainer.textContent = newNoteName;
    }
}

function save() {

    // Remove all children of the notes div and update the currently selected content
    notes[currSelected].content = document.getElementById("notes").firstChild.textContent;
}

function AddLink(){
    var link = prompt("Enter a link");
    document.getElementById("linkadd").innerHTML += "<a target=\"_blank\" href=\"" + link + "\">" + link + "</a> <br>";
}

function addImage(){
    var link = prompt("Enter the Image URL");
    document.getElementById("imageadd").innerHTML += "<img class=\"addedimage\" src=\"" + link + "\" width=\"250\" height=\"200\">";
}

function addCheck(){
    var todo = prompt("Enter a task to be completed");
    document.getElementById("checkadd").innerHTML += "<input type=\"checkbox\" id=\"check\"> <label for=\"check\">" + todo + "</label> <br>";

}
