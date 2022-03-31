import React, { useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

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
  const [numberOfUnreadMessages, setNumberOfUnreadMessages] = useState(0);

  useEffect(() => {
    const fetchNumberOfUnreadMessages = async () => {
      try {
        const { data } = await axios.get(`/api/conversations/${conversation.id}/unread-message-count`);
        setNumberOfUnreadMessages(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchNumberOfUnreadMessages();
  }, [conversation]);
 
  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={numberOfUnreadMessages > 0 ? 
          `${classes.previewText} ${classes.unreadPreviewText}`
          : classes.previewText}
        >
          {latestMessageText}
        </Typography>
      </Box>
      {numberOfUnreadMessages > 0 && 
      <Box className={classes.bubble}>
        <Typography className={classes.unreadNumber}>
          {numberOfUnreadMessages}
        </Typography>
      </Box>}
    </Box>
  );
};

export default ChatContent;
