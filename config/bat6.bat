SET DIFFICULTY=3
SET REWARD=10
SET PEERS=ws://localhost:8986
SET P2P_PORT=8985
SET HTTP_PORT=5005
cd ../Server 
start npm run-script server
SET PORT=6005
SET REACT_APP_HTTP_PORT=5005
cd ../Client
start npm start