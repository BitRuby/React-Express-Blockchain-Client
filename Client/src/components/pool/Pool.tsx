import React from "react";
import { connect } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Main } from "../Main";
import {
  Grid,
  Container,
  Typography,
  List,
  Button,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Snackbar,
} from "@material-ui/core";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";

interface DispatchProps {}

interface StateProps {}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

type Props = DispatchProps & StateProps;

interface ITransaction {
  signature: string;
  amount: number;
  originAddress: string;
  destinationAddress: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    display: "block",
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
}));

const Pool: React.FC<RouteComponentProps<any>> = ({ location }) => {
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [pool, setPool] = React.useState<ITransaction[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const fetchData = async () => {
      const r1 = await axios(`http://localhost:${process.env.REACT_APP_HTTP_PORT}/transactions`);
      setPool(r1.data.transactions);
    };
    fetchData();
  }, [open]);
  const mine = async () => {
    setLoading(true);
    const p1 = await axios.post(`http://localhost:${process.env.REACT_APP_HTTP_PORT}/mine-transactions`);
    setLoading(false);
    if (p1) setOpen(true);
  };
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Main name={location.pathname.replace("/", "")} />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Block has been mined
        </Alert>
      </Snackbar>
      <div className={classes.root}>
        <Container maxWidth="md">
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant="h6" className={classes.title}>
                Pending transactions
              </Typography>
              <div className={classes.demo}>
                <List dense={dense}>
                  {pool?.map((e) => (
                    <ListItem>
                      <ListItemText
                        primary={`From: ${e.originAddress}`}
                        secondary={`To: ${e.destinationAddress}`}
                      />
                      <ListItemSecondaryAction>
                        <Chip color="primary" label={e.amount} />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </div>
              {pool.length > 0 && (
                <Button variant="contained" color="secondary" onClick={mine}>
                  {loading ? <CircularProgress /> : "Mine block"}
                </Button>
              )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Pool);
