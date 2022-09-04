import React from 'react';
import './App.css';
import Section from './enums/section';
import SubscriptionStatus from './enums/subscriptionStatus';
import { AvailableTeam } from './interfaces/availableTeam';
import Menu from './menu';
import Feedback from './sections/feedback';
import Help from './sections/help';
import Home from './sections/home';
import Statistics from './sections/statistics';
import { fetchAvailableTeams, getApplicationServerKey, saveSubscription, sortBySport } from './utils/helper';

interface AppProps { }

interface AppStates {
  subscriptionStatus: SubscriptionStatus,
  availableTeams: AvailableTeam[],
  section: Section,
}

class App extends React.Component<AppProps, AppStates> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      subscriptionStatus: SubscriptionStatus.NotSubscribed,
      availableTeams: [],
      section: Section.Home,
    };

    this.register = this.register.bind(this);
    this.controlSection = this.controlSection.bind(this);
  }

  componentDidMount() {
    this.updatesubscriptionStatus();

    fetchAvailableTeams()
      .then((data) => {
        const teams: AvailableTeam[] = data.teams;
        teams.sort(sortBySport); // this is needed so that 'groupBy' method of Autocomplete (Material-UI) works without duplications. 

        this.setState({ availableTeams: teams });
      });
  }

  updatesubscriptionStatus() {
    if (!('Notification' in window)) {
      alert('Sorry! We unfortunately don\'t have support for your OS/browser. Please come back later on!');
      return;
    }

    if (Notification.permission === 'granted') {
      this.setState({ subscriptionStatus: SubscriptionStatus.Subscribed });
    } else {
      this.setState({ subscriptionStatus: SubscriptionStatus.NotSubscribed })
    }
  }

  register(teamsIds: number[]) {
    this.updatesubscriptionStatus();
    this.setState({ subscriptionStatus: SubscriptionStatus.InProgress });

    if (!('serviceWorker' in navigator)) {
      alert('Your browser does not support service workers.');
      this.setState({ subscriptionStatus: SubscriptionStatus.NotSubscribed })
      return;
    }

    navigator.serviceWorker.register('sw.js')

    navigator.serviceWorker.ready
      .then(registration => {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: getApplicationServerKey()
        };

        return registration.pushManager.subscribe(subscribeOptions);
      })
      .then((pushSubscription: any) => {
        return saveSubscription(pushSubscription, teamsIds);
      })
      .then(() => {
        this.setState({ subscriptionStatus: SubscriptionStatus.Subscribed });
      })
      .catch(() => {
        alert('Error during your registration');
        this.setState({ subscriptionStatus: SubscriptionStatus.NotSubscribed });
      });
  }

  controlSection(section: Section) {
    this.setState({ section: section });
  }

  render() {
    let page;
    if (this.state.section === Section.Home) {
      page = <div>
        <Home
          onClick={this.register}
          subscriptionStatus={this.state.subscriptionStatus}
          availableTeams={this.state.availableTeams}
        ></Home>
      </div>;
    } else if (this.state.section === Section.Statistics) {
      page = <Statistics></Statistics>;
    } else if (this.state.section === Section.Help) {
      page = <Help></Help>;
    } else if (this.state.section === Section.Feedback) {
      page = <Feedback></Feedback>;
    }

    return (
      <div className="App">
        <div className="Page">
          {page}
        </div>
        <div className="Menu">
          <Menu section={this.state.section} onClick={this.controlSection}></Menu>
        </div>
      </div>
    );
  }
}

export default App;

