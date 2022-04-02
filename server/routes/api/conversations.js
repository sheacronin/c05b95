const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set property for latest message read by recipient
      const messagesFromCurrentUser = convoJSON.messages.filter((message) => message.senderId !== convoJSON.otherUser.id);
      for (let i = messagesFromCurrentUser.length - 1; i >= 0; i--) {
        const message = messagesFromCurrentUser[i];
        if (message.readByRecipient) {
          convoJSON.otherUser.latestReadMessage = message;
          break;
        }
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length - 1].text;
      conversations[i] = convoJSON;

      convoJSON.numberOfUnreadMessages = await Message.count({
        where: {
          conversationId: convoJSON.id,
          readByRecipient: false,
          [Op.not]: {
            senderId: req.user.id,
          },
        }
      });
    }

    // Sort conversations so most recent will be first in the array
    conversations.sort((a, b) => {
      const latestAMessage = a.messages[a.messages.length - 1];
      const latestBMessage = b.messages[b.messages.length - 1];

      if (latestAMessage.createdAt > latestBMessage.createdAt) {
        return -1;
      } else {
        return 1;
      }
    })

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
