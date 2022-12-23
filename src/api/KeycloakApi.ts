import axios, { AxiosProxyConfig } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import queryString from 'querystring'

let axiosOpt = {
    baseURL: process.env.CODA_AUTH_SERVICE_URL + '/realms/' + process.env.CODA_SITE_API_AUTH_REALM
}

const proxy = process.env.CODA_SITE_API_PROXY_URL;

if (proxy) {
    console.log(`Using ${proxy} proxy for keycloak requests`);
    const proxyNoHttp = proxy.replace('http://', '').replace('https://', '');
    const proxyHost = proxyNoHttp.split(':')[0];
    const proxyPort = proxyNoHttp.split(':')[1] as unknown as number;

    const proxyConfig = { host: proxyHost, port: proxyPort } as AxiosProxyConfig;
    axiosOpt = { ...axiosOpt, ...{ proxy: proxyConfig } };
} else {
    console.log(`Using vanilla keycloak requests`);
}

console.log('keycloak axios config: ');
console.log({ axiosOpt });

const instance = axios.create(axiosOpt);

async function logIn() {
    try {

        const response = await instance.post('protocol/openid-connect/token',
            queryString.stringify({
                "client_id": process.env.CODA_SITE_API_AUTH_CLIENT_ID,
                "username": process.env.CODA_SITE_API_AUTH_USERNAME,
                "password": process.env.CODA_SITE_API_AUTH_PASSWORD,
                "grant_type": "password"
            }),
            {
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                }
            });

        return response.data['access_token'];
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export default {
    logIn
}