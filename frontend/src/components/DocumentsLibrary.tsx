import React, { useEffect, useState } from 'react';
import { FileText, Trash2, RefreshCw, Upload, AlertCircle } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

interface DocInfo {
  filename: string;
  pages: number;
}

export const DocumentsLibrary: React.FC = () => {
  const [documents, setDocuments] = useState<DocInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/documents`);
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (e: any) {
      setError('Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Delete "${filename}" and all its pages?`)) return;
    setDeleting(filename);
    try {
      await fetch(`${API_BASE}/documents/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });
      await fetchDocuments();
    } catch (e: any) {
      setError(`Failed to delete: ${e.message}`);
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-cyan-400" />
            Documents Library
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            All uploaded PDFs are stored here. You can query across all documents simultaneously.
          </p>
        </div>
        <button
          onClick={fetchDocuments}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-slate-800/70 hover:bg-slate-700/70 text-slate-300 transition flex items-center gap-2 text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
          <Upload className="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-400 mb-2">No Documents Uploaded</h3>
          <p className="text-sm text-slate-500">
            Go to <span className="text-cyan-400 font-medium">Data Ingestion</span> tab to upload PDFs. 
            All PDFs will appear here and be searchable together.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.filename}
              className="glass-panel rounded-xl p-5 border border-slate-800 hover:border-cyan-500/30 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate" title={doc.filename}>
                      {doc.filename}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {doc.pages} pages
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc.filename)}
                  disabled={deleting === doc.filename}
                  title="Delete document"
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100"
                >
                  {deleting === doc.filename ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {documents.length > 0 && (
        <div className="text-sm text-slate-500 text-center">
          {documents.length} document{documents.length > 1 ? 's' : ''} • {documents.reduce((sum, d) => sum + d.pages, 0)} total pages indexed
        </div>
      )}
    </div>
  );
};
