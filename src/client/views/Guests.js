import _ from 'lodash'
import Container from '@material-ui/core/Container'
import List from '@material-ui/core/List'
import { withStyles } from '@material-ui/core/styles'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import React from 'react'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import { Link as RouterLink, Route, Switch, useParams, useRouteMatch, withRouter } from "react-router-dom"
import { withAppContext } from '../context/AppContextProvider'
import Heading from '../components/Heading'
import GuestListItem from '../components/GuestListItem'
import GuestCard from '../components/GuestCard'
import ClearableTextField from '../components/ClearableTextField'

const styles = (theme) => ({
    breadcrumbs: {
        marginTop: theme.spacing(2),
    },
    guestBox: {
        marginTop: theme.spacing(2),
    },
})

const searchProperties = [
    'name',
    'nicknames',
    'ipAddress',
    'hostname',
]

class Guests extends React.Component {
    state = {
        filterTerm: '',
    }

    render() {
        const { classes, history, match, serverState } = this.props
        const { filterTerm } = this.state
        const { guests } = serverState
        const url = match.path
        const filterPattern = new RegExp("(?=.*?\\b" + filterTerm.split(" ").join(")(?=.*?\\b") + ").*", "i")
        const filteredGuests = !filterTerm.length ? guests : guests.filter(guest => {
            return _.flatten(_.values(_.pick(guest, searchProperties))).join(' ').match(filterPattern)
        })

        return (
            <Container maxWidth="sm">
                <Heading icon={<MenuBookIcon />}>
                    Guests
                </Heading>
                <Grid container justifyContent="space-between" alignItems="flex-end">
                    <Grid className={classes.breadcrumbs} item xs={12} sm={7} md={9} lg={9}>
                        <Route path={`${url}/:guestId?`}>
                            <MyBreadcrumbs parentUrl={url} guests={guests} />
                        </Route>
                    </Grid>
                    <Route path={`${url}`} exact>
                        <Grid item xs={12} sm={5} md={3} lg={3}>
                            <ClearableTextField
                                id="filter"
                                name="filter"
                                label="Filter"
                                value={filterTerm}
                                fullWidth
                                onInput={(event) => { this.setState({ filterTerm: event.target.value }) }}
                                onClearClick={() => { this.setState({ filterTerm: '' }) }}
                            />
                        </Grid>
                    </Route>
                </Grid>
                <Switch>
                    <Route path={`${url}/`} exact>
                        <List>
                            {_.sortBy(filteredGuests, ['name']).map(guest =>
                                <GuestListItem
                                    key={guest.id}
                                    guest={guest}
                                    onClick={(guest) => { history.push(`${url}/${guest.id}`) }}
                                />
                            )}
                        </List>
                    </Route>
                    <Route path={`${url}/:guestId`}>
                        <Box className={classes.guestBox}>
                            <MyGuestCard guests={guests} />
                        </Box>
                    </Route>
                </Switch>
            </Container>
        )
    }
}

function MyBreadcrumbs(props) {
    const { url } = useRouteMatch()
    const { guestId } = useParams()
    const { parentUrl, guests } = props

    if (!guestId) {
        return (
            <Breadcrumbs aria-label="breadcrumb">
                <Link component={RouterLink} to={parentUrl} color="textPrimary">Guests</Link>
            </Breadcrumbs>
        )
    } else {
        const selectedGuest = guests.find(guest => guest.id == guestId)

        return (
            <Breadcrumbs aria-label="breadcrumb">
                <Link component={RouterLink} to={parentUrl} color="inherit">Guests</Link>
                <Link component={RouterLink} to={url} color="textPrimary">{selectedGuest.name}</Link>
            </Breadcrumbs>
        )
    }
}

function MyGuestCard(props) {
    const { guestId } = useParams()
    const { guests } = props
    const guest = guests.find(guest => guest.id == guestId)

    return (
        <GuestCard guest={guest} />
    )
}

export default withAppContext(withRouter(withStyles(styles, { withTheme: true })(Guests)))
