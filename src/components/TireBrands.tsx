const brands = [
  "MICHELIN",
  "GOODYEAR",
  "BRIDGESTONE",
  "CONTINENTAL",
  "PIRELLI",
  "FIRESTONE",
  "DUNLOP",
  "YOKOHAMA",
  "COOPER",
  "HANKOOK",
  "BF GOODRICH",
  "UNIROYAL"
];

const TireBrands = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-sm font-semibold text-muted-foreground mb-8 tracking-wider uppercase">
          All Major Tire Brands Available
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <div 
              key={brand}
              className="flex items-center justify-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm font-bold text-foreground/70 text-center">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TireBrands;
