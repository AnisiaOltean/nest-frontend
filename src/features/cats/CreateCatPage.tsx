import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useCreateCatMutation } from "./CatsAPI";
import { useAppSelector } from "../../app/hooks/redux/hooks";
import { useNavigate } from "react-router";
import { CatDetails } from "../../app/types";
import { Snackbar, Alert } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Dayjs } from 'dayjs';

export const CreateCatPage = () => {
    const [name, setName] = useState("");
    const [breed, setBreed] = useState("");
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [error, setShowError] = useState(false);

    const [createCat, { isLoading }] = useCreateCatMutation();
    const { user } = useAppSelector(state => state.auth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id) return;

        const createdCat: CatDetails = {
            name: name,
            breed: breed,
            lastFed: selectedDate?.format("YYYY-MM-DD") ?? "",
            ownerId: user.id
        }

        console.log('saving', createdCat);
        try {
            await createCat(createdCat).unwrap();
            navigate('/');
        } catch (err) {
            setShowError(true);
        }
    }

    return (
        <>
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "2rem auto", display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2>Add a New Cat</h2>
            <TextField 
                label="Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
            />
            <TextField 
                label="Breed" 
                value={breed} 
                onChange={(e) => setBreed(e.target.value)} 
                required 
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    value={selectedDate}
                    onChange={(newValue) => {
                    setSelectedDate(newValue);
                    }}
                />
            </LocalizationProvider>
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Cat'}
            </Button>
        </form>
        <Snackbar open={error} autoHideDuration={6000} onClose={() => setShowError(false)}>
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          Failed to create cat. Please try again.
        </Alert>
      </Snackbar>
      </>
    );
}