import { aws_iam, Stack } from "aws-cdk-lib";

export function createBackupRole(stack: Stack) {
    const backupRole = new aws_iam.Role(stack, "Role", {
        assumedBy: new aws_iam.ServicePrincipal("backup.amazonaws.com"),
      });
      backupRole.addToPolicy(
        new aws_iam.PolicyStatement({
          actions: [
            "s3:GetInventoryConfiguration",
            "s3:PutInventoryConfiguration",
            "s3:ListBucketVersions",
            "s3:ListBucket",
            "s3:GetBucketVersioning",
            "s3:GetBucketNotification",
            "s3:PutBucketNotification",
            "s3:GetBucketLocation",
            "s3:GetBucketTagging",
          ],
          resources: ["arn:aws:s3:::*"],
          sid: "S3BucketBackupPermissions",
        })
      );
      backupRole.addToPolicy(
        new aws_iam.PolicyStatement({
          actions: [
            "s3:GetObjectAcl",
            "s3:GetObject",
            "s3:GetObjectVersionTagging",
            "s3:GetObjectVersionAcl",
            "s3:GetObjectTagging",
            "s3:GetObjectVersion",
          ],
          resources: ["arn:aws:s3:::*/*"],
          sid: "S3ObjectBackupPermissions",
        })
      );
      backupRole.addToPolicy(
        new aws_iam.PolicyStatement({
          actions: ["s3:ListAllMyBuckets"],
          resources: ["*"],
          sid: "S3GlobalPermissions",
        })
      );
      backupRole.addToPolicy(
        new aws_iam.PolicyStatement({
          actions: ["s3:ListAllMyBuckets"],
          resources: ["*"],
          sid: "S3GlobalPermissions",
        })
      );
      backupRole.addToPolicy(
        new aws_iam.PolicyStatement({
          actions: ["kms:Decrypt", "kms:DescribeKey"],
          resources: ["*"],
          sid: "KMSBackupPermissions",
          conditions: {
            StringLike: {
              "kms:ViaService": "s3.*.amazonaws.com",
            },
          },
        })
      );
      backupRole.addToPolicy(
        new aws_iam.PolicyStatement({
          actions: [
            "events:DescribeRule",
            "events:EnableRule",
            "events:PutRule",
            "events:DeleteRule",
            "events:PutTargets",
            "events:RemoveTargets",
            "events:ListTargetsByRule",
            "events:DisableRule",
          ],
          resources: ["arn:aws:events:*:*:rule/AwsBackupManagedRule*"],
          sid: "EventsPermissions",
        })
      );
      backupRole.addToPolicy(
        new aws_iam.PolicyStatement({
          actions: ["cloudwatch:GetMetricData", "events:ListRules"],
          resources: ["*"],
          sid: "EventsMetricsGlobalPermissions",
        })
      );
      return backupRole;
  }