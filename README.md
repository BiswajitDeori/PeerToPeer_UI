# Peer-to-Peer File Transfer System using Socket.io

This project is a **peer-to-peer (P2P) file transfer system** built using **Socket.io** for signaling between peers, and **Express.js** for the backend. The frontend is developed in **React**, providing an easy-to-use interface for users to connect and transfer files directly between devices without the need for an intermediary server.

## Key Features:
- **Real-time Peer-to-Peer Connections:** Utilizes WebRTC to establish direct P2P connections between users for efficient file transfers.
- **Socket.io for Signaling:** Socket.io handles the signaling mechanism required to initiate WebRTC connections and transfer file chunks between peers.
- **File Transfer Support:** Allows users to upload and send files, with support for transferring large files in chunks to ensure stability over varied network conditions.
- **User Count Tracking:** Tracks and displays the number of active users in each room, providing feedback to users about connection availability.
- **React Frontend:** A React.js frontend provides a clean interface for users to join rooms and initiate file transfers.
- **Backend using Express:** The backend serves the static React frontend and manages socket connections to handle signaling and communication between peers.
- **Cross-Origin Resource Sharing (CORS):** Configured with CORS to allow secure cross-origin requests between the React frontend and the Express backend during development and deployment.

## Tech Stack:
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Real-time Communication:** WebRTC, Socket.io
- **Signaling Server:** Socket.io to manage signaling for establishing peer connections
- **Deployment:** Easily deployable on platforms like Heroku, Vercel, or any Node.js hosting service.

## How It Works:
1. **User Room Creation:** Users can join a room by entering a unique room ID. If no room exists with that ID, one is created.
2. **Signaling with Socket.io:** Socket.io facilitates the signaling needed to establish WebRTC connections between peers by exchanging connection information.
3. **File Transfer in Chunks:** Files are transferred in chunks between connected peers, and progress is updated in real-time.
4. **Scalability and Flexibility:** The system is designed to handle multiple users and rooms, with scalability ensured via the Socket.io server for signaling.

## Installation & Setup:
1. Clone the repository:
   ```bash
   [git clone https://github.com/your-username/peer-to-peer-file-transfer.git](https://github.com/BiswajitDeori/PeerToPeer_UI.git)

2.  Start the Application 
     npm start

