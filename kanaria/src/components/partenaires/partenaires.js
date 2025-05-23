import { useNavigate } from "react-router-dom";
import "./partenaires.css";

const Partenaires = () => {
    const navigate = useNavigate();

    // Liste des logos des partenaires
    const partenaires = [
        {
            id: 1,
            image: new URL(
                "../../images/Partenaires/logo_ynov.webp",
                import.meta.url
            ).href,
        },
        {
            id: 2,
            image: new URL(
                "../../images/Partenaires/logo_decathlon.png",
                import.meta.url
            ).href,
        },
        {
            id: 3,
            image: new URL(
                "../../images/Partenaires/logo_boulanger.jpg",
                import.meta.url
            ).href,
        },
    ];

    return (
        <div className="partenaires-container">
            <div className="partenaires-slide-track">
                {partenaires.map((partenaire, index) => (
                    <div className={`partenaires-slide`} key={index + 1}>
                        <img
                            src={partenaire.image}
                            alt={`Logo partenaire ${index + 1}`}
                        />
                    </div>
                ))}
                {partenaires.map((partenaire, index) => (
                    <div className={`partenaires-slide`} key={index + 1}>
                        <img
                            src={partenaire.image}
                            alt={`Logo partenaire ${index + 1}`}
                        />
                    </div>
                ))}
                {partenaires.map((partenaire, index) => (
                    <div className={`partenaires-slide`} key={index + 1}>
                        <img
                            src={partenaire.image}
                            alt={`Logo partenaire ${index + 1}`}
                        />
                    </div>
                ))}
                {partenaires.map((partenaire, index) => (
                    <div className={`partenaires-slide`} key={index + 1}>
                        <img
                            src={partenaire.image}
                            alt={`Logo partenaire ${index + 1}`}
                        />
                    </div>
                ))}
                {partenaires.map((partenaire, index) => (
                    <div className={`partenaires-slide`} key={index + 1}>
                        <img
                            src={partenaire.image}
                            alt={`Logo partenaire ${index + 1}`}
                        />
                    </div>
                ))}
                {partenaires.map((partenaire, index) => (
                    <div className={`partenaires-slide`} key={index + 1}>
                        <img
                            src={partenaire.image}
                            alt={`Logo partenaire ${index + 1}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Partenaires;
