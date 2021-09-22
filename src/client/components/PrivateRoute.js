import React, { useContext } from "react"
import { Redirect, Route } from "react-router-dom"
import { AppContext } from '../context/AppContextProvider'
import Login from '../views/Login'

export default function PrivateRoute({ children, disabled = false, ...otherProps }) {
    const { paths, user, serverState } = useContext(AppContext)

    return (
        <Route
            {...otherProps}
            render={({ location }) => {
                if (!disabled && user && serverState) {
                    return children
                }

                if (disabled) {
                    return <Redirect to={{ pathname: paths.login, state: { from: location } }} />
                }

                return <Login />
            }}
        />
    )
}
