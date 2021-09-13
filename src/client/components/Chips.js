import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'

const useStyles = makeStyles((theme) => ({
    chipContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    chip: {
        margin: theme.spacing(0.5),
    },
}))

const actionKeys = [
    'Enter',
    'Tab',
]

export default function Chips(props) {
    const { chips, onChipAdd, onChipClick, onChipRemove, ...otherProps } = props
    const classes = useStyles()
    let [value, setValue] = useState('')

    return <>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    {...otherProps}
                    variant="outlined"
                    autoComplete="off"
                    value={value}
                    fullWidth
                    onInput={(e) => { setValue(e.target.value) }}
                    onKeyDown={(e) => {
                        if (actionKeys.includes(e.key)) {
                            e.preventDefault()

                            setValue('')

                            onChipAdd(e.target.value)
                        }
                    }}
                />
            </Grid>
            {chips.length > 0 &&
                <Grid item xs={12}>
                    <Paper component="ul" className={classes.chipContainer}>
                        {chips.map(chip =>
                            <li key={chip}>
                                <Chip
                                    className={classes.chip}
                                    avatar={<Avatar>{chip[0].toUpperCase()}</Avatar>}
                                    label={chip}
                                    onClick={() => { onChipClick(chip) }}
                                    onDelete={() => { onChipRemove(chip) }}
                                />
                            </li>
                        )}
                    </Paper>
                </Grid>
            }
        </Grid>
    </>
}
