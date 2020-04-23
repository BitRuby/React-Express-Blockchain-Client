SET DIFFICULTY=3
SET REWARD=10
SET PEERS=ws://localhost:8984,ws://localhost:8985,ws://localhost:8986
SET P2P_PORT=8983
SET HTTP_PORT=5003
cd ../Server 
start npm run-script server
SET PORT=6003
SET REACT_APP_HTTP_PORT=5003
cd ../Client
start npm start