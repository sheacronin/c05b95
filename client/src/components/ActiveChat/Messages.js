import React, { Fragment } from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';
import ReadMarker from './ReadMarker';

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  return (
    <Box>
      {messages.map((message, i) => {
        const time = moment(message.createdAt).format('h:mm');

        // Find the next message by the sender
        const nextMessageBySender = messages.find((message) => {
          return message.senderId === userId && messages.indexOf(message) > i;
        })

        function isThisTheLastMessageReadByRecipient() {
          if (nextMessageBySender) {
            return message.readByRecipient && !nextMessageBySender.readByRecipient;
          } else {
            return message.readByRecipient;
          }
        }

        const readMarker = isThisTheLastMessageReadByRecipient() ? (
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
