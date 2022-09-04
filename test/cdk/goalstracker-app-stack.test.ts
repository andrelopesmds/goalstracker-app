import { Template } from 'aws-cdk-lib/assertions'
import { Environment } from '../../cdk/environment'
import { GoalstrackerAppStack} from '../../cdk/goalstracker-app-stack'
import { App } from 'aws-cdk-lib'


describe('GoalstrackerAppStack', () => {
  const environment = Environment.PROD
  let stack: GoalstrackerAppStack

  beforeAll(() => {
    const app = new App()

    stack = new GoalstrackerAppStack(app, `${ environment }-TestStack`, {
      environment
    })
  })

  it('should create a hello world lambda', () => {
    Template.fromStack(stack).hasResource('AWS::Lambda::Function', {})
  })
})
