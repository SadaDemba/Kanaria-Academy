import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router

const ButtonLink = ({ to, children }) => {
    return (
        <Link to={to} style={{ textDecoration: "none" }}>
            <button
                style={{
                    padding: "15px 25px",
                    color: "rgba(255, 205, 3, 1)",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "larger",
                    backgroundColor: "#00382c",
                }}
            >
                {children}
            </button>
        </Link>
    );
};

export default ButtonLink;
