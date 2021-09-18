import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import React, { useContext, useState } from 'react'
import { Link as RouterLink, useHistory } from "react-router-dom"
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
    marginAbove: {
        marginTop: theme.spacing(2),
    },
}))

export default function Login(props) {
    const { paths, showMessage, showError, socket } = useContext(AppContext)
    const [waiting, setWaiting] = useState(false)
    const classes = useStyles()

    async function handleSubmit(event) {
        event.preventDefault()

        setWaiting(true)

        try {
            const values = Utilities.getFormValues(event.target)

            const response = await socket.send('login', {
                email: values.email,
            })

            showMessage(response.msg, { variant: 'success' })

        } catch (err) {
            showError(err)
            setWaiting(false)
        }
    }

    return (
        <Container maxWidth="xs">
            <Heading icon={<LockOutlinedIcon />}>
                Login
            </Heading>
            <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
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
                    Login
                </Button>
            </form>
            <Grid container justifyContent="flex-end">
                <Grid item>
                    <Link component={RouterLink} to={paths.register} variant="body2">Need an account?</Link>
                </Grid>
            </Grid>
        </Container>
    )
}
