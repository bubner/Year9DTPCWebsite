const form = document.getElementById("enterform");
const container = document.getElementById("chat_container");
const chat = document.getElementById("primarychat");
var loaded = false;

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function loadchat(event) {
    event.preventDefault();
    form.style.display = "none";
    chat.style.display = "block";
    document.getElementsByName("iframe")[0].src = "minichat.html";
    document.getElementsByName("iframe")[0].style.display = "block";
    loaded = true;
}

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