export interface User {
    email: string;
    password: string;
}

export type JWT = { access_token: string } | null; 

export interface DecodedJwt {
    email: string;
    exp: number;
    iat: number;
}
