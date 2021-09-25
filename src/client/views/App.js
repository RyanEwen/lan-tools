import AppBar from '@material-ui/core/AppBar'
import Backdrop from '@material-ui/core/Backdrop'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import blue from '@material-ui/core/colors/blue'
import CssBaseline from '@material-ui/core/CssBaseline'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import Menu from '@material-ui/core/Menu'
import Snackbar from '@material-ui/core/Snackbar'
import { withStyles } from '@material-ui/core/styles'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import React from "react"
import { Link as RouterLink, Route, Switch, Redirect, withRouter } from "react-router-dom"
import Copyright from '../components/Copyright'
import NavListItem from '../components/NavListItem'
import NavMenuItem from '../components/NavMenuItem'
import PrivateRoute from '../components/PrivateRoute'
import { withAppContext } from '../context/AppContextProvider'
import NotFound from './404'
import Account from './Account'
import Guests from './Guests'
// import Welcome from './Welcome'

const styles = (theme) => ({
    appBar: {
        backgroundColor: blue[700],
    },
    toolbar: theme.mixins.toolbar,
    title: {
        flexGrow: 1,
        textDecoration: 'none',
        color: 'inherit',
        '&:visited': {
            color: 'inherit',
        },
        '&:active': {
            color: 'inherit',
        },
    },
    drawerList: {
        minWidth: 200,
    },
    outerBox: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        overflow: 'auto',
    },
    innerBox: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
    },
    connectingBox: {
        marginTop: theme.spacing(5),
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
    },
    reconnectingBackdrop: {
        zIndex: theme.zIndex.drawer + 1,
    },
})

class App extends React.Component {
    scrollPaneRef = React.createRef()

    state = {
        drawerOpen: false,
        menuAnchor: null,
    }

    componentDidUpdate(prevProps) {
        // scoll back to top on page change
        if (this.props.location !== prevProps.location && this.scrollPaneRef.current) {
            this.scrollPaneRef.current.scrollTop = 0
        }
    }

    openDrawer = () => {
        this.setState({ drawerOpen: true })
    }

    closeDrawer = () => {
        this.setState({ drawerOpen: false })
    }

    handleMenuClick = (event) => {
        this.setState({
            menuAnchor: event.currentTarget,
        })
    }

    closeMenu = () => {
        this.setState({
            menuAnchor: null,
        })
    }

    render() {
        const { classes, paths, initialized, connected, user } = this.props
        const { drawerOpen, menuAnchor } = this.state

        if (!initialized) {
            return (
                <Box className={classes.connectingBox}>
                    <CircularProgress />
                </Box>
            )
        }

        return <>
            <CssBaseline />
            {user &&
                <SwipeableDrawer open={drawerOpen} onClose={this.closeDrawer} onOpen={this.openDrawer}>
                    <List className={classes.drawerList} component="nav">
                        <NavListItem onClick={this.closeDrawer} to={paths.root} primary="Home" exact />
                        <NavListItem onClick={this.closeDrawer} to={paths.guests} primary="Guests" />
                    </List>
                </SwipeableDrawer>
            }
            <AppBar classes={{ root: classes.appBar }} position='fixed'>
                <Toolbar>
                    {user &&
                        <Tooltip title="Menu">
                            <IconButton
                                color="inherit"
                                edge="start"
                                aria-label="open menu"
                                onClick={this.openDrawer}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Tooltip>
                    }
                    <Typography component={RouterLink} to={paths.root} variant="h6" noWrap className={classes.title}>LAN Tools</Typography>
                    {user &&
                        <Tooltip title="Account Menu">
                            <IconButton
                                color="inherit"
                                edge="end"
                                aria-label="menu"
                                onClick={this.handleMenuClick}
                            >
                                <AccountCircleIcon />
                            </IconButton>
                        </Tooltip>
                    }
                    {user &&
                        <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={this.closeMenu}>
                            <NavMenuItem onClick={this.closeMenu} to={paths.account}>My Account</NavMenuItem>
                            <MenuItem onClick={() => { window.location.href = paths.logout }}>Logout</MenuItem>
                        </Menu>
                    }
                </Toolbar>
            </AppBar>
            <div className={classes.toolbar} />
            <Box ref={this.scrollPaneRef} className={classes.outerBox}>
                <Box className={classes.innerBox}>
                    <Switch>
                        {/* Private views */}

                        <PrivateRoute path={paths.root} exact>
                            {/* <Welcome /> */}
                            <Redirect to={paths.guests} />
                        </PrivateRoute>

                        <PrivateRoute path={paths.guests}>
                            <Guests />
                        </PrivateRoute>

                        <PrivateRoute path={paths.account}>
                            <Account />
                        </PrivateRoute>

                        {/* 404 Not Found */}

                        <Route path={paths.root}>
                            <NotFound homePath={paths.root} />
                        </Route>
                    </Switch>
                </Box>

                <Box mt={1}>
                    <Copyright />
                </Box>
            </Box>

            {/* Reconnecting */}
            <Backdrop className={classes.reconnectingBackdrop} open={!connected}>
                <Snackbar open={!connected} message="Reconnecting..." />
            </Backdrop>
        </>
    }
}

export default withAppContext(withRouter(withStyles(styles, { withTheme: true })(App)))
