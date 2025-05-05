import { Cat } from "../../app/types";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

export const CatCard = ({ id, name, breed, isFed }: Cat) => {
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
            <Button size="small">Update</Button>
          </CardActions>
        </Card>
    );
}