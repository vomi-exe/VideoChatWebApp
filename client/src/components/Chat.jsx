import React, { useContext, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import io from "socket.io-client"
import { SocketContext } from "../SocketContext";

const Page = styled.div`
  display: flex;
  height: 80vh;
  width: 60%;
  align-items: lef;
  background-color: #46516e;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
  max-height: 500px;
  overflow: auto;
  width: 300px;
  border: 1px solid lightgray;
  border-radius: 10px;
  padding-bottom: 10px;
  margin-top: 25px;
`;

const TextArea = styled.textarea`
  width: 98%;
  height: 100px;
  border-radius: 10px;
  margin-top: 10px;
  padding-left: 10px;
  padding-top: 10px;
  font-size: 17px;
  background-color: transparent;
  border: 1px solid lightgray;
  outline: none;
  color: lightgray;
  letter-spacing: 1px;
  line-height: 20px;
  ::placeholder {
    color: lightgray;
  }
`;

const Button = styled.button`
  background-color: pink;
  width: 100%;
  border: none;
  height: 50px;
  border-radius: 10px;
  color: #46516e;
  font-size: 17px;
`;

const Form = styled.form`
  width: 400px;
`;

const MyRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const MyMessage = styled.div`
  width: 45%;
  background-color: pink;
  color: #46516e;
  padding: 10px;
  margin-right: 5px;
  text-align: center;
  border-top-right-radius: 10%;
  border-bottom-right-radius: 10%;
`;

const PartnerRow = styled(MyRow)`
  justify-content: flex-start;
`;

const PartnerMessage = styled.div`
  width: 45%;
  background-color: transparent;
  color: lightgray;
  border: 1px solid lightgray;
  padding: 10px;
  margin-left: 5px;
  text-align: center;
  border-top-left-radius: 10%;
  border-bottom-left-radius: 10%;
`;



function Chat() {
  const [yourId, setYourId] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const { callerID, callAccepted, callEnded } = useContext(SocketContext);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:5000");

    socketRef.current.on("me", id => {
      setYourId(id);
    });

    socketRef.current.on("message", (message) => {
      recivedMessage(message);
    })


  }, [])

  function recivedMessage(message) {
    setMessages(oldMsgs => [...oldMsgs, message])
  }

  function sendMessage(e) {
    e.preventDefault();
    const messageObj = {
      body: message,
      id: yourId
    };
    setMessage("");
    socketRef.current.emit("sendmessage", messageObj);
  }


  function handleChange(e) {
    setMessage(e.target.value);
  }

  return (callAccepted && !callEnded) && (
    <Page>
      <Container>
        {messages.map((message, index) => {
          if (message.id === yourId) {
            return (
              <MyRow key={index} >
                <MyMessage>
                  {message.body}
                </MyMessage>
              </MyRow>
            )
          }
          return (
            <PartnerRow key={index}>
              <PartnerMessage>
                {message.body}
              </PartnerMessage>
            </PartnerRow>
          )
        })}
      </Container>
      <Form onSubmit={sendMessage} >
        <TextArea value={message} onChange={handleChange} placeholder="Say Something .." />
        <Button>Send</Button>
      </Form>
    </Page>
  )
}

export default Chat;
