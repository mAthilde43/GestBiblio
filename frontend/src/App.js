import "./index.css";
import { Routes, Route, useLocation } from "react-router-dom";
import RegisterPage from "./pages/auth/register/RegisterPage";
import LoginPage from "./pages/auth/login/LoginPage";
import HomePage from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Utilisateur from "./pages/Utilisateur/Utilisateur";
import Account from "./pages/Account/Account";
import AddBook from "./pages/AddBook/AddBook";
import Catalogue from "./pages/Catalogue/Catalogue";
import LivreDetails from "./pages/LivreDetails/LivreDetails";
import Favoris from "./pages/Favoris/Favoris";
import Emprunter from "./pages/Emprunter/Emprunter";
import { AnimatePresence } from "framer-motion";

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/auth/login" ||
    location.pathname === "/auth/register";

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/users" element={<Utilisateur />} />
          <Route path="/account" element={<Account />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/livre/:id" element={<LivreDetails />} />
          <Route path="/favoris" element={<Favoris />} />
          <Route path="/emprunter" element={<Emprunter />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
