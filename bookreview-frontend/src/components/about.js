import React from "react";
import '../style.css'

const About = () => {
    return (
        <div className="about-container">
            <h2>About BookStation</h2>
            <p>
            The Book Review App is a platform that allows users to browse and review books. 
            
            Users can also contribute by adding new books to the collection.
            </p>
            <p>  The aim of this app is to help book enthusiasts make informed decisions by providing comprehensive reviews. </p>
            <p className="developed">Developed with ❤️ by Kihuni using React and Django.</p>
       </div>
    );
}
export default About