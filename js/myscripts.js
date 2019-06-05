function home() {
    document.getElementById("main").classList.add("fadeout");
    setTimeout( function() { window.location = "index.html" }, 3500 );
};

function play() {
    document.getElementById("main").classList.add("fadeout");
    setTimeout( function() { window.location = "play.html" }, 3500 );
};

function about() {
    document.getElementById("main").classList.add("fadeout");
    setTimeout( function() { window.location = "about.html" }, 3500 );
};

function help() {
    document.getElementById("main").classList.add("fadeout");
    setTimeout( function() { window.location = "help.html" }, 3500 );
};

function howto() {
    document.getElementById("main").classList.add("fadeout");
    setTimeout( function() { window.location = "howto.html" }, 3500 );
};

function randomNumber(upper) {
    return Math.floor( Math.random()* upper) +1;
};

var counter = 0;
while (counter < 10) {
    var randNum = randomNumber(6);
    document.write(randNum + '');
    counter+= +1;
}