import "./LandingPage.css";

import ButtonLink from "../../components/ButtonLink";

import HeroImg from "../../images/LandingPageHeroImg.png";

import WhatsNew from "../../components/whatsNew/whatsNew";
import RosterList from "../../components/RosterList/rosterList";
import Contact from "../../components/contact_form/Contact";
import TwitterFeed from "../../components/tweeter/GetTweeter";

import Logo from "../../images/logo_yellow.svg";

function LandingPage() {
    return (
        <div className="container">
            <section className="HeroHeader">
                <div className="HeroHeaderContainer">
                    <div className="Herotxt">
                        <h1>
                            Entrer dans le monde parallèle de la VR avec
                            Kanaria.
                        </h1>
                    </div>
                    <div className="HeroImg">
                        <img id="HeroImage" src={HeroImg} alt="KanariaTeam" />
                    </div>
                </div>
            </section>
            <section className="AboutContainer">
                <div className="about">
                    <div className="about-content" id="elementAApparaitre">
                        <div className="about-content-text">
                            <h2 className="titleAbout">
                                Lorem ipsum dolor sit amet consectetur.
                            </h2>
                            <p className="textabout">
                                Lorem ipsum dolor sit amet consectetur. Commodo
                                velit velit nunc cras egestas id. Sed magna eu
                                hendrerit praesent cras. Viverra sit gravida
                                duis dolor molestie. In id gravida leo volutpat
                                sed et. Id sit aenean diam vel nibh. Dui ac
                                vulputate tellus nunc. In faucibus turpis quis
                                egestas ullamcorper commodo facilisis. Nunc
                                donec tincidunt lacus turpis et consequat.
                                Aliquet cursus etiam sed tristique elementum
                                netus odio dignissim.
                            </p>
                            <ButtonLink to={"/contact"}>
                                En savoir plus
                            </ButtonLink>
                        </div>
                        <div className="about-content-img">
                            <img
                                id="Kanaria_logo_hero_landingpage"
                                src={Logo}
                                alt="KanariaTeam"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="whatsNew">
                <h2 className="whatsNewTitle">Les dernières actualités</h2>
                <hr className="separator"></hr>
                <WhatsNew />
            </section>
            <section className="Roster">
                <h2 className="RosterTitle">Découvrez nos Kanarias</h2>
                <hr className="separator"></hr>
                <RosterList />
            </section>
            <section id="ContactSection" className="Contacts">
                <div className="ContactsContents">
                    <h2>Contactez-Nous</h2>
                    <p>
                        Vous cherchez à nous contacter ou vous avez besoin de
                        renseignement sur Kanaria, N'hésitez pas à nous
                        contacter.
                    </p>
                    <ButtonLink to={"/contact"}>Nous Contacter</ButtonLink>
                </div>
            </section>
        </div>
    );
}
export default LandingPage;
