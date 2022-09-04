import { App } from 'aws-cdk-lib'
import { GoalstrackerAppStack } from './goalstracker-app-stack'
import { Environment } from './environment'

const environment = process.env.ENVIRONMENT === Environment.PROD ?  Environment.PROD : Environment.DEV
const stackName = `goals-tracker-app-stack-${environment}`

const app = new App()

new GoalstrackerAppStack(app, stackName, {
  stackName,
  environment,
  description: `Goals tracker app stack for ${environment} environment`
})
