import 'typeface-roboto'
import React from 'react'
import ReactDOM from 'react-dom'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import AppContextProvider from './context/AppContextProvider'
import App from './views/App'

const baseURL = process.env.BASEURL || 'tan-lools'

ReactDOM.render(
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
    </SnackbarProvider>,
    document.getElementById('root')
)
