import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
    body: {
        display: 'block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    addresses: {
        textAlign: 'right',
        // color: grey[500],
    },
}))

export default function GuestListItem(props) {
    const { guest, onClick } = props
    const classes = useStyles()

    function handleClick() {
        onClick(guest)
    }

    return (
        <ListItem
            key={guest.id}
            button
            onClick={handleClick}
        >
            <ListItemAvatar>
                <Avatar>{guest.name[0].toUpperCase()}</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={guest.name}
                secondary={<span className={classes.body}>{guest.nicknames.join(', ')}</span>}
            />
            <div className={classes.addresses}>
                <Typography>{guest.ipAddress}</Typography>
                <Typography>{guest.hostname}</Typography>
            </div>
        </ListItem>
    )
}
