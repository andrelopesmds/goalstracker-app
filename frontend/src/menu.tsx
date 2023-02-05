import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { Home, Help, BarChart, Feedback } from '@material-ui/icons';
import Section from './enums/section';

interface MenuProps {
  onClick: Function,
  section: Section,
};

const Menu = (props: MenuProps) => {
  return <BottomNavigation
    value={props.section}
    onChange={(_event: any, newValue: Section) => {
      props.onClick(newValue);
    }}
    showLabels
  >
    <BottomNavigationAction value={Section.Home} label="Home" icon={<Home />} />
    <BottomNavigationAction value={Section.Statistics} label="Statistics" icon={<BarChart />} />
    <BottomNavigationAction value={Section.Feedback} label="Feedback" icon={<Feedback />} />
    <BottomNavigationAction value={Section.Help} label="Help" icon={<Help />} />
  </BottomNavigation>
}

export default Menu;