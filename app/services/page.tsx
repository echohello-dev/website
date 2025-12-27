import { allPages } from "contentlayer/generated";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MDXContent } from "@/components/MDXContent";

export default function ServicesPage() {
  const page = allPages.find((p) => p.slug === "services");

  if (!page) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <MDXContent code={page.body.code} />
        </div>
      </main>
      <Footer />
    </>
  );
}
