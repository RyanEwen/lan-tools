import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import React, { useContext } from 'react'
import { DiscordLoginButton } from "react-social-login-buttons"
import Heading from '../components/Heading'
import { AppContext } from '../context/AppContextProvider'

const useStyles = makeStyles((theme) => ({
    spacer: {
        marginTop: theme.spacing(4),
    },
}))

export default function Login(props) {
    const { paths } = useContext(AppContext)
    const classes = useStyles()

    return (
        <Container maxWidth="xs">
            <Heading icon={<LockOutlinedIcon />}>
                You are not logged in
            </Heading>
            <div className={classes.spacer} />
            <DiscordLoginButton onClick={() => { window.location.href = paths.auth }} />
        </Container>
    )
}
