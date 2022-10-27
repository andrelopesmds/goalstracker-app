import { AvailableTeam } from "../interfaces/availableTeam";

export const sortBySport = (team1: AvailableTeam, team2: AvailableTeam): number => {
  let a = team1.country;
  let b = team2.country;

  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

export const getApplicationServerKey = (): Uint8Array => {
  const base64String = 'BGeQdm67i8LCUJ3ATI_lLM3HY78BliDlg63jPpqq3OnPDuRCqu7AeyDNR_GxAvAm6FC2SehtO5dW9jWFWQ2d4Q4'
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const applicationServerKey = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    applicationServerKey[i] = rawData.charCodeAt(i);
  }

  return applicationServerKey;
}
