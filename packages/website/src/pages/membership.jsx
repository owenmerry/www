import React, {
  Component
} from 'react'
import {
  Link
} from 'react-router-dom'
import styled from 'styled-components'
import {
  connect
} from 'react-redux'
import {
  spacing
} from '../units'
import {
  lightLowlight
} from '../colours'
import {
  PageWrapper,
  Panel,
  Hero,
  LinkPanel,
  Button
} from '../components/panels'
import {
  HelpText
} from '../components/forms'
import membershipBackground from '../../assets/membership-bg.jpg'
import ridesBackground from '../../assets/rides-bg.jpg'
import diversityBackground from '../../assets/diversity-bg.jpg'

const PerksList = styled.ul`
  li {
    margin: ${spacing(0.25)} 0;
  }
`

const ListItem = styled.li`
  color: ${lightLowlight};
`

class MembershipPage extends Component {
  render () {
    const {
      user
    } = this.props

    let joinOrManage = (
      <>
        <Button><Link to='/profile/fopcc'>Join Friends of PCC</Link></Button>
      </>
    )

    if (user.fopcc && ((user.fopcc.status === 'active') || (user.fopcc.bc && user.fopcc.expires > Date.now()))) {
      joinOrManage = (
        <>
          <p>You are a Friend of PCC</p>
          <Button><Link to='/profile/fopcc'>Manage your Friends of PCC membership</Link></Button>
        </>
      )
    }

    return (
      <PageWrapper>
        <Hero background={membershipBackground} />
        <Panel>
          <h2>Friends of PCC</h2>
          <p>Friends of PCC is a voluntary membership scheme intended to support the activities of the club.</p>
          <p>Joining the scheme costs &pound;25 per year and entitles members to perks exclusive to Friends of PCC.</p>
          <p>These include:</p>
          <PerksList>
            <ListItem>Access to buy our club kit</ListItem>
            <ListItem>Invitations to club events and participation on club trips abroad and in the UK</ListItem>
            <ListItem>10% off parts at <a href='https://ratracecycles.com'>Rat Race Cycles</a></ListItem>
            <ListItem>10% off <a href='https://lovevelo.co.uk'>Love Velo</a> holidays (for 7 or fewer, 8 or more 1 in 8 go free)</ListItem>
            <ListItem>20% off your first in-store purchase at <a href='https://www.cafeducycliste.com/london-store/'>Cafe du Cycliste</a> near Spitalfields</ListItem>
          </PerksList>
          {joinOrManage}
          <HelpText>The fee is due annually and is non-refundable. Fees go towards the club's running costs such as our continued affiliation to British Cycling, kit design fees, venue hire and other projects designed to benefit members.</HelpText>
          <h2>Social Rides</h2>
          <p>Our weekend Social Rides are free to join - we welcome all comers whether they choose to become Friends of PCC or not.</p>
        </Panel>
        <LinkPanel background={ridesBackground}>
          <Link to='/rides'>Rides</Link>
        </LinkPanel>
        <LinkPanel background={diversityBackground}>
          <Link to='/diversity'>Diversity</Link>
        </LinkPanel>
      </PageWrapper>
    )
  }
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(MembershipPage)
