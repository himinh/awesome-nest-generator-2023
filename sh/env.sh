# Config app environment variable
# DEVELOPMENT | PRODUCTION
export APP_ENV=DEVELOPMENT
export APP_PORT=8888

# CLIENT URL
export APP_URL=http://localhost:8888 

# URL of the Mongo DB
# export MONGODB_URL="mongodb://127.0.0.1:27017/node-boilerplate"
# export MONGODB_URL="mongodb+srv://miniSocialNetwork:miniSocialNetwork@cluster0.3rkpg.mongodb.net/mini-social-network?retryWrites=true&w=majority"
export DATABASE_NAME=awesome-nest-generator
export DATABASE_URI="mongodb+srv://minhchiu:Minhchiu.it.01@cluster0.llaipgz.mongodb.net"


# JWT
# JWT secret key
export JWT_SECRET=jwt_secret
export JWT_ACCESS_SECRET=access_secret
export JWT_REFRESH_SECRET=refresh_secret
export JWT_ACTIVATE_SECRET=activate_secret
export JWT_SIGNUP_SECRET=signup_secret

# JWT expirations
export JWT_EXPIRESIN=30m
export JWT_ACCESS_EXPIRATION=5days
export JWT_REFRESH_EXPIRATION=30days
export JWT_RESET_PASSWORD_EXPIRATION=10m
export JWT_ACTIVATE_EXPIRATION=5m
export JWT_SIGNUP_EXPIRATION=10m


# CLOUDINARY
export CLOUD_NAME=himin
export CLOUD_API_KEY=236314377993875
export CLOUD_API_SECRET=-1rxbgLl9lrsB9wap9nTSQDNpwc
export CLOUDINARY_URL=cloudinary://236314377993875:-1rxbgLl9lrsB9wap9nTSQDNpwc@himin


# CONFIG MAIL_SERVER: gmail|sendgrid
export MAIL_SERVER=gmail

# CONFIG GMAIL
export SMTP_GMAIL_HOST=smtp.gmail.com
export SMTP_GMAIL_PORT=587
export SMTP_GMAIL_USERNAME=himinhchiu@gmail.com
export SMTP_GMAIL_PASSWORD=lnhucyaruvqjkssp

# CONFIG SENDGRID 
export SMTP_SENDGRID_HOST=smtp.sendgrid.net
export SMTP_SENDGRID_USERNAME=apikey
export SMTP_SENDGRID_PASSWORD=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 #SENDGRID_API_KEY

# CONFIG EMAIL FROM
export MAILER_FROM_EMAIL=himinhchiu@gmail.com
export MAILER_NAME_NAME=minhchiu

# OAuth client
export OAUTH_CLIENT_ID=679275323194-0m8bkvm059v14kcepq57l873v8lm7r37.apps.googleusercontent.com
export OAUTH_CLIENT_SECRET=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

# OTP
export MAXIMUN_SECOND_SEND_OTP=10

# UPLOAD
export UPLOAD_IMAGE_MAX_SIZE=25 #MB  
export UPLOAD_RAW_MAX_SIZE=25 #MB  
export UPLOAD_VIDEO_MAX_SIZE=25 #MB  
export UPLOAD_AUDIO_MAX_SIZE=25 #MB  

export UPLOAD_IMAGE_MAX_FILE=10
export UPLOAD_RAW_MAX_FILE=10
export UPLOAD_VIDEO_MAX_FILE=4
export UPLOAD_AUDIO_MAX_FILE=10

export UPLOAD_IMAGE_EXT="jpg|jpeg|png|gif"
export UPLOAD_RAW_EXT="txt|pdf|doc|docx|xls|xlsx|ppt|pptx|csv|json"
export UPLOAD_VIDEO_EXT='mp4|mkv|webm|mov|flv'
export UPLOAD_AUDIO_EXT='mp3|aac|wav|flac'
