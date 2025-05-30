# Frontend using React + Redux toolkit for state management
# Cats management PoC app
### Here, users are able to:
- authenticate using JWT
- add a new cat
- update the cat (the last time it was fed, name, breed)
- or delete an existing app 
### This is a basic CRUD application for which React along with Redux Toolkit were used for building the UI and managing application state 

## Short introduction on React
[React.js](https://react.dev/learn) is a JavaScript library used for building user interfaces using components written is JSX syntax. In this projects, the following were used:
- the basic `useState` and `useNavigate` (`react-router`) hooks for dealing with local state and navigation, respectivelly
- [MaterialUI](https://mui.com/material-ui/) (`@mui/material`) as a library that provides React components
- [Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started) (`@reduxjs/toolkit`) and [Redux Toolkit Query](https://redux-toolkit.js.org/rtk-query/overview) (`@reduxjs/toolkit/query/react`) for managing global state

## Redux Toolkit and Redux Toolkit Query (RTK Query)
In Redux, the global state of an app is stored in an object called store. The only way to change the state is to create an action (an object describing what happened) and dispatch it to the store. Reducers are then used to specify how state gets updated according to the dispatched action. Reducers are functions that calculate a new state based on the old state and the action. 

Redux Toolkit (RTK) provides utilities to simplify writing Redux logic code, such as:
- setting up the store (with the configureStore function)
- creating reducers (with the createSlice function)
- abstracting the dispatch actions before-during-and after async requests with createAsyncThunk; createAsyncThunk automatically generates three action types (pending, fulfilled and rejected) which are used in the extraReducers to modify the state

Our app has the following contents inside `src/` folder:
- `app/` folder: contains a `hook/` folder with the hooks used in the app, along with `store.ts` in which the store is defined and `types.ts` with the interfaces of our datastructures
- `features/`: contains the app features: 
  - `auth/` folder with the `Auth.API` for the axios backend calls, `auth.slice` for the authentication slice and related React components `LoginPage.tsx`, `RegistrationPage.tsx` and `PrivateRoute.tsx` (used to wrap all pages in our routes defined in `src/App.tsx`)
  - `cats/` folder: contains RTK Query service generated in `CatsAPI.ts` and the relevant pages `CreateCatPage.tsx`, 'UpdateCatPage.tsx', `CatCard.tsx` and some shared css styling in `Form.module.css`
  - `user/` folder: defines the `HomePage.tsx`and styling inside `HomePage.module.css`

  The application routes are defined inside the `src/App.tsx` file which provides the App() component and the routes defined with `react-router-dom`. Finally, the entry point of the app is the `main.tsx` file used to render the App component().

The Redux store is the central "bucket" in which the application state is stored. In our application, the store is configured by passing two reducers paths, one used for authentication (auth) and the other one for API calls on the cats/ endpoint (catApi).
 ```
app/store.ts
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [catApi.reducerPath]: catApi.reducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(catApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```
The store defined above also contains the default middleware along with the catApi.middleware. The catApi middleware is important here, because catApi uses RTK Query which automatically generates and returns an API service "slice" object structure including the reducers and react hooks that allow the usage of the queries or mutations defined in the endpoints. 

For authentication, we have defined the authSlice slice that contains the reducer logic to manage the authentication logic. The authentication state contains information about the logged user, the generated JWT (by the jwt-guard in nest.js) and some additional flags (isAuthenticated, isError, isSuccess) which are used in our components.
```
authSlice.ts 

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { JWT, StoredUser, User } from "../../app/types";
import authService from "./AuthAPI";
import { RootState } from "../../app/store";

export const register = createAsyncThunk('auth/register', 
    async (user: User, thunkAPI) => {
        try {
            return await authService.registerAPI(user);
        } catch (error) {
            return thunkAPI.rejectWithValue('Unable to register!');
        }
    }
)

export const login = createAsyncThunk('auth/login', 
    async (user: User, thunkAPI) => {
        try {
            return await authService.loginAPI(user);
        } catch (error) {
            return thunkAPI.rejectWithValue('Unable to login!');
        }
    }
)

export const logout = createAsyncThunk('auth/logout', 
    async () => {
        await authService.logoutAPI();
    }
)

export const verifyJwt = createAsyncThunk(
    'auth/verify-jwt',
    async (jwt: string, thunkAPI) => {
      try {
        return await authService.verifyJwtAPI(jwt);
      } catch (error) {
        return thunkAPI.rejectWithValue('Unable to verify');
      }
    }
);

export const authSlice = createSlice({
    name: 'auth', 
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            console.log(action.payload);
            state.user = null;
        })
        .addCase(register.rejected, (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.user = null;
        })
        .addCase(login.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.jwt = action.payload.access_token;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        })
        .addCase(login.rejected, (state) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.isSuccess = false;
            state.user = null;
        })
        .addCase(verifyJwt.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(verifyJwt.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isAuthenticated = action.payload;
        })
        .addCase(verifyJwt.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
            state.isAuthenticated = false;
        })
        .addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.jwt = null;
            state.isAuthenticated = false;
          })
    },
});

export const { reset } = authSlice.actions; 
```
In the file above, we have manually defined login, logout and register functions with createAsyncThunk so that we can perform asynchronous tasks in the slice. extraReducers are the used to update the state of our async operations using the three possible stages of the API call: pending, fulfilled, rejected. The state manipulated in the slice function is exported in `export default authSlice.reducer;` so that it can be used inside the store.ts file

In order to acces the state in React components, we have used two typed Redux hooks:
```
app/hooks/redux/hooks.ts 

import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux"
import type { AppDispatch, RootState } from "../../store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 
```
where useAppDispatch is used to dispatch actions to reducers via the store and useAppSelector is used to access and select specific parts of the Redux state: 
```
// LoginPage.tsx
    const dispatch = useAppDispatch(); 
    const { isLoading, isSuccess, isError, isAuthenticated } = useAppSelector((state) => state.auth); //access auth state
    const navigate = useNavigate();

    useEffect(() => {
        if(isSuccess) {
            dispatch(reset());  // dispatch the 'reset()' reducer function to update the state
        }
        .... 
    });
```
In this case, thunks are used for writing the asynchronous logic in our Redux app. A thunk function is a function that accepts two arguments: the dispatch method and getState method (of the Redux store). Thunk functions are usually called via the store.dispatch() method and allow to wrote redux logic outside the UI layer. Reducers cannot contain side effects, which is why thunks are used as a place to put those side effects outside our components. 

Async thunks in Redux are introduced for easily creating and dispatching actions describing asynchronous requests. Usually, an async requests requires an action dispatched before the request (like a loading indicator when fetching items from an API) and another "success" or "failure" action, depending on the resolved promise. The createAsyncThunk API in Redux generates thunks that automatically dispatch those "start/success/failure" actions for us (pending, fullfiled and rejected). In createAsyncThunk, we only need to specify a string that will be used as the prefix for the generated action types and a A "payload creator" callback function that returns a Promise with some data. We can listen to actions defined outside of the slice inside the extraReducers, where for each state (pending, fulfilled, rejected) we can access the state and payload through the parameters `(state, action)`, where action is represents the resolved value defined inside the async function (thunk).

For the cats/ endpoint, Redux Toolkit Query (RTK Query) was used because it is a powerful tool that simplifies loading data in our web application, eliminating the need to write data fetching and logic by hand. RTK QUery provides the following API:
- createApi(): used to define endpoints and how data is retrieved from the endpoints
- fetchBaseQuery(): it is a small wrapper around fetch() to simplify making requests

In this case, RTK Query generates React hooks that encapsulate the entire data fetching process, provide data and isLoading fields to components, and manage the lifetime of cached data as components mount and unmount. Integrating RTK Query begins by creating an API slice with `createApi` where we have defined the "endpoints" from where data is retrieved and sent to (without having to manually write the requests using axios, like the case of authentication).

```
CatsAPI.ts 

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CatDetails, Cat, JWT } from "../../app/types";

export const catApi = createApi({
    reducerPath: 'catApi',
    tagTypes: ['Cats'],
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${import.meta.env.VITE_BASE_API}/`,
        prepareHeaders: (headers) => {
            const jwtString = localStorage.getItem("jwt");

            if (jwtString) {
                try {
                  const tokenObj: JWT = JSON.parse(jwtString);
                  const accessToken = tokenObj?.access_token;
            
                  if (accessToken) {
                    headers.set("Authorization", `Bearer ${accessToken}`);
                  }
                } catch (error) {
                  console.error("Failed to parse JWT from localStorage:", error);
                }
              }
            
              return headers;
          },
    }),
    endpoints: (builder) => ({
        createCat: builder.mutation<Cat, CatDetails>({
          query: (newCat) => ({
            url: 'cats',
            method: 'POST',
            body: newCat,
          }),
          invalidatesTags: (result, error, args) => [{ type: 'Cats' as const }],
        }),
      
        getCatsForUser: builder.query<Cat[], {ownerId: Number}>({
          query: () => `cats`,
          providesTags: (result, error, args) => 
            result
          ? [...result.map(({ id }) => ({ type: 'Cats' as const, id: String(id) })), 'Cats']
          : ['Cats'],
        }),

        getCatById: builder.query<Cat, { catId: string }>({
          query: ({catId}) => `cats/${catId}`,
          providesTags: (result, error, { catId }) => [{ type: 'Cats' as const, id: String(catId) }],
        }),

        updateCat: builder.mutation<Cat, { catId: string; details: CatDetails}>({
          query: ({catId, details}) => ({
            url: `cats/${catId}`,
            method: 'PATCH',
            body: details,
          }),
          invalidatesTags: (result, error, { catId }) => [{ type: 'Cats', id: String(catId) }],
        }),

        deleteCat: builder.mutation<void, { catId: number }>({
          query: ({catId }) => ({
            url: `cats/${catId}`,
            method: 'DELETE',
          }),
          invalidatesTags: (result, error, { catId }) => [{ type: 'Cats', id: String(catId) }],
        }),
      }),
});

export const { useCreateCatMutation, useGetCatByIdQuery, useGetCatsForUserQuery, useUpdateCatMutation, useDeleteCatMutation } = catApi;
```
A key feature of RTK Query is caching data from servers such that when additional requests are performed, the existing cache will be provided instead of running a new API call to the server. This is why we have used invalidating cache tags to automate refetching for query endpoints that are affected by other mutation endpoints. For example, the query getCatsForUser provides specific tags for all cat objects in the result response array and the general 'Cats' tag or just the generic 'Cats' tag if the result is undefined.
```
  providesTags: (result, error, args) => 
            result
          ? [...result.map(({ id }) => ({ type: 'Cats' as const, id: String(id) })), 'Cats']
          : ['Cats'],
``` 
which will trigger a refetch of the endpoint whenever another mutation endpoint like updateCat invalidates a specific tag: `invalidatesTags: (result, error, { catId }) => [{ type: 'Cats', id: String(catId) }],` or createCat `invalidatesTags: (result, error, args) => [{ type: 'Cats' as const }],` which uses the generic 'Cats' tag for invalidation.
Finally, RTK Query also provides generated react hooks for the endpoint and mutation type. This allows us to use the data proivided by the hooks in our components:
```
CreateCatPage.tsx
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
        <form onSubmit={handleSubmit} className={styles.form}>
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
```
Here, the api slice has generated the useCatCreationMutation() to acess the createCat() method, along with additional options { isLoading } that control the fetching behaviour of the hook. So now we don't have to manually define isLoading as a state variable by hand, RTK Query will do that for us. Notice that in this component we also use the { user } state defined in the manually created authStore using the useAppSelector hook which allows us to access the app state in our React component.
We have also created a <PrivateRoute /> component to protect all routes inside App.tsx (doubles the validation that is already done on the backend using NestJS Guards) by dispatching the verifyJwt() thunk that checks if the token is expired or not. If it is expired, it automatically redirects the user to the login page. 
```
auth/PrivateRoute.tsx

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
```

Finally, we provide the store defined in app/store.ts inside the src/main.tsx file by wrapping the <App /> component around the redux <Provider> and passing the store as prop:
```
main.tsx 

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "./App";
import { store } from "./app/store";
import "./index.css";

const container = document.getElementById("root")

... 

  root.render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  )
  
... 
```