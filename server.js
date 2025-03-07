var express = require("express");
var app = express();

var isLoggedIn = false;
var accs = [["admin","pass"]];
var currentAcc = "";
var theme = 1;
var font = 1;


app.post('/post', (req, res) => {

    res.header("Access-Control-Allow-Origin", "*");

    var z = JSON.parse(req.query['data']);


    //checks if username and password are a valid account. if so, then logs them in
    if (z["action"] == "accCheck") {
        for (var i = 0; i < accs.length; i++) {
            if (accs[i][0] == z["username"] && accs[i][1] == z["password"]) {
                currentAcc = accs[i][0];
                isLoggedIn = true;
            }
        }
        var jsontext = JSON.stringify({
            "isLoggedIn":isLoggedIn
        });
        res.send(jsontext);

    }

    //adds new account into accounts array as long as the username doesn't already exist
    if (z["action"] == "createAcc") {
        var jsontext;
        var conflicting = false;
        for (var i = 0; i < accs.length; i++) {
            if (accs[i][0] == z["username"]) {
                conflicting = true;
            }
        }
        if (conflicting) {
            jsontext = JSON.stringify({"isConflicting": true});
        }
        else {
            accs.push([z["username"], z["password"]]);
            jsontext = JSON.stringify({"accCreated": true});
        } 
        console.log(accs);
        res.send(jsontext);

    }

    //checks if user is logged in
    if (z["action"] == "checkLoggedIn") {
        var jsontext;
        if (isLoggedIn) {
            jsontext = JSON.stringify({
                "setHeader": 1,
                "siteAccess": true
            });
        }
        else {
            jsontext = JSON.stringify({
                "setHeader": 2,
                "siteAccess": false
            });
        }
        res.send(jsontext);
    }

    //logs user out
    if (z["action"] == "logout") {
        isLoggedIn = false;
        currentAcc = [];
        var jsontext = JSON.stringify({"loggedOut":true});
        res.send(jsontext);
    }

    //changes user's password
    if (z["action"] == "changePass") {
        var change = true;
        //checks if current password is correct
        for (var i = 0; i < accs.length; i++) {
            if (accs[i][0] == currentAcc) {
                if (accs[i][1] != z["old"]) {
                    change = false;
                }
            }        
        }
        var jsontext;
        if (change) {
            for (var i = 0; i < accs.length; i++) {
                if (accs[i][0] == currentAcc) {
                    accs[i][1] = z["new"];
                } 
            }
            jsontext = JSON.stringify({"passChanged":true});
        }
        else {
            jsontext = JSON.stringify({"passChanged":false});
        }
        console.log(accs);
        res.send(jsontext);
    }

    //changes current theme to 1(dark)
    if (z["action"] == "theme1") {
        theme = 1;
        var jsontext = JSON.stringify({"themeSet":theme});
        res.send(jsontext);
    }
    //changes current theme to 2(light)
    if (z["action"] == "theme2") {
        theme = 2;
        var jsontext = JSON.stringify({"themeSet":theme});
        res.send(jsontext);
    }

    //returns current theme
    if (z["action"] == "getTheme") {
        var jsontext = JSON.stringify({"themeSet":theme});
        res.send(jsontext);
    }

    //sets current font to specified font
    if (z["action"] == "setFont") {
        if (z["font"] == 1) {
            font = 1;
        }
        if (z["font"] == 2) {
            font = 2;
        }
        if (z["font"] == 3) {
            font = 3;
        }
        var jsontext = JSON.stringify({"fontSet": font});
        res.send(jsontext);
    }

    //returns current font
    if (z["action"] == "getFont") {
        var jsontext = JSON.stringify({"fontSet": font});
        res.send(jsontext);
    }
    

}).listen(3000);