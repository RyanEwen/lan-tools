import _ from 'lodash'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import List from '@material-ui/core/List'
import { withStyles } from '@material-ui/core/styles'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import React from 'react'
import { Route, Switch, withRouter } from "react-router-dom"
import { withAppContext } from '../context/AppContextProvider'
import Heading from '../components/Heading'
import GuestListItem from '../components/GuestListItem'

const styles = (theme) => ({

})

class Guests extends React.Component {
    render() {
        const { history, match, serverState } = this.props
        const { guests } = serverState
        const url = match.path

        return (
            <Container maxWidth="sm">
                <Heading icon={<MenuBookIcon />}>
                    Guests
                </Heading>
                <Switch>
                    <Route path={`${url}/`} exact>
                        <List>
                            {_.sortBy(guests, ['name']).map(guest =>
                                <GuestListItem
                                    key={guest.id}
                                    guest={guest}
                                    onClick={(guest) => { history.push(`${url}/guest-${guest.id}`) }}
                                />
                            )}
                        </List>
                    </Route>
                </Switch>
            </Container>
        )
    }
}

export default withAppContext(withRouter(withStyles(styles, { withTheme: true })(Guests)))
