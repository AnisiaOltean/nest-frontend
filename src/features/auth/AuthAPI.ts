import axios from "axios";
import { User, JWT, DecodedJwt, StoredUser } from "../../app/types";
import { jwtDecode } from "jwt-decode";

const registerAPI = async (user: User): Promise<User|null> => {
    const response = await axios.post(`${import.meta.env.VITE_BASE_API}/auth/register`, user);
    console.log(response);
    return response.data;
}

const loginAPI = async(user: User): Promise<{access_token: JWT; user: StoredUser | null}> => {
    const response = await axios.post(`${import.meta.env.VITE_BASE_API}/auth/login`, user);
    
    console.log(response.data); 

    if(response.data){
        localStorage.setItem('jwt', JSON.stringify(response.data));

        const decodedJWT: DecodedJwt = jwtDecode(response.data.access_token);
        console.log(decodedJWT);
        const storedUser: StoredUser = {
            id: decodedJWT.sub,
            email: decodedJWT.email
        }

        localStorage.setItem('user', JSON.stringify(storedUser));

        return {
            access_token: response.data.access_token,
            user: storedUser,
          };
    }

    return response.data;
}

const logoutAPI = (): void => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
}

const verifyJwtAPI = async (jwt: string): Promise<boolean> => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_API}/auth/verify-jwt`,
      { jwt }
    );
  
    if (response.data) {
      const jwtExpirationMs = response.data.exp * 1000;
      return jwtExpirationMs > Date.now();
    }
  
    return false;
};

const authService = {
    registerAPI, 
    loginAPI, 
    logoutAPI,
    verifyJwtAPI
};

export default authService;