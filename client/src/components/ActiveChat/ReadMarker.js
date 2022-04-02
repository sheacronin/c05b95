import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Avatar } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  avatar: {
    width: 22,
    height: 22,
    marginTop: 11,
    marginBottom: 11,
    marginRight: 6,
  }
}));

const ReadMarker = ({ otherUser }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
    <Avatar 
      alt={otherUser.username}
      src={otherUser.photoUrl} 
      className={classes.avatar}
    />
  </Box>
  )
}

export default ReadMarker;