import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TerminalWindow from "@/components/TerminalWindow";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/data";

export default function Home() {
  const featuredProjects = projects.slice(0, 6);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section with Terminal */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <TerminalWindow />

          <div className="max-w-3xl mx-auto mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay">
            <Link
              href="/projects/"
              className="px-6 py-3 bg-accent text-bg text-sm font-semibold rounded-lg hover:bg-accent/90 transition-colors shadow-lg"
            >
              view projects →
            </Link>
            <a
              href="https://github.com/echohello-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-sm border border-border rounded-lg text-text hover:border-accent hover:text-accent transition-colors"
            >
              [GITHUB]
            </a>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-sm font-semibold text-text mb-8 flex items-center gap-2">
              <span className="text-accent">&gt;</span>
              featured_projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
