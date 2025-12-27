import Link from "next/link";
import { allProjects } from "contentlayer/generated";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const projects = allProjects.sort((a, b) => (a.order || 999) - (b.order || 999));

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange/5 to-white">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-charcoal mb-6">
              <span className="text-orange">echo</span>Hello
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Building innovative web solutions with modern technologies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://discord.gg/echohello"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-orange text-white font-semibold rounded-[2rem] hover:bg-orange/90 transition-colors shadow-lg hover:shadow-xl"
              >
                Work with us
              </a>
              <a
                href="https://github.com/echohello-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-charcoal text-white font-semibold rounded-[2rem] hover:bg-charcoal/90 transition-colors shadow-lg hover:shadow-xl"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </section>

        {/* What I Do Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-charcoal mb-12 text-center">
              What I do
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-white border-2 border-orange/20 rounded-[2rem] hover:border-orange/40 transition-colors">
                <div className="w-12 h-12 bg-orange/10 rounded-[1rem] flex items-center justify-center mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-2xl font-semibold text-charcoal mb-4">
                  Modern Web Apps
                </h3>
                <p className="text-gray-600">
                  Building fast, responsive web applications with Next.js, React, and TypeScript.
                </p>
              </div>
              <div className="p-8 bg-white border-2 border-orange/20 rounded-[2rem] hover:border-orange/40 transition-colors">
                <div className="w-12 h-12 bg-orange/10 rounded-[1rem] flex items-center justify-center mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-2xl font-semibold text-charcoal mb-4">
                  Technical Consulting
                </h3>
                <p className="text-gray-600">
                  Expert guidance on architecture, best practices, and technology selection.
                </p>
              </div>
              <div className="p-8 bg-white border-2 border-orange/20 rounded-[2rem] hover:border-orange/40 transition-colors">
                <div className="w-12 h-12 bg-orange/10 rounded-[1rem] flex items-center justify-center mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-2xl font-semibold text-charcoal mb-4">
                  Design Systems
                </h3>
                <p className="text-gray-600">
                  Creating cohesive design systems with Tailwind CSS and component libraries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* OSS/Sponsor Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-orange/5">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-charcoal mb-6">
              Open Source
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We believe in giving back to the community. Check out our open source projects and consider sponsoring our work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/oss/"
                className="px-8 py-4 bg-white border-2 border-orange text-orange font-semibold rounded-[2rem] hover:bg-orange hover:text-white transition-colors"
              >
                View OSS Projects
              </Link>
              <a
                href="https://github.com/sponsors/echohello-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-orange text-white font-semibold rounded-[2rem] hover:bg-orange/90 transition-colors"
              >
                Sponsor Us
              </a>
            </div>
          </div>
        </section>

        {/* Projects List Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-charcoal mb-12 text-center">
              Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="p-8 bg-white border-2 border-gray-200 rounded-[2rem] hover:border-orange transition-colors"
                >
                  <h3 className="text-2xl font-semibold text-charcoal mb-4">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{project.description}</p>
                  <div className="flex gap-4">
                    {project.websiteUrl && (
                      <a
                        href={project.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange hover:text-orange/80 font-medium"
                      >
                        Visit Website →
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-charcoal hover:text-orange font-medium"
                      >
                        View on GitHub →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/projects/"
                className="px-8 py-4 bg-charcoal text-white font-semibold rounded-[2rem] hover:bg-charcoal/90 transition-colors inline-block"
              >
                View All Projects
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-orange/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-charcoal mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our community on Discord or follow us on GitHub to stay updated with our latest projects and contributions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://discord.gg/echohello"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-orange text-white font-semibold rounded-[2rem] hover:bg-orange/90 transition-colors shadow-lg hover:shadow-xl"
              >
                Work with us
              </a>
              <a
                href="https://github.com/echohello-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-charcoal text-white font-semibold rounded-[2rem] hover:bg-charcoal/90 transition-colors shadow-lg hover:shadow-xl"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
