import React, { useEffect } from "react";
import './App.css';
import Section from "./enums/section";
import SubscriptionStatus from "./enums/subscriptionStatus";
import { AvailableTeam } from "./interfaces/availableTeam";
import Menu from "./menu";
import Home from "./sections/home";
import Statistics from "./sections/statistics";
import Help from "./sections/help";
import Feedback from "./sections/feedback";
import { getApplicationServerKey, sortBySport } from "./utils/helper";
import { saveSubscription } from "./api/subscriptions";
import { fetchAvailableTeams } from "./api/teams";

function App() {
  const [section, setSection] = React.useState(Section.Home)
  const [subscriptionStatus, setSubscriptionStatus] = React.useState(SubscriptionStatus.NOT_SUBSCRIBED)
  const [availableTeams, setAvailableTeams] = React.useState<AvailableTeam[]>([])

  useEffect(() => {
    updatesubscriptionStatus();

    fetchAvailableTeams()
      .then((data) => {
        const teams: AvailableTeam[] = data.teams;
        teams.sort(sortBySport); // this is needed so that 'groupBy' method of Autocomplete (Material-UI) works without duplications. 

        setAvailableTeams(teams)
      });
  }, [])

  function updatesubscriptionStatus() {
    if (!('Notification' in window)) {
      alert('Sorry! We unfortunately don\'t have support for your OS/browser. Please come back later on!');
      return;
    }

    if (Notification.permission === 'granted') {
      setSubscriptionStatus(SubscriptionStatus.SUBSCRIBED);
    } else {
      setSubscriptionStatus(SubscriptionStatus.NOT_SUBSCRIBED)
    }
  }
  function register(teamsIds: number[]) {
    updatesubscriptionStatus()

    setSubscriptionStatus(SubscriptionStatus.IN_PROGRESS)

    if (!('serviceWorker' in navigator)) {
      alert('Your browser does not support service workers.');
      setSubscriptionStatus(SubscriptionStatus.NOT_SUBSCRIBED)
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
        setSubscriptionStatus(SubscriptionStatus.SUBSCRIBED)
      })
      .catch(() => {
        alert('Error during your registration');
        setSubscriptionStatus(SubscriptionStatus.NOT_SUBSCRIBED)
      });
  }

  let page;
  if (section === Section.Home) {
    page = <div>
      <Home
        onClick={register}
        subscriptionStatus={subscriptionStatus}
        availableTeams={availableTeams}
      ></Home>
    </div>;
  } else if (section === Section.Statistics) {
    page = <Statistics></Statistics>;
  } else if (section === Section.Help) {
    page = <Help></Help>;
  } else if (section === Section.Feedback) {
    page = <Feedback></Feedback>;
  }

  return (
    <div className="App">
      <div className="Page">
        {page}
      </div>
      <div className="Menu">
        <Menu section={section} onClick={(section: Section) => setSection(section)}></Menu>
      </div>
    </div>
  );
};

export default App;
