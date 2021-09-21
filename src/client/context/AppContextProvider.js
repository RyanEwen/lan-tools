import Button from '@material-ui/core/Button'
import { withSnackbar } from 'notistack'
import React from "react"
import { withRouter } from "react-router-dom"
import getSocketio from '../socketio'

export const AppContext = React.createContext()

export const socket = getSocketio()

class AppContextProvider extends React.Component {
    state = {
        connected: false,
        initialized: false,
        user: null,
        serverState: null,
    }

    constructor(props) {
        super(props)

        const { match: { url } } = props

        this.paths = {
            root: `${url}`,
            login: `${url}/login`,
            auth: `/login`,
            logout: `/logout`,
            account: `${url}/account`,
            guests: `${url}/guests`,
        }
    }

    componentDidMount = async () => {
        this.unbindConnect = socket.on('connect', this.handleConnect)
        this.unbindDisconnect = socket.on('disconnect', this.handleDisconnect)
        this.unbindUser = socket.on('user', this.handleUserUpdate)
        this.unbindServerState = socket.on('state', this.handleServerStateUpdate)
    }

    componentWillUnmount = () => {
        this.unbindConnect()
        this.unbindUser()
        this.unbindServerState()
    }

    handleConnect = async () => {
        try {
            const { user, state } = await socket.send('init')

            await this.setState({
                connected: true,
                initialized: true,
                user,
                serverState: state,
            })
        } catch (err) {
            this.showError(err)
        }
    }

    handleDisconnect = () => {
        this.setState({
            connected: false,
        })
    }

    handleUserUpdate = (user) => {
        this.setState({
            user,
        })
    }

    handleServerStateUpdate = (serverState) => {
        this.setState({
            serverState,
        })
    }

    showMessage = (msg, options) => {
        this.props.enqueueSnackbar(msg, {
            autoHideDuration: 3000,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            },
            ...options,
        })
    }

    showError = (err, options) => {
        this.showMessage(err.message || err, {
            variant: 'error',
            persist: true,
            style: { whiteSpace: 'pre-line' },
            // eslint-disable-next-line react/display-name
            action: (key) => <Button onClick={() => { this.props.closeSnackbar(key) }}>Dismiss</Button>,
            ...options,
        })
    }

    closeSnackbar = this.props.closeSnackbar

    render() {
        return (
            <AppContext.Provider
                value={{
                    ...this.state,
                    showMessage: this.showMessage,
                    showError: this.showError,
                    closeSnackbar: this.closeSnackbar,
                    paths: this.paths,
                    socket,
                }}
            >
                {this.props.children}
            </AppContext.Provider>
        )
    }
}

export default withRouter(withSnackbar(AppContextProvider))

export function withAppContext(Component) {
    return function contextComponent(props) {
        return (
            <AppContext.Consumer>
                {context => <Component {...props} {...context} />}
            </AppContext.Consumer>
        )
    }
}
