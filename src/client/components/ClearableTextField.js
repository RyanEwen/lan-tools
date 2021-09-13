import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import ClearIcon from '@material-ui/icons/Clear'
import React from 'react'

export default function ClearableTextField(props) {
    const { onClearClick, ...otherProps } = props

    return (
        <TextField
            {...otherProps}
            autoComplete="off"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="clear"
                            onClick={() => { props.onClearClick() }}
                            onMouseDown={(event) => { event.preventDefault() }}
                            edge="end"
                        >
                            {props.value ? <ClearIcon /> : null}
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    )
}
