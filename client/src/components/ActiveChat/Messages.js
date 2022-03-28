import React, { Fragment, useEffect, useMemo } from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';
import ReadMarker from './ReadMarker';

const Messages = (props) => {
  const { messages, otherUser, userId, putMessagesAsRead } = props;

  // If a new message is added by the other user while this conversation is active,
  // mark the new message as read
  useEffect(() => {
    if (messages[0]) {
      const newestMessage = messages[messages.length - 1];
  
      if (newestMessage.senderId === otherUser.id) {
        putMessagesAsRead(newestMessage.conversationId);
      }
    }
  }, [messages, otherUser, putMessagesAsRead]);

  const memoizedLastMessageReadByRecipient = useMemo(() => {
    const messagesFromCurrentUser = messages.filter((message) => message.senderId === userId);

    for (let i = messagesFromCurrentUser.length - 1; i >= 0; i--) {
      const message = messagesFromCurrentUser[i];
      if (message.readByRecipient) {
        return message;
      }
    }
  }, [messages, userId]);

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format('h:mm');
        
        const readMarker = memoizedLastMessageReadByRecipient === message ? (
          <ReadMarker otherUser={otherUser} />
        ) : (
          null
        );

        return message.senderId === userId ? (
          <Fragment key={message.id}>
            <SenderBubble text={message.text} time={time} />
            {readMarker}
          </Fragment>
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
