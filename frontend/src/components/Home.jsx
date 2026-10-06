import { motion as Motion } from "framer-motion";

import Navbar from "./Navbar";
import Hero from "./Hero";
import Teams from "./Team";
import VideoSection from "./VideoSection";
import Departments from "./Departments";
import Footer from "./Footer";
import VisionMission from "./VisionMission";
import EmergencyForm from "./EmergencyForm";

function Home(){
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    };

    return(
        <>
            <Navbar/>
            <Hero/>
            <Motion.div
                initial="hidden"
                whileInView="visible"
                variants={sectionVariants}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <Departments/>
            </Motion.div>
            <Motion.div
                initial="hidden"
                whileInView="visible"
                variants={sectionVariants}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <VisionMission/>
            </Motion.div>
            <Motion.div
                initial="hidden"
                whileInView="visible"
                variants={sectionVariants}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <VideoSection/>
            </Motion.div>
            <Motion.div
                initial="hidden"
                whileInView="visible"
                variants={sectionVariants}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <EmergencyForm />
            </Motion.div>
            <Motion.div
                initial="hidden"
                whileInView="visible"
                variants={sectionVariants}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <Teams/>
            </Motion.div>
            <Motion.div
                initial="hidden"
                whileInView="visible"
                variants={sectionVariants}
                transition={{ duration: 0.6, delay: 0.6 }}
            >
                <Footer/>
            </Motion.div>
        </>
    )
}

export default Home;
