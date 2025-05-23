import React from "react";

import "./Contact.css";

const Contact = () => {
    return (
        <div class="contact-form-container">
            <form id="contact-form" action="#" method="post">
                <div class="form-group-main">
                    <div class="form-group">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Nom"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Prénom"
                            required
                        />
                    </div>
                </div>
                <div class="form-group">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        required
                    />
                </div>
                <div class="form-group">
                    <textarea
                        id="message"
                        name="message"
                        rows="5"
                        placeholder="Message"
                        required
                    ></textarea>
                </div>
                <button type="submit">Envoyer</button>
            </form>
        </div>
    );
};

export default Contact;
