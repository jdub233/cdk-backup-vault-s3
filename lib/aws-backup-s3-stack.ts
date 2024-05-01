import {
  aws_backup,
  aws_s3,
  Stack,
  StackProps,
  Tags,
} from "aws-cdk-lib";
import { Construct } from "constructs";

import { createBackupRole } from "./backup-role";

export class AwsBackupS3Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new aws_s3.Bucket(this, "testBucket", {
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
    Tags.of(bucket).add("daily-backup", "true");

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
