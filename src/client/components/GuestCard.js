import Avatar from '@material-ui/core/Avatar'
import CardHeader from '@material-ui/core/CardHeader'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContextProvider'

const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    cardContent: {
        flexGrow: 1,
    },
    cardActions: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    activity: {
        fontStyle: 'italic',
        color: theme.palette.text.secondary,
    },
    activityType: {
        textTransform: 'capitalize',
    },
}))

export default function GuestCard(props) {
    const { guest } = props
    const { showMessage, showError } = useContext(AppContext)
    const [ menuAnchor, setMenuAnchor ] = useState(null)
    const classes = useStyles()

    const activity = guest.discordPresence?.activities[0]

    const handleMenuClick = (event) => {
        setMenuAnchor(event.currentTarget)
    }

    const copy = async (content) => {
        try {
            await navigator.clipboard.writeText(content)

            showMessage('Copied to clipboard')

        } catch (err) {
            showError(`Copy to clipboard failed or isn't supported by this browser`)
        }
    }

    const closeMenu = () => {
        setMenuAnchor(null)
    }

    return (
        <Card className={classes.card}>
            <CardHeader
                avatar={
                    <Avatar classes={{ root: classes.avatar }} alt={guest.name} src={`https://cdn.discordapp.com/avatars/${guest.discordId}/${guest.discordAvatar}.jpg`}>
                        <Avatar classes={{ root: classes.avatar }} alt={guest.name}>{guest.name[0].toUpperCase()}</Avatar>
                    </Avatar>
                }
                action={
                    <IconButton onClick={handleMenuClick}>
                        <MoreVertIcon />
                    </IconButton>
                }
                title={guest.name}
                subheader={<>
                    <span className={classes.body}>{guest.nicknames.join(', ')}</span>
                    {activity &&
                        <Typography className={classes.activity} variant="subtitle2"><span className={classes.activityType}>{activity.type?.toLowerCase()}</span> {activity.name}</Typography>
                    }
                </>}
            />
            <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={closeMenu}>
                <MenuItem onClick={() => { copy(guest.ipAddress); closeMenu() }}>Copy IP Address</MenuItem>
                <MenuItem onClick={() => { copy(guest.hostname); closeMenu() }}>Copy Hostname</MenuItem>
            </Menu>
            <CardContent className={classes.cardContent}>
                <Table className={classes.table}>
                    <TableBody>
                        <TableRow>
                            <TableCell>IP Address:</TableCell>
                            <TableCell align="right">{guest.ipAddress || 'Unknown'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Hostname:</TableCell>
                            <TableCell align="right">{guest.hostname || 'Unknown'}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
