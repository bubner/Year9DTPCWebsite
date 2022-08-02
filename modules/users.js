// Array of those currently active in the chat
const users = [];

// Module to manage the user experience
const userJoin = ({ id, username }) => {
    
    // Make the username clean to read
    username = username.trim();

    // Check if the username was entered
    if (!username) {
        return {
            error: "A display name is required!"
        };
    }

    // Check if the name entered already is online
    const existingUser = users.find(user => {
        return user.username === username;
    });

    // Checks if the entered name is already in the chat
    if (existingUser) {
        return {
            error: "Display name is currently in use!"
        };
    }

    // If all these tests pass, append the user to the active list
    const user = { id, username };
    users.push(user);
    return { user };
};

// Removes the user once they have left the chat
const removeUser = id => {
    const index = users.findIndex(user => user.id === id);

    // Prevent negative indices
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

// Gets a specific user from the active chat
const getUser = id => {
  return users.find(user => user.id === id);
};

// Export the modules to the app
module.exports = {
  userJoin,
  removeUser,
  getUser
};