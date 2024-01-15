import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';

declare module 'express'  {
  interface Request {
    user?: CognitoAccessTokenPayload
    authenticationResult?: AuthenticationResultType
  }
} 