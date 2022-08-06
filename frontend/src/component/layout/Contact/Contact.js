import React from "react";
import { Button } from "@material-ui/core";
import "./Contact.css";

const Contact = () => {
    return (
        <div className="contactContainer">
            <a className="mailBtn" href="mailto:amaniitg2001+1@gmail.com">
                <Button>Contact Owner : amaniitg2001@gmail.com</Button>
            </a>
        </div>
    );
}

export default Contact
