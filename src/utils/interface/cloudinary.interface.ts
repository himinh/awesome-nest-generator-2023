import { UploadApiOptions } from 'cloudinary';

export interface CloudinaryConfig {
  provide: string;
  config: {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  };
  options: UploadApiOptions;
}
