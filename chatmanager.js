// Lucas Bubner, 2022

// Target DOM elements
const form = document.getElementById("enterform");
const container = document.getElementById("chat_container");
const chat = document.getElementById("primarychat");
const alt = document.getElementById("alt_button");
// var loaded = false;

// Sleep function in ms
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// Once a name is given and join is administered, pass username through query string to iframe and hide the input form
// function loadchat(event) {
//     event.preventDefault();
//     form.style.display = "none";
//     chat.style.display = "block";
//     document.getElementsByName("iframe")[0].src = "minichat.html?username=" + document.getElementById("input").value;
//     document.getElementsByName("iframe")[0].style.display = "block";
//     loaded = true;
// }

// Manages the google doc redirect alt_button
function altbutton() {
    window.location.href = (
        "https://docs.google.com/document/d/1Ab36coDlzcoVIDp8qCK0UtrjCJSAugaY82hCt_v-Kl8/edit?usp=sharing"
    );
}

// Manages chat button on page to open the correct menu upon click
function chattoggle() {
    if (container.style.display != "flex") {
        container.style.animation = "moveIn 0.75s, fadeIn 1s";
    }
    if (loaded == true) {
        if (chat.style.display == "none") {
            chat.style.display = "block";
            container.style.display = "flex";
        } else {
            chat.style.display = "none";
            container.style.animation = "fadeOut 0.6s";
            // Allows a 100ms gap for the browser to respond in time
            sleep(500).then(() => {
                container.style.display = "none";
            });
        }
    } else {
        if (form.style.display == "none") {
            form.style.display = "block";
            container.style.display = "flex";
        } else {
            form.style.display = "none";
            container.style.animation = "fadeOut 0.4s";
            sleep(300).then(() => {
                container.style.display = "none";
            });
        }
    }
}

form.addEventListener('submit', loadchat);
alt.addEventListener('submit', altbutton);
