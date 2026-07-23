import React, { useState } from 'react';
import { Upload, Database, CheckCircle2, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { uploadFile, loadDemoData } from '../services/api';

interface DataIngestionProps {
  onIngestSuccess: () => void;
}

export const DataIngestion: React.FC<DataIngestionProps> = ({ onIngestSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string; details?: any } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await uploadFile(file);
      setMessage({
        type: 'success',
        text: `Successfully parsed and loaded '${file.name}' into DuckDB table '${res.table_name}'!`,
        details: res
      });
      onIngestSuccess();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to parse and ingest file.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDemo = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await loadDemoData();
      setMessage({
        type: 'success',
        text: 'Successfully generated and loaded 1,000 Industrial Machines, 5,000 Maintenance Logs, and 3,000 Operator Schedules into DuckDB!',
        details: res
      });
      onIngestSuccess();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to generate demo dataset.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1-Click Demo Seed Card */}
      <div className="glass-panel-glow p-6 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/80 border border-cyan-500/30 rounded-full text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Instant Pre-packaged Testing</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Load 1,000 Industrial Machines Demo Dataset</h3>
          <p className="text-xs text-slate-400 max-w-lg">
            Instantly seed DuckDB with 1,000 synthetic industrial machines, 5,000+ maintenance logs, and operator shift schedules to test zero-hallucination natural language queries immediately.
          </p>
        </div>

        <button
          onClick={handleSeedDemo}
          disabled={loading}
          className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition flex items-center gap-2 shrink-0 justify-center"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
          ) : (
            <Database className="w-4 h-4 text-slate-950" />
          )}
          <span>Seed 1,000 Machine Dataset</span>
        </button>
      </div>

      {/* Drag and Drop File Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        }}
        className={`glass-panel p-10 rounded-2xl border-2 border-dashed text-center transition space-y-4 cursor-pointer ${
          isDragging ? 'border-cyan-400 bg-cyan-950/20' : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400">
          <Upload className="w-6 h-6" />
        </div>

        <div>
          <h4 className="text-sm font-bold text-white">Upload Custom Industrial Logs (CSV, JSON, Excel, PDF)</h4>
          <p className="text-xs text-slate-400 mt-1">
            Drag and drop your historical CSV, JSON, XLSX, or PDF file here, or browse from computer
          </p>
        </div>

        <label className="inline-block px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition">
          <span>Browse File</span>
          <input
            type="file"
            accept=".csv, .json, .xlsx, .xls, .txt, .pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
        </label>
      </div>

      {/* Ingestion Result Banner */}
      {message && (
        <div
          className={`p-5 rounded-2xl border text-xs space-y-2 ${
            message.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
            <span>{message.text}</span>
          </div>

          {message.details && (
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div>Rows Inserted: <span className="text-cyan-400 font-bold">{message.details.rows_inserted || message.details.machines_count}</span></div>
              {message.details.columns_detected && (
                <div>Columns Detected: {message.details.columns_detected.join(', ')}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
