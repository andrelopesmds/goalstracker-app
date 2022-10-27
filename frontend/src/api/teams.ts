import { routes } from "../environment";

export const fetchAvailableTeams = async (): Promise<any> => {
  const response = await fetch(routes.teams)

  return response.json()
}
