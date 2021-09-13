import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React from 'react'

const useStyles = makeStyles((theme) => ({
    headGrid: {
        marginTop: theme.spacing(2),
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
}))

export default function Heading(props) {
    const { children, icon } = props
    const classes = useStyles()

    return (
        <Grid container direction="column" alignItems="center" className={classes.headGrid}>
            {icon &&
                <Avatar className={classes.avatar}>
                    {icon}
                </Avatar>
            }
            <Typography variant="h5">
                {children}
            </Typography>
        </Grid>
    )
}
