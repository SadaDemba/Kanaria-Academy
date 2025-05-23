import { useState } from "react";
import './recruitmentPage.css'

export default function Recruitment() {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        training: "",
        level: "",
        birthDate: "",
        role: "",
        motivation: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value
            .replace(/(\d{2})(?=\d)/g, "$1 ")
            .trim();
        setFormData({ ...formData, phoneNumber: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            console.log("Formulaire soumis avec succès :", formData);
            alert("Votre candidature a été envoyée !");
        } else {
            setErrors(newErrors);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis.";
        if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis.";
        if (!formData.email.trim()) newErrors.email = "L'email est requis.";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Veuillez entrer un email valide.";
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Le numéro de téléphone est requis.";
        else if (!/^(\d{2} ){4}\d{2}$/.test(formData.phoneNumber))
            newErrors.phoneNumber = "Veuillez entrer un numéro de téléphone valide (format: 01 23 45 67 89).";
        if (!formData.training.trim()) newErrors.training = "La formation est requis.";
        if (!formData.level.trim()) newErrors.level = "Le niveau est requis.";
        if (!formData.birthDate) newErrors.birthDate = "La date de naissance est requise.";
        if (!formData.role.trim()) newErrors.role = "Le rôle est requis.";
        if (!formData.motivation.trim().length > 300) newErrors.motivation = "La motivation ne doit pas dépasser 300 caractères."

        return newErrors;
    };


    return (
        <div className="container">
            <section className="HeroHeader">
                <div className="HeroHeaderContainer">
                    <div className="Herotxt">
                        <h1>
                            Rejoignez l'aventure
                        </h1>
                    </div>

                </div>
            </section>
            <section className="form-container">
                <div className="form">
                    <div className="form-content" id="form">
                        <div>
                            <h2 className="form-title">Formulaire de Recrutement pour le Tournoi d'Esport</h2>
                            <p className="textabout">
                                Ne manquez pas cette chance unique! Remplissez ce formulaire et faites partie des participants privilégiés à notre tournoi d'esport.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="firstName">Prénom</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                    {errors.firstName && <p className="error">{errors.firstName}</p>}
                                </div>

                                <div>
                                    <label htmlFor="lastName">Nom</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                    {errors.lastName && <p className="error">{errors.lastName}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <p className="error">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="phone">Numéro de téléphone </label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        placeholder="01 23 45 67 89"
                                        value={formData.phoneNumber}
                                        onChange={(e) => handlePhoneChange(e)}
                                        maxLength={14}
                                    />
                                    {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
                                </div>

                                <div>
                                    <label htmlFor="training">Formation</label>
                                    <select
                                        id="training"
                                        name="training"
                                        value={formData.training}
                                        onChange={handleChange}
                                    >
                                        <option value=""> -- Sélectionnez votre formation -- </option>
                                        <option value="informatique">Informatique</option>
                                        <option value="cybersécurité">Cybersécurité</option>
                                        <option value="ia et data">Intelligence Artificielle & Data</option>
                                        <option value="3D, animation, jeux vidéo et industries du futur">3D,Animation, jeu vidéo & Industries du futur</option>
                                        <option value="market-com">Martketing & Communication</option>
                                        <option value="tech-business">Tech et Business</option>
                                        <option value="créa-design">Création & Digital Design</option>
                                        <option value="audiovisuel">Audiovisuel</option>
                                        <option value="illustration">Illustration</option>
                                        <option value="archi-interieru">Architecture d'interieur</option>
                                        <option value="bat-numérique">Bâtiment et Numerique</option>
                                        <option value="son-musique">Son et Musique</option>
                                    </select>
                                    {errors.training && <p className="error">{errors.training}</p>}
                                </div>

                                <div>
                                    <label htmlFor="role">Niveau</label>
                                    <select
                                        id="level"
                                        name="level"
                                        value={formData.level}
                                        onChange={handleChange}
                                    >
                                        <option value=""> -- Sélectionnez votre niveau -- </option>
                                        <option value="licence 1">Licence 1</option>
                                        <option value="licence 2">Licence 2</option>
                                        <option value="licence 3">Licence 3</option>
                                        <option value="master 1">Master 1</option>
                                        <option value="master 2">Master 2</option>
                                    </select>
                                    {errors.level && <p className="error">{errors.level}</p>}
                                </div>

                                <div>
                                    <label htmlFor="birthDate">Date de naissance</label>
                                    <input
                                        type="date"
                                        id="birthDate"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                    />
                                    {errors.birthDate && <p className="error">{errors.birthDate}</p>}
                                </div>

                                <div>
                                    <label htmlFor="role">Rôle dans le jeu</label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Sélectionnez un rôle --</option>
                                        <option value="coach">Coach</option>
                                        <option value="joueur">Joueur</option>
                                        <option value="indécis">Peu importe</option>
                                    </select>
                                    {errors.role && <p className="error">{errors.role}</p>}
                                </div>

                                <div>
                                    <label htmlFor="motivation">Motivation</label>
                                    <textarea
                                        id="motivation"
                                        name="motivation"
                                        placeholder="Expliquez vos attentes et ce que vous voulez accomplir"
                                        value={formData.motivation}
                                        onChange={handleChange}
                                        rows="4"
                                    />
                                    {errors.motivation && <p className="error">{errors.motivation}</p>}
                                </div>

                                <button className="submit-btn" type="submit">Envoyer ma candidature</button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}