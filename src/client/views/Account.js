import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import PersonIcon from '@material-ui/icons/Person'
import React, { useContext, useState } from 'react'
import { Link as RouterLink } from "react-router-dom"
import Utilities from '../classes/Utilities'
import Heading from '../components/Heading'
import { AppContext } from '../context/AppContextProvider'

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    validHelper: {
        color: green[500],
    },
}))

export default function Account(props) {
    const { paths, user, showMessage, showError, socket } = useContext(AppContext)
    const [waiting, setWaiting] = useState(false)
    const classes = useStyles()

    async function handleSubmit(event) {
        event.preventDefault()

        setWaiting(true)

        try {
            const values = Utilities.getFormValues(event.target)

            const response = await socket.send('account', {
                name: values.name,
                nicknames: values.nicknames,
            })

            showMessage(response, { variant: 'success' })

        } catch (err) {
            showError(err)
        }

        setWaiting(false)
    }

    return (
        <Container maxWidth="xs">
            <Heading icon={<PersonIcon />}>
                My Account
            </Heading>
            <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="name"
                            name="name"
                            label="Name"
                            defaultValue={user.name}
                            variant="outlined"
                            autoComplete="name"
                            required
                            fullWidth
                            disabled={waiting}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="nicknames"
                            name="nicknames"
                            defaultValue={user.nicknames}
                            label="Nicknames"
                            variant="outlined"
                            autoComplete="nickname"
                            required
                            fullWidth
                            disabled={waiting}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="email"
                            name="email"
                            defaultValue={user.email}
                            label="Email Address"
                            variant="outlined"
                            type="email"
                            autoComplete="email"
                            required
                            fullWidth
                            disabled={true}
                        />
                    </Grid>
                </Grid>
                <Button
                    className={classes.submit}
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={waiting}
                >
                    Update Account
                </Button>
            </form>
        </Container>
    )
}
