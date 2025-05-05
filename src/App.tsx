import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./features/auth/LoginPage";
import { RegistrationPage } from "./features/auth/RegistrationPage";
import { PrivateRoute } from "./features/auth/PrivateRoute";
import { HomePage } from "./features/user/HomePage";
import { CreateCatPage } from "./features/cats/CreateCatPage";
import { UpdateCatPage } from "./features/cats/UpdateCatPage";

export const App = () => (
  <Router>
    <Routes>
    <Route path='/' element={<PrivateRoute page={<HomePage />} />} />
      <Route path='/createCat' element={<PrivateRoute page={<CreateCatPage />} />} />
      <Route path="/cats/:id" element={<PrivateRoute page={<UpdateCatPage />} />} />
      <Route path='/register' element={<RegistrationPage />} />
      <Route path='/login' element={<LoginPage />} />
    </Routes>
  </Router>
);
