import { aws_s3 } from "aws-cdk-lib";
import { Construct } from "constructs";

export function createBucket(scope: Construct, id: string): aws_s3.Bucket {
    return new aws_s3.Bucket(scope, id, {
      blockPublicAccess: {
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      },
      enforceSSL: true,
      publicReadAccess: false,
      encryption: aws_s3.BucketEncryption.S3_MANAGED,
      versioned: true,
    });
  }
  