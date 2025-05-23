import "./ContactPage.css";

import ContactForm from "../../components/contact_form/Contact";

function Contact() {
    return (
        <div className="Contact-container-main">
            <h1>Contactez-Nous</h1>
            <p className="Contact-text">
                Vous souhaitez en savoir plus sur Kanaria ou vous avez des
                questions concernant nos événements, nos équipes ou nos
                partenariats ? Nous sommes là pour vous aider ! N'hésitez pas à
                nous contacter en utilisant les informations ci-dessous.
            </p>
            <ContactForm />
        </div>
    );
}

export default Contact;
