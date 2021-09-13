import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import PersonIcon from '@material-ui/icons/Person'
import React, { useContext, useState } from 'react'
import { Link as RouterLink } from "react-router-dom"
import Utilities from '../classes/Utilities'
import Heading from '../components/Heading'
import PasswordField from '../components/PasswordField'
import { AppContext } from '../context/AppContextProvider'

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}))

export default function Register(props) {
    const { paths, features, showMessage, showError, socket } = useContext(AppContext)
    const [waiting, setWaiting] = useState(false)
    const [complete, setComplete] = useState(false)
    const classes = useStyles()

    async function handleSubmit(event) {
        event.preventDefault()

        setWaiting(true)

        try {
            const values = Utilities.getFormValues(event.target)

            const response = await socket.send('register', {
                step: 'register',
                name: values.name,
                nicknames: values.nicknames,
                email: values.email,
            })

            showMessage(response, { variant: 'success' })
            setComplete(true)

        } catch (err) {
            showError(err)
            setWaiting(false)
        }
    }

    return (
        <Container maxWidth="xs">
            <Heading icon={<PersonIcon />}>
                Register
            </Heading>
            {!complete &&
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                id="name"
                                name="name"
                                label="Name"
                                variant="outlined"
                                autoComplete="name"
                                required
                                fullWidth
                                disabled={waiting}
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField
                                id="nicknames"
                                name="nicknames"
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
                                label="Email Address"
                                variant="outlined"
                                type="email"
                                autoComplete="email"
                                required
                                fullWidth
                                disabled={waiting}
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
                        Register
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to={paths.login} variant="body2">Already have an account?</Link>
                        </Grid>
                    </Grid>
                </form>
            }
            {complete &&
                <form className={classes.form}>
                    <Grid container spacing={2}>
                        <Typography>
                            All done - you may now log in!
                        </Typography>
                    </Grid>
                    <p></p>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to={paths.login} ariant="body2">Back to Login</Link>
                        </Grid>
                    </Grid>
                </form>
            }
        </Container>
    )
}
