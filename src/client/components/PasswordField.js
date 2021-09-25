import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import React, { useState } from 'react'

export default function PasswordField(props) {
    const { type, ...otherProps } = props
    const [ showPassword, setShowPassword ] = useState(false)

    return (
        <TextField
            {...otherProps}
            type={showPassword ? "text" : "password"}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => { setShowPassword(!showPassword) }}
                            onMouseDown={(event) => { event.preventDefault() }}
                            edge="end"
                        >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    )
}
