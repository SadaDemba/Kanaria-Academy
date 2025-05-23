import "./rosterList.css";

const files = [
    {
        id: "1",
        source: new URL(
            "../../images/TeamKanaria/Photo_selectionnee__3_-removebg-preview.png",
            import.meta.url
        ).href,
        PlayerName: "Philippe William",
        PlayerPseudo: "Darkkar",
    },
    {
        id: "2",
        source: new URL(
            "../../images/TeamKanaria/Photo_selectionnee__2_-removebg-preview.png",
            import.meta.url
        ).href,
        PlayerName: "Bricaud Mathieu",
        PlayerPseudo: "Bebesurf",
    },
    {
        id: "3",
        source: new URL(
            "../../images/TeamKanaria/Photo_selectionnee__1_-removebg-preview.png",
            import.meta.url
        ).href,
        PlayerName: "Duranti Thomas",
        PlayerPseudo: "Plushy",
    },
    {
        id: "4",
        source: new URL(
            "../../images/TeamKanaria/Photo_selectionnee-removebg-preview.png",
            import.meta.url
        ).href,
        PlayerName: "Pillerel Chloé",
        PlayerPseudo: "Marmootte",
    },
];

export default function RoosterList() {
    return (
        <ul className="RosterList">
            {files.map((file) => (
                <li key={file.source} className="Rosterbox">
                    <a href={"/roster"}>
                        <div class="cardRoster">
                            <img
                                src={file.source}
                                alt=""
                                className="RosterImage"
                            />
                            <div class="cardRoster-content">
                                {file.PlayerPseudo}
                            </div>
                        </div>
                    </a>
                </li>
            ))}
        </ul>
    );
}
