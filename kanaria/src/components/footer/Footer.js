import "./Footer.css";
import { Link } from "react-router-dom";

import Logo from "../../images/Logo_footer.svg";

import LogoInsta from "../../images/SocialNetworkIcons/InstaIcons.svg";
import LogoDiscord from "../../images/SocialNetworkIcons/DiscordIcons.svg";
import LogoTiktok from "../../images/SocialNetworkIcons/TikTokIcons.svg";
import LogoTwitter from "../../images/SocialNetworkIcons/TwitterIcons.svg";
import LogoYt from "../../images/SocialNetworkIcons/YoutubeIcons.svg";

function Footer() {
    return (
        <div className="footer">
            <div className="Footercontainer">
                <div className="FooterItemsLogo">
                    <img id="logoKanariaFooter" src={Logo} alt="KanariaTeam" />
                </div>
                <div className="FooterItemsListPage">
                    <div className="ListPageItem">
                        <Link to={"/"} className="link">
                            Accueil
                        </Link>
                        <Link to={"/"} className="link">
                            A Propos
                        </Link>
                        <Link to={"/roster"} className="link">
                            Roster
                        </Link>
                    </div>
                    <div className="ListPageItem">
                        <Link to={"/news"} className="link">
                            Actualités
                        </Link>
                        <Link to={"/contact"} className="link">
                            Contact
                        </Link>
                        <Link to={"/recruitment"} className="link">
                            Kanaria recrute
                        </Link>
                    </div>
                </div>
                <div className="FooterItemsPartners">
                    <p>Partenaires</p>
                </div>
                <div className="FooterItemSocialMedia">
                    <p>Suivez nous sur nos réseaux sociaux</p>
                    <div className="socialNetworkicon">
                        <a href="">
                            <img
                                id="SociallogoFooter"
                                src={LogoInsta}
                                alt="KanariaTeam"
                            />
                        </a>
                        <a href="">
                            <img
                                id="SociallogoFooter"
                                src={LogoDiscord}
                                alt="KanariaTeam"
                            />
                        </a>
                        <a href="">
                            <img
                                id="SociallogoFooter"
                                src={LogoTiktok}
                                alt="KanariaTeam"
                            />
                        </a>
                        <a href="">
                            <img
                                id="SociallogoFooter"
                                src={LogoTwitter}
                                alt="KanariaTeam"
                            />
                        </a>
                        <a href="">
                            <img
                                id="SociallogoFooter"
                                src={LogoYt}
                                alt="KanariaTeam"
                            />
                        </a>
                    </div>
                </div>
            </div>
            <p>
                <a href="" className="link">
                    Mentions Légales
                </a>{" "}
                -{" "}
                <a href="" className="link">
                    Cookies
                </a>{" "}
                - Kanaria 2023
            </p>
        </div>
    );
}

export default Footer;
