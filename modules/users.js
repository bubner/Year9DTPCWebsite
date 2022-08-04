// Lucas Bubner, 2022

// Create array of users
const users = [];

// Manage users entering the chat
const addUser = ({ id, username, room }) => {
  username = username.trim();
  // The entered username should be in the query string
  room = "livechat";
  // Uses one room only, as we don't need more than one
    
  // Checksum
  if (!username || !room) {
    return {
      error: "Username and room are required!"
    };
  }
    
  // Check if the given name was already provided, and handle it accordingly if it was not
  const existingUser = users.find(user => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return {
      error: "Username is in use!"
    };
  }
    
  // If everything checks out, pass it to the array
  const user = { id, username, room };
  users.push(user);
  return { user };
};

// Removes users from the array once they are no longer needed
const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// Information gathering methods
const getUser = id => {
  return users.find(user => user.id === id);
};

const getUsersInRoom = room => {
  room = room.trim().toLowerCase();
  return users.filter(user => user.room === room);
};

// Export to app
module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};