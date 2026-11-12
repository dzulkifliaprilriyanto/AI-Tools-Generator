import React from 'react';
import { ProjectState } from '../types';
import { X, Trash2, ArrowRight, FolderArchive, Calendar, FileText } from 'lucide-react';

interface ProjectHistoryModalProps {
  isOpen: boolean;
  projects: ProjectState[];
  activeProjectId: string;
  onClose: () => void;
  onSelectProject: (project: ProjectState) => void;
  onDeleteProject: (projectId: string) => void;
}

export const ProjectHistoryModal: React.FC<ProjectHistoryModalProps> = ({
  isOpen,
  projects,
  activeProjectId,
  onClose,
  onSelectProject,
  onDeleteProject,
}) => {
  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <FolderArchive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Riwayat Proyek Tersimpan</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tersimpan otomatis di peramban lokal Anda ({projects.length} proyek)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {projects.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Belum ada proyek tersimpan</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                Mulai dengan menuliskan ide baru pada beranda.
              </p>
            </div>
          ) : (
            projects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              return (
                <div
                  key={proj.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'border-emerald-500/60 bg-emerald-50/70 dark:bg-emerald-950/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 truncate">
                          {proj.category || 'Tool AI'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 font-mono text-slate-500 tabular-nums">
                          <Calendar className="h-3 w-3" />
                          {formatDate(proj.updatedAt)}
                        </span>
                        {isActive && (
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded">
                            Sedang Dibuka
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mb-1">
                        {proj.projectName || 'AI Tool Tanpa Nama'}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                        {proj.originalIdea || 'Tidak ada ringkasan ide'}
                      </p>

                      <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Langkah: <strong className="text-slate-700 dark:text-slate-300">{proj.currentStep}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>{proj.answers.length} Jawaban</span>
                        {proj.generatedPrompt && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Prompt Siap</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProject(proj);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 transition-colors cursor-pointer"
                      >
                        <span>Buka</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteProject(proj.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Hapus proyek ini"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
