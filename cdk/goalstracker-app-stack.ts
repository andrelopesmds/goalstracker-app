import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { Environment } from './environment'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

interface GoalstrackerAppProps extends StackProps {
  environment: Environment
}

export class GoalstrackerAppStack extends Stack {
  constructor(scope: Construct, id: string, props: GoalstrackerAppProps) {
    super(scope, id, props)

    const { environment } = props

    new NodejsFunction(this, `hello-world-${environment}`, {
      functionName: `hello-${environment}`,
      entry: 'src/hello.ts',
      handler: 'handler',
    })
  }
}
