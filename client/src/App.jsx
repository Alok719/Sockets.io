import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
const App = () => {
  const socket = useMemo(() => io("http://localhost:5000"), []);
  const [message, setmessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketID] = useState("");
  const [messages, setmessages] = useState([]);
  const [joinRoom, setJoinRoom] = useState("");
  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("received-message", (data) => {
      setmessages((prev) => [...prev, data]);
    });
    return () => {
      socket.off("received-message");
    };
  }, [socket]);
  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit("message", { message, room });
    setmessage("");
  };

  const joinRoomHandler = (event) => {
    event.preventDefault();
    socket.emit("join-room", joinRoom);
    setJoinRoom("");
  };
  return (
    <>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        />
        {/* <Typography variant="h1" component="div" gutterBottom>
          Welocme to the Chat App
        </Typography> */}
        <Typography variant="h6" component="div" gutterBottom>
          {socketID}
        </Typography>
        <form onSubmit={joinRoomHandler}>
          <TextField
            value={joinRoom}
            type="text"
            onChange={(event) => setJoinRoom(event.target.value)}
            id="outlined-basic"
            label="Join-Room"
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary">
            Join
          </Button>
        </form>
        <form onSubmit={handleSubmit}>
          <TextField
            value={message}
            type="text"
            onChange={(event) => setmessage(event.target.value)}
            id="outlined-basic"
            label="message"
            variant="outlined"
          />
          <TextField
            value={room}
            type="text"
            onChange={(event) => setRoom(event.target.value)}
            id="outlined-basic"
            label="room"
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        </form>
        <Stack>
          {messages.map((m, index) => (
            <Typography key={index}>{m}</Typography>
          ))}
        </Stack>
      </Container>
    </>
  );
};
export default App;
