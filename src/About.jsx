import React from "react";
import './About.css'
import Footer from './Components/Footer'

const About = () =>{
    return(
        <div> 
        <div className = 'about'>
            <h1>About Us</h1>
            <div className="box3"></div>

            <p>Welcome to <span>Civic Portal</span>, the digital bridge between the residents
                and their local government. Our platform is dedicated to 
                making our community a better place, one small issue at a time. <br /> <br />

                Whether it's a flickering streetlight, a damaged sidewalk, or the need for dustbin 
                replacement, we empower you to report these concerns directly to those who can fix 
                them. We believe that by addressing these everyday challenges, we can collectively 
                enhance the quality of life in our neighborhoods. <br />  <br/>

                Our mission is to ensure that the voices of residents are heard and that 
                their concerns are addressed efficiently. 
                By making it easier to connect with local government services, we're paving the way 
                for a cleaner, safer, and more vibrant community. <br /> <br />

                Together, let's keep our community shining bright. Report an issue today, and be part
                 of the solution! <br /> <br /> <br /> <br />

</p>
</div>
<Footer/>

        </div>
    )
}
export default About;