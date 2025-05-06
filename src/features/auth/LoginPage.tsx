import { Box, Button, TextField, Typography } from "@mui/material";
import { useState, FormEvent, useEffect } from "react";
import styles from "./LoginPage.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks/redux/hooks";
import { useNavigate } from "react-router";
import { User } from "../../app/types";
import { login, reset } from "./authSlice";
import { CircularProgress } from "@mui/material";
import { Snackbar, Alert } from "@mui/material";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useAppDispatch();
    const { isLoading, isSuccess, isError, isAuthenticated } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if(isSuccess) {
            dispatch(reset());
        }

    }, [isSuccess, dispatch]);

    useEffect(() => {
        if(!isAuthenticated) return; 

        navigate('/');
    }, [isAuthenticated])

     const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const user: User = {
                email,
                password
            };
    
            console.log(user);
            dispatch(login(user));
    }

    if(isLoading) return <CircularProgress/>

    return <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            gap={2}>
            <Typography variant="h2">Login</Typography>
            <form onSubmit={onSubmitHandler} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
               <div className={styles.loginContainer}>
                    <Button type="submit">Login</Button>
                    <p>Don't have an account yet? <Button onClick={() => navigate('/register')}>Register</Button></p>
                </div> 
            </form>
            <Snackbar open={isError}>
                <Alert severity="error" sx={{ width: '100%' }}>
                    Login failed!
                </Alert>
            </Snackbar>
    </Box>
}