import { routes } from "../environment";

export const saveSubscription = (subscription: any, teamsIds: number[]): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const parameters = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        teamsIds
      })
    };

    fetch(routes.subscription, parameters)
      .then((response) => {
        if (response.ok) {
          resolve();
        } else {
          reject('Something wrong happened. Please contact support.');
        }
      })
      .catch((error) => {
        reject('There has been a problem with your fetch operation: ' + error.message);
      });
  });
}
