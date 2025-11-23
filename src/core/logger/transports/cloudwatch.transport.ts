// import { CloudWatchLogs } from '@aws-sdk/client-cloudwatch-logs';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class CloudWatchTransport {
//   private client = new CloudWatchLogs({
//     region: process.env.AWS_REGION,
//     credentials: {
//       accessKeyId: process.env.AWS_ACCESS_KEY!,
//       secretAccessKey: process.env.AWS_SECRET_KEY!,
//     },
//   });

//   private logGroup = process.env.CLOUDWATCH_LOG_GROUP!;
//   private logStream = process.env.CLOUDWATCH_LOG_STREAM!;

//   async send(message: Record<string, any>) {
//     const formatted = JSON.stringify(message);

//     await this.client.putLogEvents({
//       logGroupName: this.logGroup,
//       logStreamName: this.logStream,
//       logEvents: [
//         {
//           message: formatted,
//           timestamp: Date.now(),
//         },
//       ],
//     });
//   }
// }
