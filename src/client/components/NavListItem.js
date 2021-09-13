import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import React from 'react'
import { NavLink } from 'react-router-dom'

export default function NavListItem(props) {
    return (
        <li>
            <ListItem
                component={NavLink}
                button
                activeClassName="Mui-selected"
                {...props}
            >
                <ListItemText primary={props.primary} />
            </ListItem>
        </li>
    )
}
