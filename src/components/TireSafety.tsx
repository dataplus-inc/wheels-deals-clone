import tireSafetyCheck from "@/assets/tire-safety-check.jpg";
import { Play } from "lucide-react";

const TireSafety = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-sm font-semibold text-secondary mb-4 tracking-wider uppercase">
              Getting To Know Your Vehicle. Don't Let Worn Tires Get In The Way Of Your Safety.
            </h3>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Watch Our Short Video And Learn About The Importance Of Replacing Your Tires And Keeping The Rubber On The Road
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative group cursor-pointer rounded-lg overflow-hidden shadow-xl">
              <img 
                src={tireSafetyCheck}
                alt="Tire safety inspection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-foreground/60 group-hover:bg-foreground/50 transition-colors flex items-center justify-center">
                <div className="bg-secondary rounded-full p-6 group-hover:scale-110 transition-transform">
                  <Play className="h-12 w-12 text-secondary-foreground fill-current" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-secondary w-2 h-2 rounded-full mt-2 flex-shrink-0" />
                <p className="text-lg">
                  <strong>Worn tires</strong> can significantly affect your stopping time on a wet road.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-secondary w-2 h-2 rounded-full mt-2 flex-shrink-0" />
                <p className="text-lg">
                  <strong>Tread depth</strong> is crucial for water displacement and keeping good contact with the road.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-secondary w-2 h-2 rounded-full mt-2 flex-shrink-0" />
                <p className="text-lg">
                  <strong>Don't wait</strong> to replace those old tires.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TireSafety;
