import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import nodeJose from 'node-jose';
import { Client, Issuer, TokenSet } from 'openid-client';
import { v4 as uuid } from 'uuid';

import { logError, logInfo } from '@navikt/familie-logging';

import Miljø, { erLokalt } from '../shared-utils/Miljø';

import { ApplicationName } from './types';

class TokenXClient {
    private tokenxClient!: Client;
    private audience!: string | undefined;

    constructor() {
        logInfo('Setter opp TokenX');
        if (erLokalt()) {
            logInfo('Setter ikke opp TokenX lokalt');
            return;
        }
        this.init()
            .then((client: Client) => {
                this.tokenxClient = client;
            })
            .catch(() => process.exit(1));
    }

    exchangeToken = async (idportenToken: string, applicationName: ApplicationName) => {
        const clientAssertion = await this.createClientAssertion();

        logInfo('Veksler inn ID-porten token til tokenx');
        return this.tokenxClient
            .grant({
                grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
                client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                token_endpoint_auth_method: 'private_key_jwt',
                client_assertion: clientAssertion,
                subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
                subject_token: idportenToken,
                audience: `${tokenxConfig.clusterName}:teamfamilie:${applicationName}`,
            })
            .then((tokenSet: TokenSet) => {
                return Promise.resolve(tokenSet.access_token);
            })
            .catch((err: unknown) => {
                logError('Feil under utveksling av token: ', undefined, { error: err });
                return Promise.reject(err);
            });
    };

    private createClientAssertion = async () => {
        if (!tokenxConfig.privateJwk) {
            logError('Mangler miljøvariabel TOKEN_X_PRIVATE_JWK');
            throw new TypeError('Miljøvariabelen "TOKEN_X_PRIVATE_JWK må være satt');
        }

        const now = Math.floor(Date.now() / 1000);

        const payload: JwtPayload = {
            sub: tokenxConfig.clientId,
            iss: tokenxConfig.clientId,
            aud: this.audience,
            jti: uuid(),
            nbf: now,
            iat: now,
            exp: now + 60, // max 120
        };

        const key = await this.asKey(tokenxConfig.privateJwk);

        const options: SignOptions = {
            algorithm: 'RS256',
            header: {
                kid: key.kid,
                typ: 'JWT',
                alg: 'RS256',
            },
        };

        return jwt.sign(payload, key.toPEM(true), options);
    };

    private asKey = async (jwk: string) => {
        if (!jwk) {
            logError('JWK Mangler');
            throw Error('JWK Mangler');
        }

        return nodeJose.JWK.asKey(jwk).then((key: string) => {
            return Promise.resolve(key);
        });
    };

    private init = async () => {
        if (!tokenxConfig.discoveryUrl) {
            logError('Mangler miljøvariabel TOKEN_X_WELL_KNOWN_URL');
            throw new TypeError('Miljøvariabelen "TOKEN_X_WELL_KNOWN_URL må være satt');
        }
        if (!tokenxConfig.clientId) {
            logError('Mangler miljøvariabel TOKEN_X_CLIENT_ID');
            throw new TypeError('Miljøvariabelen "TOKEN_X_CLIENT_ID må være satt');
        }
        const { metadata, Client } = await Issuer.discover(tokenxConfig.discoveryUrl);
        this.audience = metadata.token_endpoint;

        logInfo(`Discovered TokenX @ ${metadata.issuer}`);

        try {
            const client = new Client({
                client_id: tokenxConfig.clientId,
                redirect_uris: [tokenxConfig.redirectUri],
                token_endpoint_auth_method: 'none',
            });

            logInfo('Opprettet TokenX client');

            return Promise.resolve(client);
        } catch (err: unknown) {
            logError(
                'Feil oppstod under parsing av jwt eller opprettelse av TokenX client',
                undefined,
                { error: err }
            );
            return Promise.reject(err);
        }
    };
}

const tokenxConfig = {
    discoveryUrl: process.env.TOKEN_X_WELL_KNOWN_URL,
    clientId: process.env.TOKEN_X_CLIENT_ID,
    privateJwk: process.env.TOKEN_X_PRIVATE_JWK,
    redirectUri: Miljø().oauthCallbackUri,
    clusterName: process.env.NAIS_CLUSTER_NAME,
};

export default TokenXClient;
