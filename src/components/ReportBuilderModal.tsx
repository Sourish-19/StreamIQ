import React, { useState, useRef, useEffect } from 'react';
import { X, FileText, FileJson, Check, Loader2, ChevronDown } from 'lucide-react';

function CustomSelect({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: {label: string, value: string}[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-sm cursor-pointer transition-all flex items-center justify-between ${isOpen ? 'ring-1 ring-tertiary border-tertiary' : 'hover:border-outline-variant/50'}`}
      >
        <span className="text-on-surface">{currentLabel}</span>
        <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-high border border-outline-variant/20 rounded-lg shadow-xl overflow-hidden z-20">
          {options.map((opt) => (
            <div 
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-4 py-3 cursor-pointer transition-colors text-sm ${value === opt.value ? 'bg-tertiary/10 text-tertiary font-bold' : 'text-on-surface hover:bg-surface-container-highest hover:text-tertiary'}`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ReportBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReportBuilderModal({ isOpen, onClose, onSuccess }: ReportBuilderModalProps) {
  const [name, setName] = useState('Custom Analysis');
  const [sourceModule, setSourceModule] = useState('Top 100 Action Movies');
  const [dateRange, setDateRange] = useState('All Time');
  const [format, setFormat] = useState('csv');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('streamiq_token');
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name || 'Custom Analysis',
          sourceModule,
          format,
          parametersJson: { dateRange }
        })
      });
      if (res.ok) {
        onSuccess();
        onClose();
        // Reset form for next time
        setName('Custom Analysis');
      } else {
        console.error('Failed to generate report');
      }
    } catch (err) {
      console.error('API Error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-[#0e0e0e]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <form 
        onSubmit={handleSubmit}
        className="relative bg-surface-container border border-outline-variant/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
          <h3 className="text-xl font-headline font-bold text-on-surface">Configure Custom Report</h3>
          <button 
            type="button" 
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors rounded-full p-1 hover:bg-surface-container-high"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Report Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder="e.g. Q3 Sales Analysis"
              required
            />
          </div>

          {/* Module Field */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Data Module</label>
            <CustomSelect 
              value={sourceModule}
              onChange={setSourceModule}
              options={[
                { label: "Top 100 Action Movies", value: "Top 100 Action Movies" },
                { label: "Genre Distribution", value: "Genre Distribution" },
                { label: "Global Growth", value: "Global Growth" },
                { label: "Custom Query", value: "Custom Query" }
              ]}
            />
          </div>

          {/* Date Range Field */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Date Range</label>
            <CustomSelect 
              value={dateRange}
              onChange={setDateRange}
              options={[
                { label: "All Time", value: "All Time" },
                { label: "2022-2026 (Modern)", value: "2022-2026" },
                { label: "2026 Only", value: "2026 Only" },
                { label: "Last 30 Days", value: "Last 30 Days" }
              ]}
            />
          </div>

          {/* Format Radio Buttons */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Export Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  format === 'csv' 
                    ? 'bg-tertiary/10 border-tertiary text-on-surface' 
                    : 'border-outline-variant/30 text-on-surface-variant hover:border-outline-variant hover:bg-surface-container-high'
                }`}
              >
                <div className={`p-2 rounded-lg ${format === 'csv' ? 'bg-tertiary/20' : 'bg-surface-container-low'}`}>
                  <FileJson className={`w-4 h-4 ${format === 'csv' ? 'text-tertiary' : 'text-on-surface-variant'}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold">CSV Data</p>
                  <p className="text-[0.65rem] opacity-70">Raw spreadsheet</p>
                </div>
                {format === 'csv' && <Check className="w-4 h-4 text-tertiary" />}
              </button>

              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  format === 'pdf' 
                    ? 'bg-primary-container/10 border-primary-container text-on-surface' 
                    : 'border-outline-variant/30 text-on-surface-variant hover:border-outline-variant hover:bg-surface-container-high'
                }`}
              >
                <div className={`p-2 rounded-lg ${format === 'pdf' ? 'bg-primary-container/20' : 'bg-surface-container-low'}`}>
                  <FileText className={`w-4 h-4 ${format === 'pdf' ? 'text-primary-container' : 'text-on-surface-variant'}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold">PDF Report</p>
                  <p className="text-[0.65rem] opacity-70">Visual document</p>
                </div>
                {format === 'pdf' && <Check className="w-4 h-4 text-primary-container" />}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-outline-variant/10 flex items-center justify-end gap-3 bg-surface-container-low/50">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary-container hover:bg-[#c0000c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all shadow-lg shadow-primary-container/20"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isSubmitting ? 'Generating...' : 'Generate Database Report'}
          </button>
        </div>
      </form>
    </div>
  );
}
