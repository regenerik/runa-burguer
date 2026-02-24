import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/burger-shop/Header";
import { Footer } from "@/components/burger-shop/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-9xl font-heading text-primary">404</h1>
          <h2 className="text-4xl font-bold text-white uppercase tracking-tighter">
            ¿Te perdiste en el bosque?
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            La página que buscas no existe. Mejor volvé a ver nuestras burgers.
          </p>
          <Link
            to="/"
            className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
