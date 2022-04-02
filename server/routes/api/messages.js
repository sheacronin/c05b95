const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require("sequelize");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

// Expects { conversationId } in body
router.put("/read", async (req, res, next) => {
  try {    
    if (!req.user) {
      return res.sendStatus(401);
    } 

    const { conversationId } = req.body;
    const conversation = await Conversation.findByPk(conversationId);

    if (req.user.id !== conversation.user1Id && req.user.id !== conversation.user2Id) {
      return res.sendStatus(403);
    }
    
    const [numberUpdated, messages] = await Message.update({ readByRecipient: true }, {
      where: {
        conversationId: conversationId,
        readByRecipient: false,
        [Op.not]: {
          senderId: req.user.id,
        },
      },
      returning: true,
    });
    res.json({ messages });
  } catch (error) {
    next(error);
  }
})

module.exports = router;
