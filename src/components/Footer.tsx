import { Wrench } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground/95 text-background py-8 border-t border-background/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <div className="flex flex-col">
              <span className="font-bold">Wheels & Deals</span>
              <span className="text-xs text-background/70">Auto & Services</span>
            </div>
          </div>
          
          <div className="text-sm text-background/70 text-center md:text-left">
            © {new Date().getFullYear()} Wheels & Deals Auto & Services. All rights reserved.
          </div>
          
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
