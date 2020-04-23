import React from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import Transactions from './components/transactions/Transactions';
import Blockchain from './components/blockchain/Blockchain';
import Pool from './components/pool/Pool';

function App() {
  return (
    <Switch>
      <Route path="/dashboard" exact component={Dashboard} />
      <Route path="/transaction" exact component={Transactions} />
      <Route path="/blockchain" exact component={Blockchain} />
      <Route path="/pool" exact component={Pool} />
      <Redirect to="/dashboard" />
    </Switch>
  );
}

export default App;
