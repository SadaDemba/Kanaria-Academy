import React, { useState } from "react";

import "./RosterListTeam.css";

import Logo from "../../images/logo_yellow.svg";

// Liste des membres de l'équipe
const teamMembers = [
    {
        id: 1,
        pseudo: "Darkkar",
        nom: "Philippe William",
        roles: "Rusher",
        photo: new URL(
            "../../images/TeamKanaria/Photo_selectionnee__3_-removebg-preview.png",
            import.meta.url
        ).href,
    },
    {
        id: 2,
        pseudo: "Bebesurf",
        nom: "Bricaud Mathieu",
        roles: "Teneur de Ligne",
        photo: new URL(
            "../../images/TeamKanaria/Photo_selectionnee__2_-removebg-preview.png",
            import.meta.url
        ).href,
    },
    {
        id: 3,
        pseudo: "Plushy",
        nom: "Duranti Thomas",
        roles: "Teneur de Ligne",
        photo: new URL(
            "../../images/TeamKanaria/Photo_selectionnee__1_-removebg-preview.png",
            import.meta.url
        ).href,
    },
    {
        id: 4,
        pseudo: "Marmootte",
        nom: "Pillerel Chloé",
        roles: "Capitaine",
        photo: new URL(
            "../../images/TeamKanaria/Photo_selectionnee-removebg-preview.png",
            import.meta.url
        ).href,
    },
    // Ajoutez d'autres membres ici si nécessaire
];

// Composant principal
const TeamList = () => {
    const [selectedMember, setSelectedMember] = useState(1);

    // Fonction pour gérer le clic sur un membre
    const handleClick = (memberId) => {
        setSelectedMember(memberId);
    };

    return (
        <div className="team-list-container">
            {/* Liste des membres */}
            <div className="member-list">
                <h2 className="TeamListTitle">Notre Equipe :</h2>
                {teamMembers.map((member) => (
                    <div
                        key={member.id}
                        className={`member ${selectedMember === member.id ? "selected" : ""
                            }`}
                        onClick={() => handleClick(member.id)}
                    >
                        <div className="member-data-title">
                            <img
                                src={Logo}
                                className="PpTeamMember"
                                alt="membre"
                            />
                            <div className="member-data">
                                <span className="dataText">
                                    <b>Pseudo</b> : {member.pseudo}
                                </span>
                                <span className="dataText">
                                    <b>Nom</b> : {member.nom}{" "}
                                </span>
                                <span className="dataText">
                                    <b>Roles</b> : {member.roles}{" "}
                                </span>
                            </div>
                        </div>
                        &#10095;
                    </div>
                ))}
            </div>

            {/* Affichage de la photo du membre sélectionné */}
            <div className={`member-photo ${selectedMember ? "show" : ""}`}>
                {selectedMember && (
                    <img
                        src={
                            teamMembers.find(
                                (member) => member.id === selectedMember
                            ).photo
                        }
                        className="ImageTeamMemeber"
                        alt="membre"
                    />
                )}
            </div>
        </div>
    );
};

export default TeamList;
