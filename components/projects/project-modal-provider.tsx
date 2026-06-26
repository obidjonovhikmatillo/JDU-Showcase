"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ProjectModal } from "@/components/projects/project-modal";

type ProjectModalContextType = {
  openModal: (slug: string) => void;
  closeModal: () => void;
};

const ProjectModalContext = createContext<ProjectModalContextType>({
  openModal: () => {},
  closeModal: () => {},
});

export function useProjectModal() {
  return useContext(ProjectModalContext);
}

export function ProjectModalProvider({ children }: { children: React.ReactNode }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const openModal = useCallback((slug: string) => {
    setActiveSlug(slug);
  }, []);

  const closeModal = useCallback(() => {
    setActiveSlug(null);
  }, []);

  // Listen for custom event from "More by author" section
  useEffect(() => {
    function handleCustomEvent(e: Event) {
      const customEvent = e as CustomEvent<{ slug: string }>;
      if (customEvent.detail?.slug) {
        setActiveSlug(customEvent.detail.slug);
      }
    }

    window.addEventListener("open-project-modal", handleCustomEvent);
    return () => window.removeEventListener("open-project-modal", handleCustomEvent);
  }, []);

  return (
    <ProjectModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ProjectModal slug={activeSlug} onClose={closeModal} />
    </ProjectModalContext.Provider>
  );
}
