import {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
  PutLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class CloudWatchLoggerService implements OnModuleInit {
  private cloudwatch: CloudWatchLogsClient;
  private sequenceToken: string | undefined;
  private readonly logGroupName = process.env.CLOUDWATCH_GROUP_NAME ?? 'nestjs-app';
  private readonly logStreamName = process.env.CLOUDWATCH_STREAM_NAME ?? 'default';

  async onModuleInit() {
    this.cloudwatch = new CloudWatchLogsClient({
      region: process.env.AWS_REGION ?? 'ap-southeast-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
      },
    });

    await this.setupLogGroupAndStream();
  }

  private async setupLogGroupAndStream() {
    try {
      await this.cloudwatch.send(new CreateLogGroupCommand({ logGroupName: this.logGroupName }));
    } catch (err) {} // already exists

    try {
      await this.cloudwatch.send(new CreateLogStreamCommand({
        logGroupName: this.logGroupName,
        logStreamName: this.logStreamName,
      }));
    } catch (err) {} // already exists
  }

  async log(message: string) {
    const now = new Date();

    const logEvents = [{
      message,
      timestamp: now.getTime(),
    }];

    const command = new PutLogEventsCommand({
      logGroupName: this.logGroupName,
      logStreamName: this.logStreamName,
      logEvents,
      sequenceToken: this.sequenceToken,
    });

    try {
      const response = await this.cloudwatch.send(command);
      this.sequenceToken = response.nextSequenceToken;
    } catch (err: any) {
      console.error('[CloudWatchLogger] Error:', err?.message);
    }
  }
}
