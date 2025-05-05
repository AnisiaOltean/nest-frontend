import { Cat } from "../../app/types";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { useNavigate } from "react-router";
import { useDeleteCatMutation } from "./CatsAPI";
import { useAppSelector } from "../../app/hooks/redux/hooks";
import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

export const CatCard = ({ id, name, breed, isFed }: Cat) => {
    const navigate = useNavigate();
    const [ deleteCat ] = useDeleteCatMutation();
    const { user } = useAppSelector((state) => state.auth);
    const [error, setError] = useState(false);

    const handleUpdate = () => {
      navigate(`/cats/${id}`);
    }

    const handleDelete = async () => {
      if(!user) return;

        try {
          await deleteCat({catId: id!, ownerId: user.id}).unwrap();
          navigate('/');
        } catch (err) {
          setError(true);
        }
    }

    return (
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
              {breed}
            </Typography>
            <Typography variant="h5" component="div">
              {name}
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             isFed: {isFed ? (
                        <SentimentSatisfiedAltIcon color="success" />
                    ) : (
                        <SentimentDissatisfiedIcon color="error" />
                    )}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleUpdate}>Update</Button>
            <Button size="small" onClick={handleDelete}>Delete</Button>
          </CardActions>
          <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(false)}>
            <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
              Failed to delete cat. Please try again.
            </Alert>
            </Snackbar>
        </Card>
    );
}