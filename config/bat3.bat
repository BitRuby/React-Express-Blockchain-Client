SET DIFFICULTY=3
SET REWARD=10
SET PEERS=ws://localhost:8983,ws://localhost:8984,ws://localhost:8985,ws://localhost:8986
SET P2P_PORT=8982
SET HTTP_PORT=5002
cd ../Server 
start npm run-script server
SET PORT=6002
SET REACT_APP_HTTP_PORT=5002
cd ../Client
start npm start