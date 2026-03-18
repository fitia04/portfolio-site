import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Discoveries from "./components/Discoveries";
import MapPreview from "./components/MapPreview";
import Collaborations from "./components/Collaborations";
import Stats from "./components/Stats";
import Trusted from "./components/Trusted";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Discoveries />
        <MapPreview />
        <Collaborations />
        <Stats />
        <Trusted />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
