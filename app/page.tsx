import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Collaborations from "./components/Collaborations";
import Stats from "./components/Stats";
import Trusted from "./components/Trusted";
import BonsPlansPreview from "./components/BonsPlansPreview";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Collaborations />
        <Stats />
        <Trusted />
        <BonsPlansPreview />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
