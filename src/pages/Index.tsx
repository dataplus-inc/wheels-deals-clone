import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Expertise from "@/components/Expertise";
import Services from "@/components/Services";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Expertise />
      <Services />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
