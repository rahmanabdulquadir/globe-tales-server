# Globe Tales - Travel Tips and Destination Guide

### Live URL: https://globe-tales-server.vercel.app/

### Technology used

- Typescript
- NodeJS
- ExpressJS
- Mongoose
- Jsonwebtoken
- Bcrypt
- Zod
- And additional other technologies

### Features

- User Management
- Role-Based Access Control
- Post Management
- Payment Management
- Data Validation and Error Handling
- Security - (Access Token Security, Error Handling)

## Instructions on how to run this application locally

1. First clone this repository on your device with this command line:

```
git clone https://github.com/rahmanabdulquadir/globe-tales-server.git
```

2. After cloning the repository install all necessary packages with:

```
npm install
```

3. Now set the necessary variables, create a '.env' file in the root folder of this project and set the value of those properties:

- PORT=5000
- DATABASE_URL=
- MONGO_DB=
- BCRYPT_SALT_ROUNDS=
- JWT_ACCESS_EXPIRES_IN=
- JWT_REFRESH_EXPIRES_IN=
- NODE_ENV=
- JWT_ACCESS_SECRET=
- JWT_REFRESH_SECRET=
- CN_Cloud_name=
- CN_Api_key=
- CN_Api_secret=
- CN_Folder=
- SIGNATURE_KEY=
- STORE_ID=
- PAYMENT_URL=
- STRIPE_SECRET_KEY=

4. After successfully installing all packages open the terminal from this project and run:

```
npm run start:dev
```

5. Check the console/terminal is there a message:
   > mongoDB connected

### If yes then locally application successfully running.