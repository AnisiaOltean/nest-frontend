import { JSX, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks/redux/hooks';
import { verifyJwt } from './authSlice';


export const PrivateRoute = ({ page }: { page: JSX.Element }) => {
  const { isSuccess, isAuthenticated, jwt } = useAppSelector(
    (state) => state.auth
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!jwt || !jwt?.access_token) return;

    dispatch(verifyJwt(jwt.access_token));
  }, [jwt, isSuccess]);


  return isAuthenticated ? page : <Navigate replace to='/login' />;
};