import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sun, Cpu, MapPin, Maximize2, X, Calendar, Layers, Check } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectGalleryProps {
  projects: ProjectItem[];
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ projects }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'cctv' | 'solar' | 'hydraulics'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Keyboard escape listener for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cctv':
        return <Shield className="w-3.5 h-3.5" />;
      case 'solar':
        return <Sun className="w-3.5 h-3.5" />;
      case 'hydraulics':
        return <Cpu className="w-3.5 h-3.5" />;
      default:
        return <Layers className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'cctv':
        return 'CCTV Security';
      case 'solar':
        return 'Solar Power';
      case 'hydraulics':
        return 'Hydraulics';
      default:
        return category;
    }
  };

  return (
    <section id="projects" className="py-24 bg-brand-navy/40 relative overflow-hidden border-t border-b border-white/5">
      <div className="absolute inset-0 tech-grid-bg opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-orange/10 border border-brand-orange/30 text-brand-orange font-mono text-xs uppercase tracking-widest">
              <Layers className="w-3.5 h-3.5" />
              Engineering Portfolio
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
              PROVEN FIELD <br />
              <span className="orange-gradient-text">INSTALLATIONS.</span>
            </h2>
            <p className="text-brand-gray-300 text-base">
              Explore our representative work across commercial CCTV architectures, high-efficiency solar arrays, and precision industrial hydraulics.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-brand-midnight/90 border border-white/10 backdrop-blur-md self-start md:self-auto">
            {(['all', 'cctv', 'solar', 'hydraulics'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold capitalize transition-all cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30'
                    : 'text-brand-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {filter === 'all' ? 'All Projects' : filter === 'cctv' ? 'CCTV' : filter === 'solar' ? 'Solar' : 'Hydraulics'}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
                className="group relative rounded-2xl overflow-hidden bg-brand-midnight/80 border border-white/10 hover:border-brand-orange/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                {/* Image Container with Hover Zoom */}
                <div className="relative h-60 overflow-hidden cursor-pointer" onClick={() => setSelectedProject(project)}>
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight via-brand-midnight/20 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-midnight/90 border border-white/15 backdrop-blur-md text-xs font-medium text-brand-orange flex items-center gap-1.5">
                    {getCategoryIcon(project.category)}
                    <span>{getCategoryLabel(project.category)}</span>
                  </div>

                  {/* Fullscreen Trigger */}
                  <div className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 border border-white/10 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  {/* Location Tag */}
                  {project.location && (
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 border border-white/10 backdrop-blur-md text-[11px] font-mono text-brand-gray-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-orange" />
                      <span>{project.location}</span>
                    </div>
                  )}
                </div>

                {/* Details Body */}
                <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-orange transition-colors line-clamp-2 font-heading">
                      {project.title}
                    </h3>
                    <p className="text-xs text-brand-gray-300 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-brand-gray-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                      {project.completion_date || 'Engineered Field Installation'}
                    </span>
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="font-semibold text-brand-orange hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Specs</span>
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Portfolio Disclaimer */}
        <div className="mt-8 text-center text-xs text-brand-gray-400 font-mono">
          * Representative visual gallery of engineering scopes and field installations managed by ARAN Integrated Technologies.
        </div>

      </div>

      {/* Full-screen Lightbox & Spec Inspection Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-brand-navy border border-white/20 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* High-res image */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-black">
              <img
                src={selectedProject.image_url}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-brand-orange text-white text-xs font-bold uppercase tracking-wider">
                  {selectedProject.category.toUpperCase()} DIVISION
                </span>
                {selectedProject.location && (
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-mono text-white flex items-center gap-1.5 border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                    {selectedProject.location}
                  </span>
                )}
              </div>
            </div>

            {/* Content & Specs */}
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <h3 className="text-2xl font-bold text-white font-heading">{selectedProject.title}</h3>
                <p className="text-sm text-brand-gray-300 mt-2 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Technical Specs Array */}
              {selectedProject.technical_specs && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-mono uppercase text-brand-orange tracking-widest font-semibold">
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.entries(
                      typeof selectedProject.technical_specs === 'string'
                        ? JSON.parse(selectedProject.technical_specs)
                        : selectedProject.technical_specs
                    ).map(([k, v], idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                        <span className="text-brand-gray-400 capitalize">{k.replace('_', ' ')}:</span>
                        <span className="font-semibold text-white">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-brand-gray-400 font-mono">
                  Client Type: <strong className="text-white">{selectedProject.client_type || 'Industrial & Commercial'}</strong>
                </span>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
