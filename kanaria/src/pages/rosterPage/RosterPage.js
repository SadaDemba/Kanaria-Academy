import "./RosterPage.css";

const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
        age--;
    }
    return age;
};

const TeamMember = ({
    photo,
    secondName,
    pseudo,
    firstName,
    dateNaiss,
    city,
    isActive
}) => {
    let age = calculateAge(dateNaiss);

    return (
        <div className={`team-member ${!isActive ? 'inactive' : ''}`}>
            <img className="imgMembre" src={photo} alt={pseudo} />
            <div className="infoMembre">
                <p>{`${firstName} "${pseudo}" ${secondName}`}</p>
                <p>
                    Date de naissance : {dateNaiss} ({age} ans)
                </p>
            </div>
        </div>
    );
};

function Roster() {
    const teamData = [
        {
            id: 1,
            photo: new URL("../../images/Membres/Marmoote.png", import.meta.url)
                .href,
            secondName: "Pillerel",
            pseudo: "MARMOOTTE",
            firstName: "Chloé",
            dateNaiss: "2002-09-30",
            isActive: true,
        },
        {
            id: 2,
            photo: new URL("../../images/Membres/Alioth.jpg", import.meta.url)
                .href,
            secondName: "Laquerriere",
            pseudo: "ALIOTH",
            firstName: "Camille",
            dateNaiss: "2002-09-18",
            isActive: false,
        },
        {
            id: 3,
            photo: new URL("../../images/Membres/VALOUVIB.png", import.meta.url)
                .href,
            secondName: "Bouet",
            pseudo: "VALOUVIB",
            firstName: "Valentin",
            dateNaiss: "1999-03-07",
            isActive: false,
        },
        {
            id: 4,
            photo: new URL("../../images/Membres/Y0TUS.jpg", import.meta.url)
                .href,
            secondName: "Guittet",
            pseudo: "Y0TUS",
            firstName: "Elliot",
            dateNaiss: "2001-04-21",
            isActive: true
        },
        {
            id: 5,
            photo: new URL(
                "../../images/Membres/Bourdinho.jpg",
                import.meta.url
            ).href,
            secondName: "Bourd",
            pseudo: "BOURDINHO",
            firstName: "Louka",
            dateNaiss: "2003-11-18",
            isActive: false,
        },
        {
            id: 6,
            photo: new URL("../../images/Membres/DRACUS.jpg", import.meta.url)
                .href,
            secondName: "Moebus",
            pseudo: "DRACUS",
            firstName: "Clément",
            dateNaiss: "1996-09-23",
            isActive: false,
        },
        {
            id: 8,
            photo: new URL("../../images/Membres/ARAGORN.jpg", import.meta.url)
                .href,
            secondName: "Perocheau",
            pseudo: "ARAGORN",
            firstName: "Florian",
            dateNaiss: "2004-05-07",
            isActive: false,
        },
        {
            id: 9,
            photo: new URL("../../images/Membres/zone.png", import.meta.url)
                .href,
            secondName: "Gadoum",
            pseudo: "ZONE",
            firstName: "Karam",
            dateNaiss: "2055-12-02",
            isActive: true
        },
        {
            id: 10,
            photo: new URL("../../images/Membres/W_OVNI.png", import.meta.url)
                .href,
            secondName: "Bouseloub",
            pseudo: "W_Ovni",
            firstName: "Walid",
            dateNaiss: "2006-09-04",
            isActive: true
        },
        {
            id: 11,
            photo: new URL("../../images/Membres/GOALGORITHME.jpg", import.meta.url)
                .href,
            secondName: "Thiam",
            pseudo: "GOALGORITHME",
            firstName: "Sada",
            dateNaiss: "1999-01-21",
            isActive: true

        }
    ];

    return (
        <div className="team-page">
            <h1 id="titlePage">Notre staff Kanaria</h1>
            <div className="team-members-container">
                {teamData.map((member) => (
                    <TeamMember
                        key={member.id}
                        photo={member.photo}
                        secondName={member.secondName}
                        pseudo={member.pseudo}
                        firstName={member.firstName}
                        dateNaiss={member.dateNaiss}
                        isActive={member.isActive}
                    />
                ))}
            </div>
        </div>
    );
}

export default Roster;
