import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import React from 'react'
import { Link as RouterLink } from "react-router-dom"
import Heading from '../components/Heading'

export default function NotFound(props) {
    return (
        <Container maxWidth="xs">
            <Heading icon={<LockOutlinedIcon />}>
                404 Not Found
            </Heading>
            {props.homePath &&
                <Grid container justifyContent="center">
                    <Grid item>
                        <Link component={RouterLink} to={props.homePath} variant="body2">Back to Home</Link>
                    </Grid>
                </Grid>
            }
        </Container>
    )
}
