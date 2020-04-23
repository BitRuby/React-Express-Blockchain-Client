SET DIFFICULTY=3
SET REWARD=10
SET PEERS=ws://localhost:8985,ws://localhost:8986
SET P2P_PORT=8984
SET HTTP_PORT=5004
cd ../Server 
start npm run-script server
SET PORT=6004
SET REACT_APP_HTTP_PORT=5004
cd ../Client
start npm start