import React from "react";

const Footer = () => {
    return (
        <footer className="text-center mt-5 p-3 bg-light">
            <small>FinanzasPro © {new Date().getFullYear()}. Todos los derechos reservados.</small>
        </footer>
    );
};

export default Footer;
