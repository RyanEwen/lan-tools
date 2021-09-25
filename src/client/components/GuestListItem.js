import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import stringToColor from 'string-to-color'

const useStyles = makeStyles(theme => ({
    avatar: (props) => ({
        backgroundColor: stringToColor(
            props.guest.name.split(' ').map(name => name[0]).join('').toUpperCase() // guest initials
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
    },
    activity: {
        fontStyle: 'italic',
        color: theme.palette.text.secondary,
    },
    activityType: {
        textTransform: 'capitalize',
    },
}))

export default function GuestListItem(props) {
    const { guest, onClick } = props
    const classes = useStyles(props)
    const activity = guest.discordPresence?.activities[0]

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
                <Avatar classes={{ root: classes.avatar }} alt={guest.name} src={`https://cdn.discordapp.com/avatars/${guest.discordId}/${guest.discordAvatar}.jpg`}>
                    <Avatar classes={{ root: classes.avatar }} alt={guest.name}>{guest.name[0].toUpperCase()}</Avatar>
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={guest.name}
                secondary={<>
                    <span className={classes.body}>{guest.nicknames.join(', ')}</span>
                    {activity &&
                        <Typography className={classes.activity} variant="subtitle2"><span className={classes.activityType}>{activity.type?.toLowerCase()}</span> {activity.name}</Typography>
                    }
                </>}
            />
            <div className={classes.addresses}>
                <Typography>{guest.ipAddress}</Typography>
                <Typography>{guest.hostname}</Typography>
            </div>
        </ListItem>
    )
}
