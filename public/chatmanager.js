const form = document.getElementById("enterform");
const container = document.getElementById("chat_container");
const chat = document.getElementById("primarychat");
var loaded = false;

function loadchat(event) {
    event.preventDefault();
    form.style.display = "none";
    chat.style.display = "block";
    loaded = true;
}

function chattoggle() {
    if (container.style.display != "flex") {
        container.style.animation = "moveIn 1s, fadeIn 1s";
    }
    if (loaded == true) {
        if (chat.style.display == "none") {
            chat.style.display = "block";
            container.style.display = "flex";
        } else {
            chat.style.display = "none";
            container.style.display = "none";
        }
    } else {
        if (form.style.display == "none") {
            form.style.display = "block";
            container.style.display = "flex";
        } else {
            form.style.display = "none";
            container.style.display = "none";
        }
    }
}

form.addEventListener('submit', loadchat);

const socket = io();

// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationBtn = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("message", message => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a")
  });

  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", message => {
  console.log(message);
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("h:mm a")
  });

  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });

  document.querySelector("#sidebar").innerHTML = html;
});

$messageForm.addEventListener("submit", e => {
  e.preventDefault();

  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, error => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (error) {
      return console.log(error);
    } else {
      console.log("Message delivered!");
    }
  });
});

$sendLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  } else {
    $sendLocationBtn.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition(position => {
      socket.emit(
        "sendLocation",
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        error => {
          $sendLocationBtn.removeAttribute("disabled");
          if (!error) {
            console.log("Location shared!");
          }
        }
      );
    });
  }
});

socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});