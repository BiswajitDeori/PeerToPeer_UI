import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  Alert,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { CopyToClipboard } from "react-copy-to-clipboard";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

export const Room = () => {
  const { roomID } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [fileChunks, setFileChunks] = useState({});
  const [userCount, setUserCount] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [fileReceived, setFileReceived] = useState(null);
  const [fileSize, setFileSize] = useState("");

  const [showUpload, setShowUpload] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [fileName, setFileName] = useState("");

  const [readytoDownload, setReadyToDownload] = useState(false);

  useEffect(() => {
    socket.emit("join room", roomID);

    socket.on("reciving file information", (data) => {
      setFileName(data.fileName);
      setFileSize(data.fileSize);
      setShowDownload(true);
    });

    socket.on(
      "file chunk received",
      async ({ chunk, index, totalChunks, fileName }) => {
        setFileName(fileName);
        setUploadProgress(false);
    
        // Use the callback to ensure we're working with the current state
        setFileChunks((prevFileChunks) => {
          const updatedChunks = { ...prevFileChunks };
    
          // Initialize an array for the file if it doesn't exist
          if (!updatedChunks[fileName]) {
            updatedChunks[fileName] = new Array(totalChunks).fill(null);
          }
    
          // Assign the received chunk at the correct index
          updatedChunks[fileName][index] = chunk;
    
          // Update the download progress
          setDownloadProgress(((index + 1) / totalChunks) * 100);
    
          // Check if all chunks have been received
          if (updatedChunks[fileName].every((chunk) => chunk !== null)) {
            // Create a Blob from the file chunks once all are received
            const completeFile = new Blob(updatedChunks[fileName]);
            // Set the received file for download
            setFileReceived(completeFile);
            // Mark as ready to download
            // Reset the chunks for this file to free memory
            setFileChunks((prev) => ({ ...prev, [fileName]: null }));
          }

          if(index+1  ===  totalChunks)
          {
            setReadyToDownload(true);
          }
    
          // Return the updated state
          return updatedChunks;
        });
      }
    );

    socket.on("user count", (count) => {
      setUserCount(count);
    });
  }, [roomID, fileChunks]);

  const handleCopy = () => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleShareFile = async () => {
    if (!selectedFile) {
      console.error("No file selected!");
      return;
    }

    setUploadProgress(0);
    setDownloadProgress(0);

    const chunkSize = 1024 * 500; // speed 500 kb per second
    const totalChunks = Math.ceil(selectedFile.size / chunkSize);

    const reader = new FileReader();

    socket.emit("start file transfer", {
      roomID,
      fileName: selectedFile.name,
      fileSize: (selectedFile.size / 1024).toFixed(2),
    });

    reader.onload = async (e) => {
      const fileBuffer = e.target.result;

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, fileBuffer.byteLength);
        const chunk = fileBuffer.slice(start, end);

        // Log the chunk for debugging
        console.log(`Sending chunk ${i + 1}/${totalChunks}`);

        // Emit the chunk to the server
        socket.emit("file chunk", {
          roomID,
          chunk,
          index: i,
          totalChunks,
          fileName: selectedFile.name,
        });

        setShowUpload(true);
        setDownloadProgress(false);
        // Update upload progress after each chunk is sent
        setUploadProgress(((i + 1) / totalChunks) * 100);

        // Wait for 2 seconds before sending the next chunk
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    };

    reader.onerror = (err) => {
      console.error("Error reading the file:", err);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding={2}
        sx={{ backgroundColor: "#00796b", borderRadius: 2 }}
      >
        <Typography
          variant="h4"
          color="white"
          gutterBottom
          style={{
            background: "#34b54496",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          Room ID: {roomID}
        </Typography>
        <CopyToClipboard text={roomID} onCopy={handleCopy}>
          <IconButton sx={{ color: "white", marginLeft: 1 }}>
            <ContentCopyIcon />
          </IconButton>
        </CopyToClipboard>
      </Box>
      {copySuccess && (
        <Stack sx={{ width: "100%" }} spacing={2} mt={2}>
          <Alert variant="filled" severity="success">
            Room ID copied to clipboard!
          </Alert>
        </Stack>
      )}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="80vh"
        sx={{ backgroundColor: "#e0f7fa", padding: 4 }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Users in Room: {userCount}
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          gap={3}
          mt={4}
          alignItems="center"
          justifyContent="center"
        >
          <Box
            display="flex"
            gap="2rem"
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <Button
              variant="contained"
              component="label"
              color="primary"
              startIcon={<FileUploadIcon />}
              sx={{ padding: "10px 20px", fontSize: "16px", height: "40px" }}
            >
              Choose File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {selectedFile && (
              <Card sx={{ minWidth: 275, marginTop: 2 }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Size: {(selectedFile.size / 1024).toFixed(2)} KB
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
          <Button
            variant="contained"
            color="success"
            startIcon={<FileUploadIcon />}
            sx={{ padding: "10px 20px", fontSize: "16px", marginTop: "2rem" }}
            disabled={!selectedFile}
            onClick={handleShareFile}
          >
            Share File
          </Button>

          {fileReceived && (
            <Card sx={{ minWidth: 275, marginTop: 2 }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {fileName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  File size: {fileSize} KB
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={!readytoDownload}
                  startIcon={<FileDownloadIcon />}
                  onClick={() => {
                    const url = URL.createObjectURL(fileReceived);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setFileReceived(null);
                  }}
                >
                  Download
                </Button>
              </CardActions>
            </Card>
          )}
        </Box>
        <br />
        <br />
        <br />
        {showUpload && (
          <Box width="85%" mb={2}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="caption" color="text.secondary" align="right">
              Upload Progress: {uploadProgress.toFixed(2)}%
            </Typography>
          </Box>
        )}
        {showDownload && (
          <Box width="85%" mb={2}>
            <LinearProgress variant="determinate" value={downloadProgress} />
            <Typography variant="caption" color="text.secondary" align="right">
              Download Progress: {downloadProgress.toFixed(2)}%
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};
