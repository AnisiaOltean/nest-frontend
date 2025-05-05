export interface User {
    email: string;
    password: string;
}

export interface StoredUser {
    id: number;
    email: string;
}

export type JWT = { access_token: string } | null; 

export interface DecodedJwt {
    email: string;
    exp: number;
    iat: number;
    sub: number;
}

export interface Cat {
    id?: number;
    name: string;
    breed: string;
    isFed?: boolean;
}
