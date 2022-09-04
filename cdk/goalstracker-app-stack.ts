import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { Environment } from './environment'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { HostedZone, ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53'
import { OriginAccessIdentity, ViewerCertificate, SSLMethod, SecurityPolicyProtocol, CloudFrontWebDistribution, CloudFrontAllowedMethods } from 'aws-cdk-lib/aws-cloudfront'
import { Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3'
import { PolicyStatement, CanonicalUserPrincipal } from 'aws-cdk-lib/aws-iam'
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager'
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets'
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment'

interface GoalstrackerAppProps extends StackProps {
  environment: Environment
}

export class GoalstrackerAppStack extends Stack {
  constructor(scope: Construct, id: string, props: GoalstrackerAppProps) {
    super(scope, id, props)

    const { environment } = props

    const subdomain = environment === Environment.PROD ? '' : 'dev.'
    const domain = `${subdomain}goalstracker.info`

    const region = 'us-east-1'
    const accountId = process.env.AWS_ACCOUNT_ID ?? ''

    const certificateArn = `arn:aws:acm:${region}:${accountId}:certificate/5e93f596-ecc6-42c7-87b8-0b65d36d9760`

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'hostedZone', {
      hostedZoneId: 'Z2HHG2D1UBSWF8',
      zoneName: 'goalstracker.info'
    })

    const cloudfrontOriginAccessIdentity = new OriginAccessIdentity(this, `cloudfront-OAI-${environment}`, {
      comment: 'Origin Access Identity for goalstracker app'
    })

    const siteBucket = new Bucket(this, `GoalstrackerSiteBucket-${environment}`, {
      bucketName: domain,
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })

    siteBucket.addToResourcePolicy(new PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [siteBucket.arnForObjects('*')],
      principals: [new CanonicalUserPrincipal(cloudfrontOriginAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }))

    const certificate = Certificate.fromCertificateArn(this, `Certificate-${ environment }`, certificateArn)

    const viewerCertificate = ViewerCertificate.fromAcmCertificate(certificate, {
      sslMethod: SSLMethod.SNI,
      securityPolicy: SecurityPolicyProtocol.TLS_V1_1_2016,
      aliases: [domain]
    })

    const cloudFrontDistribution = new CloudFrontWebDistribution(this, `SiteDistribution-${environment}`, {
      viewerCertificate,
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: siteBucket,
            originAccessIdentity: cloudfrontOriginAccessIdentity
          },
          behaviors: [{
            isDefaultBehavior: true,
            compress: true,
            allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
          }],
        }
      ]
    })

    new ARecord(this, `SiteAliasRecord-${environment}`, {
      recordName: domain,
      target: RecordTarget.fromAlias(new CloudFrontTarget(cloudFrontDistribution)),
      zone: hostedZone
    })

    if (environment === Environment.PROD) {
      new ARecord(this, `SiteAliasRecordWWW-${environment}`, {
        recordName: `www.${ domain }`,
        target: RecordTarget.fromAlias(new CloudFrontTarget(cloudFrontDistribution)),
        zone: hostedZone
      })
    }

    new BucketDeployment(this, `BucketDeployment-${environment}`, {
      sources: [Source.asset('./frontend/build')],
      destinationBucket: siteBucket,
      distribution: cloudFrontDistribution,
      distributionPaths: ['/*'],
    })
  }
}
