import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import PersonIcon from '@material-ui/icons/Person'
import React, { useContext, useState } from 'react'
import { Link as RouterLink } from "react-router-dom"

import Utilities from '../classes/Utilities'

import Heading from '../components/Heading'
import Chips from '../components/Chips'

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
    const { paths, showMessage, showError, socket } = useContext(AppContext)
    const [waiting, setWaiting] = useState(false)
    const [complete, setComplete] = useState(false)
    const [nicknames, setNicknames] = useState([])
    const classes = useStyles()

    const handleNicknameAdd = async (value) => {
        try {
            let nickname = value.trim()

            if (!nickname) {
                throw new Error('Empty nicknames are not allowed')
            }

            if (nicknames.includes(nickname)) {
                throw new Error('Nickname is already in list')
            }

            setNicknames([ ...nicknames, nickname ])
        } catch (err) {
            showError(err)
        }
    }

    const handleNicknameRemove = async (value) => {
        setNicknames(nicknames.filter(nickname => nickname != value))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        setWaiting(true)

        try {
            const values = Utilities.getFormValues(event.target)

            const response = await socket.send('register', {
                step: 'register',
                email: values.email,
                name: values.name,
                nicknames,
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
                            <Chips
                                label="Add Nickname"
                                helperText="Type a nickname then press Enter to add it"
                                chips={nicknames}
                                disabled={waiting}
                                onChipAdd={handleNicknameAdd}
                                onChipRemove={handleNicknameRemove}
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
