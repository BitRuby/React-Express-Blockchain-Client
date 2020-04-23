import React from "react";
import { connect } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Main } from "../Main";
import {
  Grid,
  Container,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@material-ui/core";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";
interface DispatchProps {}

interface StateProps {}

type Props = DispatchProps & StateProps;

interface ITransaction {
  signature: string;
  amount: number;
  originAddress: string;
  destinationAddress: string;
}

interface IChain {
  nonce: number;
  timestamp: Date;
  transactions: ITransaction[];
  hash: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    marginTop: "20px",
    display: "block",
    wordWrap: "break-word",
  },
  text: {
    width: "100%",
  },
}));


const Blockchain: React.FC<RouteComponentProps<any>> = ({ location }) => {
  const classes = useStyles();
  const [getBlockchain, setBlockchain] = React.useState<IChain[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const r1 = await axios(`http://localhost:${process.env.REACT_APP_HTTP_PORT}/chain`);
      setBlockchain(r1.data.chain);
    };
    fetchData();
  }, [setBlockchain]);
  return (
    <React.Fragment>
      <Main name={location.pathname.replace("/", "")} />
      <div className={classes.root}>
        <Container maxWidth="md">
          <Grid container spacing={5}>
            {getBlockchain?.map((e, i) => (
              <React.Fragment key={i}>
                <Grid item xs={4}>
                  <Card className={classes.root} variant="outlined">
                    <CardContent className={classes.root}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        <strong>HashCode: </strong>
                        {e?.hash}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        <strong>Timestamp: </strong>
                        {e?.timestamp}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button variant="contained" color="secondary">
                        Show Transactions
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </React.Fragment>
            ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(Blockchain);
