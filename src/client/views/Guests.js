import Avatar from '@material-ui/core/Avatar'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import React from 'react'
import { Link as RouterLink, Route, Switch, useParams, useRouteMatch, withRouter } from "react-router-dom"
import Heading from '../components/Heading'
import { withAppContext } from '../context/AppContextProvider'

const styles = (theme) => ({
    loading: {
        marginTop: theme.spacing(2),
    },
    marginAbove: {
        marginTop: theme.spacing(2),
    },
    box: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    inline: {
        display: 'inline',
    },
    sumListItemText: {
        flex: 'none',
    },
})

class Guests extends React.Component {
    state = {
        waits: 1,
        guests: [],
    }

    async componentDidMount() {
        await this.getGuests()

        this.setState({
            waits: this.state.waits - 1,
        })
    }

    getGuests = async () => {
        await this.setState({
            waits: this.state.waits + 1,
        })

        try {
            const { guests } = await this.props.socket.send('guests', {
                step: 'getGuests',
            })

            await this.setState({
                guests,
            })

        } catch (err) {
            this.props.showError(err)
        }

        await this.setState({
            waits: this.state.waits - 1,
        })
    }

    render() {
        const { classes, history, match } = this.props
        const { guests, waits } = this.state
        const url = match.path

        return (
            <Container maxWidth="sm">
                <Heading icon={<MenuBookIcon />}>
                    Guests
                </Heading>
                {waits > 0 &&
                    <LinearProgress className={classes.loading} />
                }
                {waits == 0 &&
                    <Switch>
                        <Route path={`${url}/`} exact>
                            <List>
                                <GuestList
                                    classes={classes}
                                    guests={guests}
                                    onGuestSelect={(guestId) => {
                                        history.push(`${url}/guest-${guestId}`)
                                    }}
                                />
                            </List>
                        </Route>
                    </Switch>
                }
            </Container>
        )
    }
}

export default withAppContext(withRouter(withStyles(styles, { withTheme: true })(Guests)))

const useStyles = makeStyles((theme) => ({
    body: {
        display: 'block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    ipAddress: {
        position: 'absolute',
        top: '8px',
        right: '16px',
        // color: grey[500],
    },
    inline: {
        display: 'inline',
    },
}))

function GuestList(props) {
    const { guests } = props
    const classes = useStyles()

    return guests.map((guest) =>
        <ListItem
            key={guest.id}
            button
            onClick={() => { props.onGuestSelect(guest.id) }}
        >
            <ListItemIcon>
                <Avatar>{guest.name[0].toUpperCase()}</Avatar>
            </ListItemIcon>
            <ListItemText
                primary={guest.name}
                secondary={<span className={classes.body}>{guest.nicknames.join(', ')}</span>}
            />
            <div className={classes.ipAddress}>{guest.ipAddress}</div>
        </ListItem>
    )
}
