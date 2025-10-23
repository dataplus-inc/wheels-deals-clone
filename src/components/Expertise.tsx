import { Card, CardContent } from "@/components/ui/card";
import tiresBrands from "@/assets/tires-brands.jpg";
import carSpeedCurve from "@/assets/car-speed-curve.jpg";
import tireTreads from "@/assets/tire-treads.jpg";

const features = [
  {
    image: tiresBrands,
    title: "ALL MAJOR BRANDS",
    description: "We have the right tire, with the right warranty, at the right price. In stock or available in most cases by next day."
  },
  {
    image: carSpeedCurve,
    title: "30-DAY PRICE GUARANTEE",
    description: "Find a lower price within 30 days? We'll refund the difference. Your satisfaction is our priority."
  },
  {
    image: tireTreads,
    title: "WE INSTALL 3 MILLION TIRES A YEAR",
    description: "As one of the nation's largest independent tire dealers, we are experts at fitting and installing the right tires for you."
  }
];

const Expertise = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Experience Our Tire Expertise
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Your safety and driving comfort depend upon quality tires. We carry one of the largest tire inventories — passenger, performance, crossover/SUV, and light truck. Ask our tire experts for a recommendation for your vehicle.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {features.map((feature) => (
            <Card key={feature.title} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3 text-primary">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertise;
