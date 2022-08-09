// Lucas Bubner, 2022

const socket = io();

// Target the message form DOM
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationBtn = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Grab the templates for rendering from minichat.html
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Query the room
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

// Auto scroll upon messages being delivered
const autoscroll = () => {
  const $newMessage = $messages.lastElementChild;

  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  const visibleHeight = $messages.offsetHeight;
  const containerHeight = $messages.scrollHeight;
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};
// When a message is recieved, use the template to render it with the correct metadata
socket.on("message", message => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm:ss a")
  });
  // Insert the message into the correct location, and autoscroll to compensate
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

// Handles location instead of a message
socket.on("locationMessage", message => {
  console.log(message);
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("h:mm:ss a")
  });

  $messages.insertAdjacentHTML("beforeend", html);
});

// Renders the sidebar of users
socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });

  document.querySelector("#sidebar").innerHTML = html;
});

// Listens for the send button being pressed and prevents multi-request buffer attacks
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
    }
  });
});

// Manages getting the location of the user upon clicking send location
$sendLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    // Browser incompatibilities
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
        }
      );
    });
  }
});

// Catch any errors that might happen
socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
