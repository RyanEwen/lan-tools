import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import React from 'react'

export default function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://www.ryan-ewen.com/">
                Ryan Ewen
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}
