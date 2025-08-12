const chatContainer = document.querySelector(".chat-container");
const messages = document.querySelector(".messages");
const userInput = document.querySelector(".user-input");
const userName = document.querySelector(".user-name");

let chatHistory = [];

const messagePattern = (user, message) => {
  return {
    user: user,
    message: message,
    time: new Date().toISOString(),
  };
};

function addMessage(text, sender) {
  const messageDiv = `<div class="message ${sender}-message">
    <span class="message-sender">${sender}</span>
    ${text}
    <span class="message-time">${new Date().toLocaleTimeString()}</span>
    </div>
    `;
  chatHistory.push(messagePattern(sender, text));
  saveChatHistory();
  messages.insertAdjacentHTML("beforeend", messageDiv);
  messages.scrollTop = messages.scrollHeight;
}

const saveChatHistory = () => {
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
};

const getChatHistory = () => {
  return JSON.parse(localStorage.getItem("chatHistory")) || [];
};

const compareChatHistory = () => {
  const currentHistory = getChatHistory();

  if (JSON.stringify(currentHistory) !== JSON.stringify(chatHistory)) {
    const newChat = currentHistory.filter(
      msg => !chatHistory.some(oldMsg => oldMsg.time === msg.time)
    );

    chatHistory = currentHistory; // Atualiza o histórico local

    newChat.forEach((msg) => {
      // Não chame addMessage aqui, pois ele salva de novo no localStorage
      const messageDiv = `<div class="message ${msg.user}-message">
        <span class="message-sender">${msg.user}</span>
        ${msg.message}
        <span class="message-time">${new Date(msg.time).toLocaleTimeString()}</span>
      </div>`;
      messages.insertAdjacentHTML("beforeend", messageDiv);
    });

    messages.scrollTop = messages.scrollHeight;
  } else {
    console.log("No changes in chat history.");
  }
};

window.addEventListener("DOMContentLoaded", () => {
  chatHistory = getChatHistory();
  messages.innerHTML = "";
  chatHistory.forEach((msg) => {
    const messageDiv = `<div class="message ${msg.user}-message">
      <span class="message-sender">${msg.user}</span>
      ${msg.message}
      <span class="message-time">${new Date(msg.time).toLocaleTimeString()}</span>
    </div>`;
    messages.insertAdjacentHTML("beforeend", messageDiv);
  });
  messages.scrollTop = messages.scrollHeight;
});

window.addEventListener("storage", () => {
  compareChatHistory();
});

// refresh when the user sends a new message
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const userMessage = userInput.value;
    if (userMessage.trim()) {
      addMessage(userMessage, userName.value || "User");
      userInput.value = "";
      compareChatHistory();
    }
  }
});


