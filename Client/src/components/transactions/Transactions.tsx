import React from 'react';
import { Container, Grid, TextField, makeStyles, Theme, Button, Snackbar } from '@material-ui/core';
import { connect } from 'react-redux';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { Main } from '../Main';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';

interface DispatchProps {
}

interface StateProps {
}

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
    },
    text: {
        width: '100%'
    }
}));

export const Transactions: React.FC<RouteComponentProps<any>> = ({ location }) => {
    const classes = useStyles();
    const [address, setAddress] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const handleAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };
    const handleAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
    };
    const send = async () => {
        const p1 = await axios.post(
            `http://localhost:${process.env.REACT_APP_HTTP_PORT}/transact`,
            { destinationAddress: address, amount: amount }
        );
        if (p1) setOpen(true);
    }
    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Main name={location.pathname.replace('/', '')} />
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Tx has been send
                </Alert>
            </Snackbar>
            <div className={classes.root}>
                <Container maxWidth="md">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                className={classes.text}
                                id="standard-read-only-input"
                                label="Destination address"
                                onChange={handleAddress}
                                value={address}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                className={classes.text}
                                id="standard-read-only-input"
                                label="Amount"
                                type="number"
                                onChange={handleAmount}
                                value={amount}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={send} disabled={amount.length === 0 || address.length === 0}>
                                Send
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state: any): StateProps => {
    return {
    }
}
const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Transactions);