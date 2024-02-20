import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppConfig, AwsConfig, ConfigName } from "~config/environment";
import { CustomLogger } from "~shared/logger/logger.service";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { Upload } from "@aws-sdk/lib-storage";

@Injectable()
export class S3Service {
	private s3Client: S3Client;
	private awsConfig: AwsConfig;
	private appConfig: AppConfig;

	constructor(
		private readonly configService: ConfigService,
		private logger: CustomLogger,
	) {
		this.awsConfig = this.configService.get<AwsConfig>(ConfigName.aws);
		this.appConfig = this.configService.get<AppConfig>(ConfigName.app);

		this.initS3();
	}

	initS3() {
		if (this.appConfig.storageServer === "S3") {
			this.s3Client = new S3Client({
				region: this.awsConfig.region,
				endpoint: this.awsConfig.endpoint,
				credentials: {
					accessKeyId: this.awsConfig.accessKeyId,
					secretAccessKey: this.awsConfig.secretAccessKey,
				},
			});

			this.logger.log("S3Module init success", S3Service.name);
		} else {
			this.logger.warn("S3Module module was not initialized", S3Service.name);
		}
	}

	async upload(file: { fileName: string; fileFolder: string; buffer: Buffer }) {
		const upload = new Upload({
			params: {
				Bucket: this.awsConfig.bucketName,
				Key: `${file.fileFolder}/${file.fileName}`,
				Body: Readable.from(file.buffer),
			},
			client: this.s3Client,
			queueSize: 3,
		});

		return upload.done();
	}

	async deleteFile(resourceId: string) {
		try {
			const deleteObjectCommand = new DeleteObjectCommand({
				Bucket: this.awsConfig.bucketName,
				Key: resourceId,
			});

			const result = await this.s3Client.send(deleteObjectCommand);

			console.log(
				`File ${resourceId} deleted successfully from S3 bucket ${this.awsConfig.bucketName}.`,
			);

			console.log(result);
		} catch (error) {
			console.error("Error deleting file from S3:", error);
			throw error;
		}
	}
}
