import { useGetCatsForUserQuery } from "./UserAPI";
import { useAppSelector, useAppDispatch } from "../../app/hooks/redux/hooks";
import { skipToken } from "@reduxjs/toolkit/query";
import { Button } from "@mui/material";
import { logout } from "../auth/authSlice";

export const HomePage = () => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const { data, isLoading } = useGetCatsForUserQuery(String(user?.id) ?? skipToken);

    const handleLogout = () => {
        dispatch(logout());
    }

    return <div>
        {isLoading && <p>Loading cats...</p>}
        {data && data.map(cat => <div key={cat.id}>{cat.name}</div>)}
        <Button onClick={handleLogout}>Logout</Button>
    </div>;
};