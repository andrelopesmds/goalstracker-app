const Help = () => {
  const helpStyle = {
    fontSize: '12px',
    margin: '0px 24px'
  }

  return (
    <div style={helpStyle}>
      <h2>
        Goalstracker is a simple to use web app that tracks sports events and sends messages to the users
        when games start or your favorite team scores a goal!
      </h2>
      <h2>
        You are able to configure which team(s) you would like to follow and only receive notifications for that ones 
      </h2>
      <h2>
        Subscribing is totally free and very simple, just follow the steps below:
        <ul>
          <li>Go to the home page and click on "Subscribe"</li>
          <li>Select one or more teams and click on "Confirm"</li>
          <li>You will be asked to permit notifications, click on "Allow"</li>
          <li>In a few seconds, you should receive a push notification to confirm your subscription is completed</li>
          <li>You are all set now, ready to follow of your favorite team!</li>
        </ul>
      </h2>
      <h2>
        We strive to improve Goalstracker each day! In case you have any comments/suggestions, please reach out to us using the feedback tab, thanks!
      </h2>
    </div>
  );
}

export default Help;
