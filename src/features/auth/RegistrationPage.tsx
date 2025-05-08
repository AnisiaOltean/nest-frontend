import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks/redux/hooks";
import { useNavigate } from "react-router";
import { User } from "../../app/types";
import { register, reset } from "./authSlice";
import styles from "./LoginPage.module.css";

export const RegistrationPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useAppDispatch();
    const { isLoading, isSuccess } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if(isSuccess) {
            dispatch(reset());
            navigate('/login');
        }

    }, [isSuccess, dispatch]);

    const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user: User = {
            email,
            password
        };

        console.log(user);
        dispatch(register(user));
    }

    if(isLoading) return <CircularProgress/>

    return <div className={styles.formContainer}>
            <Typography variant="h2">Register</Typography>
            <form onSubmit={onSubmitHandler} className={styles.loginForm}>
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
                <Button type="submit" variant="contained">
                Register
                </Button>
            </form>
    </div>
}