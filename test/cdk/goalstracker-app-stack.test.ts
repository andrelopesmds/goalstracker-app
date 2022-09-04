import { Template } from 'aws-cdk-lib/assertions'
import { Environment } from '../../cdk/environment'
import { GoalstrackerAppStack} from '../../cdk/goalstracker-app-stack'
import { App } from 'aws-cdk-lib'

const mockedAWSAccountId = '123456789012'

describe('GoalstrackerAppStack - PROD', () => {
  const environment = Environment.PROD
  let stack: GoalstrackerAppStack

  beforeAll(() => {
    process.env.AWS_ACCOUNT_ID = mockedAWSAccountId

    const app = new App()

    stack = new GoalstrackerAppStack(app, `${ environment }-TestStack`, {
      environment
    })
  })

  afterAll(() => {
    delete process.env.AWS_ACCOUNT_ID
  })

  it('should create a record set for the root domain', () => {
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'goalstracker.info.',
      Type: 'A'
    })
  })

  it('should create a record set for the www domain', () => {
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'www.goalstracker.info.',
      Type: 'A'
    })
  })

  it('should create an S3 bucket', () => {
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      BucketName: 'goalstracker.info',
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true
      }
    })
  })

  it('should create a bucket policy', () => {
    Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 1)
  })

  it('should create a lambda layer versions', () => {
    Template.fromStack(stack).resourceCountIs('AWS::Lambda::LayerVersion', 1)
  })

  it('should create a CloudFront origin access identity', () => {
    Template.fromStack(stack).resourceCountIs('AWS::CloudFront::CloudFrontOriginAccessIdentity', 1)
  })

  it('should create a CloudFront distribution', () => {
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        Aliases: [
          'goalstracker.info'
        ],
        ViewerCertificate: {
          AcmCertificateArn: `arn:aws:acm:us-east-1:${ mockedAWSAccountId }:certificate/5e93f596-ecc6-42c7-87b8-0b65d36d9760`
        },
        DefaultCacheBehavior: {
          AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
          CachedMethods: ['GET', 'HEAD']
        },
        DefaultRootObject: 'index.html',
        Enabled: true,
        HttpVersion: 'http2',
        IPV6Enabled: true
      }
    })
  })
})

describe('GoalstrackerAppStack - DEV', () => {
  const environment = Environment.DEV
  let stack: GoalstrackerAppStack
  
  beforeAll(() => {
    process.env.AWS_ACCOUNT_ID = mockedAWSAccountId

    const app = new App()

    stack = new GoalstrackerAppStack(app, `${ environment }-TestStack`, {
      environment
    })
  })

  afterAll(() => {
    delete process.env.AWS_ACCOUNT_ID
  })

  it('should create a record set', () => {
    Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'dev.goalstracker.info.',
      Type: 'A',
      HostedZoneId: 'Z2HHG2D1UBSWF8'
    })
  })

  it('should create an S3 bucket', () => {
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      BucketName: 'dev.goalstracker.info',
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true
      }
    })
  })

  it('should create a CloudFront distribution', () => {
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        Aliases: [
          'dev.goalstracker.info'
        ],
        ViewerCertificate: {
          AcmCertificateArn: `arn:aws:acm:us-east-1:${ mockedAWSAccountId }:certificate/5e93f596-ecc6-42c7-87b8-0b65d36d9760`
        },
        DefaultCacheBehavior: {
          AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
          CachedMethods: ['GET', 'HEAD']
        },
        DefaultRootObject: 'index.html',
        Enabled: true,
        HttpVersion: 'http2',
        IPV6Enabled: true
      }
    })
  })
})
