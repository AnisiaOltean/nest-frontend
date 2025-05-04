import { useAppDispatch, useAppSelector } from "../../app/hooks/redux/hooks";
import { logout } from "../auth/authSlice";

export const HomePage = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const logoutHandler = () => {
        dispatch(logout());
    }

    return <div>
        <h1>Home Page</h1>
        <a onClick={logoutHandler}
         style={{backgroundColor: "blue"}}>Logout</a>
         {user}
    </div>
}