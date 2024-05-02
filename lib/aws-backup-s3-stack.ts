import {
  aws_backup,
  aws_s3,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { config } from 'dotenv';

import { createBackupRole } from "./backup-role";

config();

function createBucket(scope: Construct, id: string): aws_s3.Bucket {
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


export class AwsBackupS3Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Get the bucket ARN from the environment variables, or use a default null value.
    const bucketArn = process.env.BUCKET_ARN || null;


    // If there is a valid bucket arn, use that bucket as resource to be backed up.
    const bucket: aws_s3.IBucket = bucketArn
      ? aws_s3.Bucket.fromBucketArn(this, "testBucket", bucketArn)
      : createBucket(this, "testBucket");     // Otherwise, create a new 'test' bucket to use with the backup vault.

    // Create the backup role.
    const backupRole = createBackupRole(this);

    // Daily 35 day retention with automatically scheduled backup.
    const vault = new aws_backup.BackupVault(this, "Vault", {});
    const plan = aws_backup.BackupPlan.daily35DayRetention(
      this,
      "s3-bucket-backup-plan",
      vault
    );

    // Add the s3 bucket as a resource to be backed up to the backup plan.
    plan.addSelection("Selection", {
      role: backupRole,
      resources: [aws_backup.BackupResource.fromArn(bucket.bucketArn)],
    });
  }
}
