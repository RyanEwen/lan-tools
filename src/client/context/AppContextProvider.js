import Button from '@material-ui/core/Button'
import { withSnackbar } from 'notistack'
import React from "react"
import { withRouter } from "react-router-dom"
import getSocketio from '../socketio'
import { ThemeProvider } from '@material-ui/core/styles'

export const AppContext = React.createContext()

export const socket = getSocketio()

class AppContextProvider extends React.Component {
    state = {
        connected: false,
        initialized: false,
        user: null,
    }

    constructor(props) {
        super(props)

        const { match: { url } } = props

        this.paths = {
            root: `${url}`,
            register: `${url}/register`,
            login: `${url}/login`,
            account: `${url}/account`,
            guests: `${url}/guests`,
        }
    }

    componentDidMount = async () => {
        this.unbindConnect = socket.on('connect', this.handleConnect)
        this.unbindDisconnect = socket.on('disconnect', this.handleDisconnect)
        this.unbindSession = socket.on('session', this.handleSessionUpdate)
        this.unbindCartUpdate = socket.on('cartUpdate', this.handleCartUpdate)
    }

    componentWillUnmount = () => {
        this.unbindConnect()
        this.unbindSession()
        this.unbindDisconnect()
    }

    initialFetch = async () => {
        try {
            const { user } = await socket.send('init')

            await this.setState({
                connected: true,
                initialized: true,
                user,
            })
        } catch (err) {
            this.showError(err)
        }
    }

    handleConnect = () => {
        this.initialFetch()
    }

    handleDisconnect = () => {
        this.setState({
            connected: false,
        })
    }

    handleSessionUpdate = ({ user }) => {
        const { history, location } = this.props

        this.setState({
            user,
        })

        // go to to previous view if session was populated
        if (user && !this.state.user) {
            if (location.state) {
                history.replace(location.state.from)
            }
        }
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
                <ThemeProvider>
                    {this.props.children}
                </ThemeProvider>
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
