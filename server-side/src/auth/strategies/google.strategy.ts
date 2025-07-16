import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Strategy, Profile, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends Strategy {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get('SERVER_URL') + '/auth/google/callback',
            scope: ['profile', 'email'],
            passReqToCallback: true
        }, async (
            req: any,
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: VerifyCallback
        ) => {
            try {
                const { displayName, emails, photos } = profile;

                if (!emails || emails.length === 0) {
                    return done(new Error("No email found in Google profile"));
                }

                const user = {
                    email: emails[0].value,
                    name: displayName,
                    picture: photos?.[0]?.value,
                    accessToken
                };

                done(null, user);
            } catch (err) {
                done(err);
            }
        });
    }
}