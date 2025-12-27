import { allPages } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { useMDXComponent } from "next-contentlayer2/hooks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OSSPage() {
  const page = allPages.find((p) => p.slug === "oss");

  if (!page) {
    notFound();
  }

  const MDXContent = useMDXComponent(page.body.code);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <MDXContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
