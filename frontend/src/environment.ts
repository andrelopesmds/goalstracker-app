const ENV = process.env.REACT_APP_ENV;

const complement = ENV === 'prod' ? '' : 'dev';

const BASE_URL = `https://api${complement}.goalstracker.info`;

export const routes = {
  teams: `${BASE_URL}/teams`,
  subscription: `${BASE_URL}/subscriptions`
}