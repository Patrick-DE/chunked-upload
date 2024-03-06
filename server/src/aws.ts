const AWS = require('aws-sdk'); 
  
export class AWSCustomService{
  //variables that store the domain name and origin ID
  private accessKeyId: string;
  private secretAccessKey: string;
  private region: string;

  private cloudfront: any;
  private s3: any;


  constructor(accessKeyId: string, secretAccessKey: string, region: string) {
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.region = region;
        
    // Configure CloudFront client 
    this.cloudfront = new AWS.CloudFront({ 
      accessKeyId, 
      secretAccessKey, 
      region 
    }); 
    this.s3 = new AWS.S3({ 
      accessKeyId, 
      secretAccessKey, 
      region 
    }); 
  }

  //make sure it the cloudfrontdomain is being returned as string
  public async createCloudFrontDomain(domainName: string, originId: string): Promise<string> { 
    // Distribution parameters with caching disabled 
    const distributionParams = { 
      Aliases: { 
        Quantity: 1, 
        Items: [domainName] 
      }, 
      CacheBehaviors: [{ 
        Paths: { 
          Quantity: 1, 
          Items: ['/*'] // All paths 
        }, 
        TargetOriginId: originId, 
        TrustedSigners: { 
          Enabled: false // Disable for easier testing 
        }, 
        // Disable caching 
        Caching: 'DISABLED' 
      }], 
      Origins: [{ 
        DomainName: domainName, // Replace with your origin domain 
        OriginId: originId 
      }], 
      ViewerCertificate: { 
        ACMCertificateARN: 'your-acm-certificate-arn', // Replace with your ACM certificate ARN 
        SSLSupportMethod: 'sni-only' // Set SSL support method 
      } 
    }; 
  
    try { 
      // Create CloudFront distribution 
      const result = await this.cloudfront.createDistribution(distributionParams).promise(); 
      console.log(`CloudFront domain created without caching: ${result.Distribution.DomainName}`); 
      return String(result.Distribution.DomainName); // Convert the domain name to a string before returning
    } catch (error) { 
      console.error(error); 
      throw error; // Re-throw for handling 
    } 
  } 

  //create a function that creates an S3 bucket
  public async createS3Bucket(bucketName: string, region: string) {

    const params = { 
      Bucket: bucketName, 
      CreateBucketConfiguration: { 
        LocationConstraint: region 
      } 
    }; 
    try { 
      await this.s3.createBucket(params).promise(); 
      console.log(`S3 bucket created: ${bucketName}`); 
    } catch (error) { 
      console.error(error); 
      throw error; 
    } 
  }
}