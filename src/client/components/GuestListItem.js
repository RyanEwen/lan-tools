import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import stringToColor from 'string-to-color'

const useStyles = makeStyles({
    avatar: (props) => ({
        backgroundColor: stringToColor(
            // guest initials
            props.guest.name.split(' ').map(name => name[0]).join('').toUpperCase()
        ),
    }),
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
})

export default function GuestListItem(props) {
    const { guest, onClick } = props
    const classes = useStyles(props)

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
                <Avatar alt={guest.name} classes={{ root: classes.avatar }}>{guest.name[0].toUpperCase()}</Avatar>
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
