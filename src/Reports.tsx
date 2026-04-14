import React, { useState, useEffect } from 'react';
import AppLayout from './components/AppLayout';
import ReportBuilderModal from './components/ReportBuilderModal';
import { 
  FileText, Download, Trash2, Clock, CheckCircle, 
  Loader2, Calendar, FileJson, FileImage, MoreHorizontal
} from 'lucide-react';

interface Report {
  _id: string;
  name: string;
  sourceModule: string;
  format: string;
  status: string;
  fileSizeBytes?: number;
  createdAt: string;
}

const getFormatIcon = (format: string) => {
  switch (format.toUpperCase()) {
    case 'PDF': return <FileText className="w-5 h-5 text-primary-container" />;
    case 'CSV': return <FileJson className="w-5 h-5 text-tertiary" />;
    case 'PNG': return <FileImage className="w-5 h-5 text-secondary" />;
    default: return <FileText className="w-5 h-5 text-on-surface-variant" />;
  }
};

const formatSize = (bytes?: number) => {
  if (!bytes) return '--';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateTime = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('streamiq_token');
      const res = await fetch('http://localhost:5000/api/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDownload = async (report: Report) => {
    try {
      const token = localStorage.getItem('streamiq_token');
      const res = await fetch(`http://localhost:5000/api/reports/${report._id}/download`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeName = report.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `${safeName}.${report.format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Download failed');
      }
    } catch (err) {
      console.error('Download error', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      const token = localStorage.getItem('streamiq_token');
      const res = await fetch(`http://localhost:5000/api/reports/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchReports();
      } else {
        console.error('Delete failed');
      }
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const savedReports = reports.slice(0, 4); // Display latest 4 as cards
  const exportHistory = reports;

  return (
    <AppLayout breadcrumbs={['Reports']}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold font-headline text-on-surface tracking-tight">Reports Center</h2>
          <p className="text-on-surface-variant mt-1">Manage saved reports, scheduled exports, and history.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-container hover:bg-[#c0000c] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all shadow-lg shadow-primary-container/20">
          Create New Report
        </button>
      </div>

      <div className="space-y-10">
        {/* Saved Reports Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-headline font-bold text-on-surface">Saved Reports</h3>
            <button className="text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant hover:text-on-surface transition-colors">
              View All
            </button>
          </div>
          
          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary-container" /></div>
          ) : savedReports.length === 0 ? (
             <p className="text-sm text-on-surface-variant">No reports found. Generate one!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {savedReports.map((report) => (
                <div key={report._id} className="bg-surface-container-high rounded-xl p-6 flex flex-col group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${report.format.toUpperCase() === 'PDF' ? 'bg-primary-container/10' : 'bg-tertiary/10'}`}>
                      {getFormatIcon(report.format)}
                    </div>
                    <button onClick={() => handleDelete(report._id)} className="text-[#ffb4ab] hover:text-[#ffdad6] opacity-0 group-hover:opacity-100 transition-opacity" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <h4 className="font-headline font-bold text-on-surface mb-1 truncate" title={report.name}>{report.name}</h4>
                  <p className="text-xs text-on-surface-variant mb-6">{report.sourceModule}</p>
                  
                  <div className="mt-auto pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(report.createdAt)}
                    </div>
                    
                    {report.status.toLowerCase() === 'ready' ? (
                      <button onClick={() => handleDownload(report)} className="text-tertiary hover:text-tertiary-fixed transition-colors" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-primary-container text-xs font-bold">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Generating
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Export History Table */}
        <section className="bg-surface-container-high rounded-xl overflow-hidden">
          <div className="p-6 flex justify-between items-center border-b border-outline-variant/10">
            <div>
              <h3 className="text-lg font-headline font-bold text-on-surface">Export History</h3>
              <p className="text-sm text-on-surface-variant">Log of all downloaded files and reports.</p>
            </div>
            <button className="text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last 30 Days
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">File Name</th>
                  <th className="px-6 py-4 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Date & Time</th>
                  <th className="px-6 py-4 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Type</th>
                  <th className="px-6 py-4 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant text-center">Format</th>
                  <th className="px-6 py-4 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant">Size</th>
                  <th className="px-6 py-4 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant text-center">Download</th>
                  <th className="px-6 py-4 text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {exportHistory.map((item, i) => (
                  <tr key={item._id} className={i % 2 === 0 ? 'bg-surface-container-low/50' : 'bg-transparent'}>
                    <td className="px-6 py-4 font-medium text-on-surface flex items-center gap-3">
                      {getFormatIcon(item.format)}
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{formatDateTime(item.createdAt)}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{item.sourceModule}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-surface-container-low text-on-surface-variant border border-outline-variant/20 text-[0.6rem] font-bold px-2 py-1 rounded inline-block">
                        {item.format.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{formatSize(item.fileSizeBytes)}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleDownload(item)} className="text-on-surface-variant hover:text-on-surface transition-colors mx-auto block" title="Download Again">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleDelete(item._id)} className="text-on-surface-variant hover:text-[#ffb4ab] transition-colors mx-auto block" title="Delete Report">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {exportHistory.length === 0 && !loading && (
                   <tr><td colSpan={7} className="px-6 py-8 text-center text-on-surface-variant text-sm">No export history found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <ReportBuilderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchReports}
      />
    </AppLayout>
  );
}
