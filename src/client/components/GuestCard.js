import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React from 'react'

const useStyles = makeStyles({
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
})

export default function GuestCard(props) {
    const { guest } = props
    const classes = useStyles()

    return (
        <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5">
                    {guest.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {guest.nicknames.join(', ')}
                </Typography>
                <p />
                <Typography>{guest.ipAddress}</Typography>
                <Typography>{guest.hostname}</Typography>
            </CardContent>
            {/* <CardActions className={classes.cardActions}>

            </CardActions> */}
        </Card>
    )
}
