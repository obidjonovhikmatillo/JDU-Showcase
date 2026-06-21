import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1280px] flex-1 overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
