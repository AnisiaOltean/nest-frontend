import { useState } from "react";
import { TextField, Checkbox, FormControlLabel, Button } from "@mui/material";
import { useCreateCatMutation } from "./CatsAPI";
import { useAppSelector } from "../../app/hooks/redux/hooks";
import { useNavigate } from "react-router";
import { CatDetails } from "../../app/types";
import { Snackbar, Alert } from "@mui/material";

export const CreateCatPage = () => {
    const [name, setName] = useState("");
    const [breed, setBreed] = useState("");
    const [isFed, setIsFed] = useState(false);
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
            isFed: isFed,
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
            <FormControlLabel
                control={
                    <Checkbox 
                        checked={isFed} 
                        onChange={(e) => setIsFed(e.target.checked)} 
                    />
                }
                label="Is Fed"
            />
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