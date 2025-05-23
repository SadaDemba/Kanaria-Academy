import "./KanariaPage.css";

import imageCover from "../../images/evastadium_cover.jpeg";

import TeamList from "../../components/RosterListTeam/TeamList";

export default function Kanaria() {
    return (
        <div>
            <div className="HeroHeaderCover">
                <img
                    src={imageCover}
                    alt=""
                    className="EVACoverHeroHeaderImage"
                />
            </div>
            <section className="AboutContainerRoster">
                <div className="aboutRoster">
                    <div className="about-contentRoster">
                        <TeamList />
                    </div>
                </div>
            </section>
        </div>
    );
}
