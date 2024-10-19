import React, { useState,useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Input,
} from "@mui/material";
import { v1 as uuid } from "uuid";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io.connect("https://peertopeer-server.onrender.com");

export const Home = () => {
  const navigate = useNavigate();

  const [roomid, setRoomId] = useState("");
  const roomCreate = () => {
    const id = uuid();
    navigate(`/room/${id}`);
  };

   // Join existing room
   const joinRoom = () => {
    socket.emit("count no of user", roomid);
    socket.on("user count", (response) => {
      if (response > 1) {
        alert("Room is full");
      } else {
        navigate(`/room/${roomid}`);
      }
    });
  };

    // Cleanup socket listener on unmount
    useEffect(() => {
      return () => {
        socket.off("user count"); // Clean up the listener
      };
    }, []);

  return (
    <div style={{ backgroundColor: "#6dd0fe" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          top: "5rem",
          position: "relative",
          fontWeight: "bold",
        }}
      >
        <Typography variant="h3" gutterBottom>
          File Transfer
        </Typography>
      </div>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="92vh"
      >
        <Box display="flex" gap={5}>
          <Card
            sx={{
              minWidth: 275,
              textAlign: "center",
            }}
            style={{
              color: "white",
              backgroundColor: "#7cef4291",
              padding: "20px",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between", // Ensures content is spaced well
              height: "80%", // Full height of the card
            }}
          >
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Create Room
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center", marginTop: "auto" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={roomCreate}
                sx={{ padding: "10px 20px" }} // Larger button for a better visual feel
              >
                + Create
              </Button>
            </CardActions>
          </Card>

          <Card
            sx={{ minWidth: 275, textAlign: "center" }}
            style={{
              color: "white",
              backgroundColor: "#7cef4291",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Join Room
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={2}
                sx={{ marginTop: 2 }}
              >
                <Input
                  placeholder="Room ID"
                  value={roomid}
                  onChange={(e) => setRoomId(e.target.value)} // Fixed value extraction
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid white",
                    width: "100%",
                    color: "white",
                    backgroundColor: "transparent",
                  }}
                  disableUnderline={true} // To remove default underline
                />
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={joinRoom}
                disabled={!roomid} // Disable button if no Room ID is entered
              >
                Join
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Box>
    </div>
  );
};
