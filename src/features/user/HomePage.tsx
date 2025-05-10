import { useGetCatsForUserQuery } from "../cats/CatsAPI";
import { useAppSelector, useAppDispatch } from "../../app/hooks/redux/hooks";
import { Button } from "@mui/material";
import { logout } from "../auth/authSlice";
import { CatCard } from "../cats/CatCard";
import styles from "./HomePage.module.css";
import { useNavigate } from "react-router";
import WavingHandTwoToneIcon from '@mui/icons-material/WavingHandTwoTone';

export const HomePage = () => {
    const { user } = useAppSelector((state) => state.auth);
    console.log(user);
    const dispatch = useAppDispatch();
    
    const { data, isLoading } = useGetCatsForUserQuery({ownerId: user!.id}, {skip: !user});

    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
    }

    const handleAddCat = () => {
        navigate('/createCat');
    }

    return <div>
        {isLoading && <p>Loading cats...</p>}
        <div className={styles.container}>
            <div className={styles.profile}>
                    <h2>Hello, {user?.email || 'User'} <WavingHandTwoToneIcon sx={{color: '#FFD700'}}/></h2>
                    <Button onClick={handleLogout}>Logout</Button>
                    <Button onClick={handleAddCat}>Add cat</Button>
            </div>
            <div className={styles.catsList}>
                {data && data.map(cat => (
                    <CatCard key={cat.id} {...cat} />
                ))}
            </div>
        </div>
    </div>;
};