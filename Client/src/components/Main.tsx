import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        marginBottom: '20px'
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    link: {
        color: '#000',
        textDecoration: 'none'
    }
}));

interface IMain {
    name: string;
}

export const Main: React.FC<IMain> = ({name}) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} onClick={handleClick} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Blockchain App : {name}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Menu
                id="menu"
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                keepMounted
                onClose={handleClose}
            >
            <MenuItem><Link className={classes.link} to="/">Dashboard</Link></MenuItem>
            <MenuItem><Link className={classes.link} to="/transaction">New transaction</Link></MenuItem>
            <MenuItem><Link className={classes.link} to="/blockchain">Blockchain</Link></MenuItem>
            <MenuItem><Link className={classes.link} to="/pool">Transaction pool</Link></MenuItem>
            </Menu>
        </div >
    );
}