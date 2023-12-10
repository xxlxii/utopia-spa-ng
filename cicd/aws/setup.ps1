#!/usr/bin/env pwsh

Function GetAccountId() {
  $AccountId = (Get-STSCallerIdentity).Account

  if([string]::IsNullOrEmpty($AccountId) -eq $False) {
    return $AccountId
  }
  else {
    throw "AWS AccountId cannot be determined. Can't continue..."
  }
}

Function GetRegion() {
  $Region = (Get-DefaultAWSRegion | Select-Object -Property Region).Region

   if([string]::IsNullOrEmpty($Region) -eq $False) {
    return $Region
   }
   else {
    throw "AWS Region is not configured. Can't continue..."
   }
}

Function GetCicdBucket() {
  $AccountId = GetAccountId
  $CicdBucket = "$AccountId-utopia-cicd"

  $S3Bucket = (Get-S3Bucket -BucketName $CicdBucket)
  if($null -eq $S3Bucket) {
    $Region = GetRegion
    $S3Bucket = (New-S3Bucket -BucketName $CicdBucket -Region $Region)
  }

  return $S3Bucket
}

Function GetWebsiteBucket() {
  $WebsiteBucket = "www.utopia.com"

  $S3Bucket = (Get-S3Bucket -BucketName $WebsiteBucket)
  if($null -eq $S3Bucket) {
    $Region = GetRegion
    $S3Bucket = (New-S3Bucket -BucketName $WebsiteBucket -Region $Region)
  }

  return $S3Bucket
}

Import-Module AWSPowerShell.NetCore
Initialize-AWSDefaultConfiguration -ProfileName default

$CicdBucketName = (GetCicdBucket).BucketName
$WebsiteBucketName = (GetWebsiteBucket).BucketName
Write-Output `
  "CI/CD Bucket: $CicdBucketName" `
  "Website Bucket: $WebsiteBucketName"

$TemplateBody = (Get-Content -Path ./cicd.yml -Raw)
$Parameters = (`
  @{ ParameterKey = "CicdBucket"; ParameterValue = $CicdBucketName }, `
  @{ ParameterKey = "WebsiteBucket"; ParameterValue = $WebsiteBucketName } `
)

New-CFNStack `
  -StackName "utopia-spa-ng" `
  -TemplateBody $TemplateBody `
  -Parameter $Parameters `
  -Capabilities CAPABILITY_NAMED_IAM
