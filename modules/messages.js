// Lucas Bubner, 2022

// Manages message generation with username, text, and creation time
const generateMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime()
  };
};

// Adds location url instead of message
const generateLocationMessage = (username, url) => {
  return {
    username,
    url,
    createdAt: new Date().getTime()
  };
};

// Exports to our application
module.exports = {
  generateMessage,
  generateLocationMessage
};
