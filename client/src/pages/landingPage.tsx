import { Link } from 'react-router-dom';

const FloatingShape = ({ className }: { className?: string }) => (
  <div
    className={`floating absolute rounded-full mix-blend-lighten filter blur-xl opacity-30 ${className}`}
  ></div>
);

export default function LandingPage() {
  return (
    <div className="h-screen  flex  justify-center items-center text-center animate-fade-in-up">
      
      <FloatingShape className="w-48 h-48 bg-vibrant-purple/70 bottom-1/4 right-1/4" />
      <FloatingShape className="w-32 h-32 bg-neon-green/70 bottom-1/3 left-1/5" />

      <div className="tech-card p-8 md:p-12">
        <h1 className="text-6xl md:text-8xl font-black">Welcome to the Future</h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          The starting point for your next great project.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/auth/login">
            <a className="tech-button w-full sm:w-auto text-xl font-bold">
              <span className="relative z-10">Enter Grid</span>
            </a>
          </Link>
          <Link to="/auth/register">
            <a className="tech-button w-full sm:w-auto text-xl font-bold" style={{ background: 'linear-gradient(135deg, #FF6B35, #FF0080)' }}>
               <span className="relative z-10">Join Now</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
