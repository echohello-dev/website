import { allPages, allProjects } from "contentlayer/generated";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MDXContent } from "@/components/MDXContent";

export default function ProjectsPage() {
  const page = allPages.find((p) => p.slug === "projects");

  if (!page) {
    notFound();
  }

  const projects = allProjects.sort((a, b) => (a.order || 999) - (b.order || 999));

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg mb-12">
            <MDXContent code={page.body.code} />
          </div>
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
        </div>
      </main>
      <Footer />
    </>
  );
}
