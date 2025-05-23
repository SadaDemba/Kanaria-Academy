import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './authPage.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Notification from "../../../composables/notification/Notification.js";
import { useAuth } from "../../../contexts/index";


export default function Authentication() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation simple des entrées
        if (!email.trim() || !password.trim()) {
            Notification.warning("Veuillez remplir tous les champs");
            setLoading(false);
            return;
        }

        try {
            const userData = { email, password };
            const response = await login(userData);

            if (response && response.token) {
                Notification.success("Connexion réussie ...");

                setTimeout(() => {
                    navigate("/admin/forms-list");
                }, 1500);
            }
        } catch (err) {
            Notification.error(err.message);
        } finally {
            setLoading(false);
        }
    };




    return (

        <div className="container">
            <section className="HeroHeader">
                <div className="HeroHeaderContainer">
                    <div className="Herotxt">
                        <h1>
                            Administration
                        </h1>
                    </div>

                </div>
            </section>
            <div className="auth-container">
                <form onSubmit={handleLogin} className="auth-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className="toggle-password-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button type="submit" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</button>
                </form>
            </div>
        </div>

    );
}
