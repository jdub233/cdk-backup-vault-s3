AWS Backup for single S3 bucket
---

<!--BEGIN STABILITY BANNER-->
---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)

> **This is a stable example. It should successfully build out of the box**
>
> This example is built on Construct Libraries marked "Stable" and does not have any infrastructure prerequisites to build.
---
<!--END STABILITY BANNER-->

## Overview

This is a CDK stack to create a AWS Backup Vault and backup an entire S3 bucket. It is based on the [example CDK stack provided by AWS](https://github.com/aws-samples/aws-cdk-examples).

It can be used to create a backup stack for an existing S3 bucket; the bucket can be specified by putting the ARN of the bucket into a `.env` file like this:

```env
BUCKET_ARN=arn:aws:s3:::wordpress-protected-s3-assets-jaydub-assets
```

If there is no BUCKET_ARN specified, the stack will deploy with a new bucket based on the stack name. This feature can be useful for testing.

Once deployed, any uploaded object in the bucket created will be backed up once the backup schedule is executed.


## Build and Deploy

The `cdk.json` file tells the CDK Toolkit how to execute your app.

Before getting ready to deploy, ensure the dependencies are installed by executing the following:

```
$ npm install -g aws-cdk
$ npm install
```

### CDK Deploy

With specific profile,
```
$ cdk deploy --profile test
```

Using the default profile

```
$ cdk deploy
```

## Removing the stack

When you run cdk destroy, AWS CDK deletes the CloudFormation stack and all resources that were created by the stack. However, some resources are not deleted automatically due to their nature and to prevent accidental data loss.

In this CDK stack, the following resources are not be deleted automatically:

- S3 Bucket (aws_s3.Bucket): By default, AWS does not delete an S3 bucket if it contains objects. You need to manually delete all objects in the bucket before you can delete the bucket itself. If you want CDK to empty the bucket before deleting it, you can set the autoDeleteObjects property to true when creating the bucket. However, be careful with this setting because it can lead to data loss if used improperly.

- Backup Vault (aws_backup.BackupVault): AWS Backup does not delete a backup vault if it contains recovery points. You need to manually delete all recovery points in the vault before you can delete the vault itself.

Remember to check these resources in the AWS Management Console after running cdk destroy to ensure that they have been deleted. If they haven't, you can delete them manually.
