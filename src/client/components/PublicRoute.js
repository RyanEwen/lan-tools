import React, { useContext } from "react"
import { Redirect, Route } from "react-router-dom"
import { AppContext } from '../context/AppContextProvider'

export default function PublicRoute({ children, ...otherProps }) {
    const { paths, user } = useContext(AppContext)

    return (
        <Route
            {...otherProps}
            render={({ location }) => {
                if (!user) {
                    return children
                }

                return (
                    <Redirect to={{ pathname: paths.root, state: { from: location } }} />
                )
            }}
        />
    )
}
