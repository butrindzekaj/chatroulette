// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
import socket from "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"

function generateRandomUsername() {
    const adjectives = ["Quick", "Lazy", "Jolly", "Funny", "Bright", "Dark", "Clever", "Wise"];
    const nouns = ["Bear", "Fox", "Eagle", "Owl", "Tiger", "Wolf", "Lion", "Panda"];

    // Generate random indices to pick words
    const adjIndex = Math.floor(Math.random() * adjectives.length);
    const nounIndex = Math.floor(Math.random() * nouns.length);

    // Generate a random number between 0 and 99
    const randomNumber = Math.floor(Math.random() * 100);

    // Combine adjective, noun, and number
    return adjectives[adjIndex] + nouns[nounIndex] + randomNumber;
}

// Example usage
const USERNAME = generateRandomUsername();


let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", info => topbar.delayedShow(200))
window.addEventListener("phx:page-loading-stop", info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket


/* Message list code */
const messages = document.getElementById('message-container');    // list of messages.
const msg = document.getElementById('msg');        // message input field
const send = document.getElementById('send');      // send button

const channel = socket.channel('room:lobby', {});  // connect to chat "room"
channel.join(); // join the channel.

// Listening to 'shout' events
channel.on('shout', function (payload) {
    render_message(payload, payload.username === USERNAME)
});


// Send the message to the server on "shout" channel
function sendMessage() {

  channel.push('shout', {
    username: USERNAME,        
    message: msg.value,          // get message text (value) from msg input field.
    inserted_at: new Date()      // date + time of when the message was sent
  });

  msg.value = '';                // reset the message input field for next message.
  window.scrollTo(0, document.body.scrollHeight); // scroll to the end of the page on send
}

// Render the message with Tailwind styles
function render_message(payload, own) {

  const message = document.createElement("div"); // create new list item DOM element

  // Message HTML with Tailwind CSS Classes for layout/style:
  message.innerHTML = `
  <div class="comment ${own ? 'me': 'other'}">  
      <div class="bubble">
        <div class="sender">${payload.username}:</div>
        </br>
        ${payload.message}
      </div>
    </div>
  `
  // Append to list
  messages.appendChild(message);
}

// Listen for the [Enter] keypress event to send a message:
msg.addEventListener('keypress', function (event) {
  if (event.keyCode == 13 && msg.value.length > 0) { // don't sent empty msg.
    sendMessage()
  }
});

// On "Send" button press
send.addEventListener('click', function (event) {
  if (msg.value.length > 0) { // don't sent empty msg.
    sendMessage()
  }
});

// Date formatting
function formatDate(datetime) {
  const m = new Date(datetime);
  return m.getUTCFullYear() + "/" 
    + ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" 
    + ("0" + m.getUTCDate()).slice(-2);
}

// Time formatting
function formatTime(datetime) {
  const m = new Date(datetime);
  return ("0" + m.getUTCHours()).slice(-2) + ":"
    + ("0" + m.getUTCMinutes()).slice(-2) + ":"
    + ("0" + m.getUTCSeconds()).slice(-2);
}