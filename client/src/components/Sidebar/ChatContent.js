import React, { memo, useMemo } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  bubble: {
    backgroundColor: '#3E92FF',
    borderRadius: '10px',
    alignSelf: 'center',
  },
  unreadNumber: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    padding: '3px 8px',
  },
  unreadPreviewText: {
    fontWeight: 'bold',
    color: 'black',
  },
}));

const ChatContent = ({ conversation }) => {
  const classes = useStyles();

  const { otherUser } = conversation;
  const latestMessageText = conversation.id && conversation.latestMessageText;

  const memoizedNumberOfUnreadMessages = useMemo(() => {
    const unreadMessages = conversation.messages.filter((message) => 
      message.senderId === otherUser.id 
      && !message.readByRecipient
    );

    return unreadMessages.length;
  }, [conversation, otherUser]);
 
  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={memoizedNumberOfUnreadMessages > 0 ? 
          `${classes.previewText} ${classes.unreadPreviewText}`
          : classes.previewText}
        >
          {latestMessageText}
        </Typography>
      </Box>
      {memoizedNumberOfUnreadMessages > 0 && 
      <Box className={classes.bubble}>
        <Typography className={classes.unreadNumber}>
          {memoizedNumberOfUnreadMessages}
        </Typography>
      </Box>}
    </Box>
  );
};

export default ChatContent;
