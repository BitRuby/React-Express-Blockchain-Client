import React from "react";
import { connect } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Main } from "../Main";
import {
  Grid,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from "@material-ui/core";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";

interface DispatchProps {}

interface StateProps {}

interface IHistory {
  from: string;
  to: string;
  amount: number;
}

type Props = DispatchProps & StateProps;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    wordWrap: "break-word",
  },
  text: {
    width: "100%",
  },
  demo: {
    backgroundColor: "#eee",
    width: "100%",
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  receive: {
    background: "#00b894",
  },
  send: {
    background: "#d63031",
  },
}));

const Dashboard: React.FC<RouteComponentProps<any>> = ({ location }) => {
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [getPk, setPk] = React.useState("");
  const [getBalance, setBalance] = React.useState("");
  const [getHistory, setHistory] = React.useState<IHistory[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      console.log(`${process.env.REACT_APP_HTTP_PORT}`);
      const r1 = await axios(`http://localhost:${process.env.REACT_APP_HTTP_PORT}/public-key`);
      setPk(r1.data.publicKey);
      const r2 = await axios(`http://localhost:${process.env.REACT_APP_HTTP_PORT}/balance`);
      setBalance(r2.data.balance);
      const r3 = await axios(`http://localhost:${process.env.REACT_APP_HTTP_PORT}/history`);
      setHistory(r3.data.history);
    };
    fetchData();
  }, [setPk]);
  return (
    <React.Fragment>
      <Main name={location.pathname.replace("/", "")} />
      <div className={classes.root}>
        <Container maxWidth="md">
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                className={classes.text}
                id="standard-read-only-input"
                label="Wallet address"
                value={getPk}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.text}
                id="standard-read-only-input"
                label="Balance"
                value={getBalance}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className={classes.title}>
                History
              </Typography>
              <div className={classes.demo}>
                <List dense={dense}>
                  {getHistory?.map((e) => (
                    <ListItem>
                      <ListItemText primary={e?.from} secondary={e?.to} />
                      <ListItemSecondaryAction>
                        {e.from == getPk ? (
                          <Chip
                            color="secondary"
                            className={classes.send}
                            label={`-${e?.amount}`}
                          />
                        ) : (
                          <Chip
                            color="primary"
                            className={classes.receive}
                            label={`+${e?.amount}`}
                          />
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state: any): StateProps => {
  return {};
};
const mapDispatchToProps = (dispatch: any): DispatchProps => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
