import "./whatsNew.css";

const files = [
    {
        id: "1",
        source: new URL("../../images/Rectangle_1.png", import.meta.url).href,
        texte: "TEXTE NEWS",
    },
    {
        id: "2",
        source: new URL("../../images/Rectangle_2.png", import.meta.url).href,
        texte: "TEXTE NEWS",
    },
    {
        id: "3",
        source: new URL("../../images/Rectangle_3.png", import.meta.url).href,
        texte: "TEXTE NEWS",
    },
];

export default function whatsNew() {
    return (
        <ul role="list" className="NewsList">
            {files.map((file) => (
                <li key={file.source} className="Newsbox">
                    <a href="">
                        <div class="card">
                            <img
                                src={file.source}
                                alt=""
                                className="NewsImage"
                            />
                            <div class="card-content">
                                {file.texte}
                                {file.id}
                            </div>
                        </div>
                    </a>
                </li>
            ))}
        </ul>
    );
}
