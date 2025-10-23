import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Expertise from "@/components/Expertise";
import TireBrands from "@/components/TireBrands";
import NewsletterSignup from "@/components/NewsletterSignup";
import TireSafety from "@/components/TireSafety";
import Services from "@/components/Services";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Expertise />
      <TireBrands />
      <NewsletterSignup />
      <TireSafety />
      <Services />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
