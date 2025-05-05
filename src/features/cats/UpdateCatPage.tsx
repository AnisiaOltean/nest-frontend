import { useState } from "react";
import { TextField, Checkbox, FormControlLabel, Button } from "@mui/material";
import { useGetCatByIdQuery, useUpdateCatMutation } from "./CatsAPI";
import { useAppSelector } from "../../app/hooks/redux/hooks";
import { useNavigate } from "react-router";
import { CatDetails } from "../../app/types";
import { Snackbar, Alert } from "@mui/material";
import { useParams } from 'react-router-dom';
import { useEffect } from "react";

export const UpdateCatPage = () => {
    const { id } = useParams();
    const { data } = useGetCatByIdQuery(id!, {
        skip: !id,
    });
    const { user } = useAppSelector(state => state.auth);
    const navigate = useNavigate();
    const [updateCat, { isLoading }] = useUpdateCatMutation();

    const [name, setName] = useState("");
    const [breed, setBreed] = useState("");
    const [isFed, setIsFed] = useState(false);
    const [isError, setShowError] = useState(false);

    useEffect(() => {
        if (data) {
          setName(data.name || "");
          setBreed(data.breed || "");
          setIsFed(!!data.isFed);
        }
    }, [data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id || !id) return;

        const createdCat: CatDetails = {
            name: name,
            breed: breed,
            isFed: isFed,
            ownerId: user.id
        }

        console.log('updating', createdCat, id);
        try {
            await updateCat({catId: id!, details: createdCat}).unwrap();
            navigate('/');
        } catch (err) {
            setShowError(true);
        }
    }

    return (
        <>
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "2rem auto", display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2>Update Cat</h2>
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
                {isLoading ? 'Updating...' : 'Update Cat'}
            </Button>
        </form>
        <Snackbar open={isError} autoHideDuration={6000} onClose={() => setShowError(false)}>
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          Failed to update cat. Please try again.
        </Alert>
      </Snackbar>
      </>
    );
}