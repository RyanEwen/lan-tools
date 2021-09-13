import MenuItem from '@material-ui/core/MenuItem'
import React from 'react'
import { NavLink } from 'react-router-dom'

export default class NavMenuItem extends React.Component {
    render() {
        return (
            <MenuItem component={NavLink} {...this.props}>
                {this.props.children}
            </MenuItem>
        )
    }
}
