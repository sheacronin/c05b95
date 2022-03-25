import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { Input, Header, Messages } from './index';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexGrow: 8,
    flexDirection: 'column',
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
}));

const ActiveChat = ({
  user,
  activeConversation,
  postMessage,
}) => {
  const classes = useStyles();

  const isConversation = (obj) => {
    return obj !== {} && obj !== undefined && obj !== null;
  };

  return (
    <Box className={classes.root}>
      {isConversation(activeConversation) && activeConversation.otherUser && (
        <>
          <Header
            username={activeConversation.otherUser.username}
            online={activeConversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            {user && (
              <>
                <Messages
                  messages={activeConversation.messages}
                  otherUser={activeConversation.otherUser}
                  userId={user.id}
                />
                <Input
                  otherUser={activeConversation.otherUser}
                  conversationId={activeConversation.id || null}
                  user={user}
                  postMessage={postMessage}
                />
              </>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ActiveChat;
