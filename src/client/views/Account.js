import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import PersonIcon from '@material-ui/icons/Person'
import React, { useContext, useState } from 'react'
import Utilities from '../classes/Utilities'

import Chips from '../components/Chips'
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
    const { user, showMessage, showError, socket } = useContext(AppContext)
    const [waiting, setWaiting] = useState(false)
    const [nicknames, setNicknames] = useState(user.nicknames)
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

            setNicknames([...nicknames, nickname])
        } catch (err) {
            showError(err)
        }
    }

    const handleNicknameRemove = async (value) => {
        setNicknames(nicknames.filter(nickname => nickname != value))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        setWaiting(true)

        try {
            const values = Utilities.getFormValues(event.target)

            const response = await socket.send('account', {
                name: values.name,
                nicknames,
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
                    <Grid item xs={12} sm={12}>
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
                    Update Account
                </Button>
            </form>
        </Container>
    )
}
