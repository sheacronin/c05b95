const db = require("../db");
const Message = require("./message");
const User = require("./user");

const Conversation = db.define("conversation", {});

// find conversation given several user Ids
Conversation.findConversation = async function (...userIds) {
  for (let i = 0; i < userIds.length; i++) {
    const user = await User.findByPk(userIds[i]);
    const convos = await user.getConversations();

    // Loop through each conversation of each user and check if their users
    // match the argument of userIds
    for (let j = 0; j < convos.length; j++) {
      const convo = await Conversation.findByPk(convos[j].id, {
        include: [{
          model: User
        }]
      });

      const isEveryUserInConvo = convo.users.every((userInConvo) => {
        return userIds.includes(userInConvo.id);
      })

      if (isEveryUserInConvo && userIds.length === convo.users.length) {
          // return conversation or null if it doesn't exist
        return convos[j];
      }
    }
  }
};

module.exports = Conversation;
