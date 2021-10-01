import 'typeface-roboto'
import React from 'react'
import ReactDOM from 'react-dom'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import blue from '@material-ui/core/colors/blue'
import yellow from '@material-ui/core/colors/yellow'
import AppContextProvider from './context/AppContextProvider'
import App from './views/App'

const baseURL = process.env.BASEURL || 'tan-lools'

const theme = createTheme({
    palette: {
        type: 'dark',
        primary: {
            main: blue[800],
        },
        secondary: {
            main: yellow[600],
        },
    },
})

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <SnackbarProvider>
            <Router>
                <Switch>
                    {/* App */}
                    <Route path={`/${baseURL}`}>
                        <AppContextProvider>
                            <App />
                        </AppContextProvider>
                    </Route>

                    {/* Catch-all */}
                    <Route>
                        <Redirect to={`/${baseURL}`} />
                    </Route>
                </Switch>
            </Router>
        </SnackbarProvider>
    </ThemeProvider>,
    document.getElementById('root')
)
