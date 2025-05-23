import React, { useState } from "react";
import "./carousel.css";

const Carousel = ({ images, text }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextSlide = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="carousel">
            <button className="arrow prev" onClick={prevSlide}>
                &#10094;
            </button>
            <div className="carousel-inner">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={
                            index === currentImageIndex
                                ? "slide active"
                                : "slide inactive"
                        }
                    >
                        <img src={image} alt={`Slide ${index + 1}`} />

                        {text.map((text, index) => (
                            <div
                                key={index}
                                className={
                                    index === currentImageIndex
                                        ? "text active"
                                        : "text inactive"
                                }
                            >
                                <h2>Pseudo : {text.PlayerPseudo}</h2>
                                <h2>Nom : {text.PlayerName}</h2>
                                <h2>Roles : {text.PlayerRoles}</h2>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <button className="arrow next" onClick={nextSlide}>
                &#10095;
            </button>
        </div>
    );
};

export default Carousel;
