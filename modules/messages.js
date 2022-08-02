// Module to generate a message based on time, username and message
const generateMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime()
  };
};

// Send the module to the app
module.exports = {
  generateMessage
};