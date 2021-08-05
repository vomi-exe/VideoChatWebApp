import "./App.css";
import React, { useContext, useState } from "react"
import { Typography, AppBar, IconButton } from "@material-ui/core";
import ChatIcon from '@material-ui/icons/Chat';
import { makeStyles } from "@material-ui/core/styles";
import { Notification } from "./components/Notification";
import { VideoPlayer } from "./components/VideoPlayer";
import { Options } from "./components/Options";
import Chat from "./components/Chat";
import { SocketContext } from "./SocketContext";
import styled from "styled-components";

const Slide = styled.div`
  position: fixed;
  right: ${({ open }) => open ? "370px" : "0px"};
  top: 20px;
  transition: all 0.4s ease-in-out;
`;

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: "30px 100px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "600px",
    border: "2px solid black",

    [theme.breakpoints.down("xs")]: {
      width: "90%",
    },
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
}));

function App() {

  const { callAccepted, callEnded } = useContext(SocketContext);
  const [open, setOpen] = useState(false)
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <AppBar className={classes.appBar} position="static" color="inherit">
        <Typography variant="h1" align="center">
          Say Hello !
        </Typography>
      </AppBar>
      <VideoPlayer />
      <Options >
        <Notification />
      </Options>
      {(callAccepted && !callEnded) && (
        <div>
          <Slide open={open} onClick={() => setOpen(!open)}>
            <IconButton color="secondary" size="medium">
              <ChatIcon fontSize="large" />
            </IconButton>
          </Slide>
          <Chat open={open} />
        </div>
      )}
    </div>
  );
}

export default App;
