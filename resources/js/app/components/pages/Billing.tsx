import { useState, useEffect } from "react";
import { Receipt, FileText, Download, Plus, Search, Calendar, IndianRupee, User, X, Loader2, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import axios from "axios";
import { toast } from "sonner";

export function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Invoices");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    member_id: "",
    amount: "",
    status: "Pending",
    due_date: new Date().toISOString().split('T')[0],
  });
  const [currency, setCurrency] = useState("₹");

  useEffect(() => {
    fetchInvoices();
    fetchMembers();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get("/api/settings");
      if (response.data && response.data.currency) {
        // Extract symbol from "INR (₹)" or use as is
        const symbol = response.data.currency.match(/\((.*)\)/)?.[1] || "₹";
        setCurrency(symbol);
      }
    } catch (error) {}
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/invoices");
      setInvoices(response.data);
    } catch (error) {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get("/api/members");
      setMembers(response.data);
    } catch (error) {}
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      const response = await axios.post("/api/invoices", payload);
      setInvoices([response.data, ...invoices]);
      setShowAddModal(false);
      setFormData({ member_id: "", amount: "", status: "Pending", due_date: new Date().toISOString().split('T')[0] });
      toast.success("Invoice generated successfully");
    } catch (error) {
      toast.error("Failed to create invoice. Please check your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (invoice) => {
    const printWindow = window.open('', '_blank');
    const invoiceContent = `
      <html>
        <head>
          <title>Invoice ${invoice.invoice_number}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #334155; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 800; color: #4f46e5; }
            .invoice-info { text-align: right; }
            .details { margin-top: 40px; display: grid; grid-template-cols: 1fr 1fr; gap: 40px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 40px; }
            .table th { background: #f8fafc; text-align: left; padding: 12px; border-bottom: 2px solid #f1f5f9; }
            .table td { padding: 12px; border-bottom: 1px solid #f1f5f9; }
            .total { margin-top: 20px; text-align: right; font-size: 20px; font-weight: 800; color: #4f46e5; }
            .footer { margin-top: 100px; text-align: center; color: #94a3b8; font-size: 12px; }
            @media print { .print-btn { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Fitness Point</div>
            <div class="invoice-info">
              <h2 style="margin:0">INVOICE</h2>
              <p style="margin:4px 0; font-weight: bold;">${invoice.invoice_number}</p>
              <p style="color: #64748b;">Date: ${new Date(invoice.created_at).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
          <div class="details">
            <div>
              <p style="font-weight: bold; text-transform: uppercase; font-size: 12px; color: #94a3b8; margin-bottom: 8px;">Billed To</p>
              <p style="margin:0; font-size: 18px; font-weight: bold;">${invoice.member?.name}</p>
              <p style="margin:4px 0;">${invoice.member?.phone}</p>
              <p style="margin:4px 0;">${invoice.member?.email}</p>
            </div>
            <div style="text-align: right;">
              <p style="font-weight: bold; text-transform: uppercase; font-size: 12px; color: #94a3b8; margin-bottom: 8px;">Payment Status</p>
              <p style="margin:0; font-weight: bold; color: ${invoice.status === 'Paid' ? '#10b981' : '#f59e0b'}">${invoice.status.toUpperCase()}</p>
              <p style="margin:12px 0 4px; font-weight: bold; text-transform: uppercase; font-size: 12px; color: #94a3b8;">Due Date</p>
              <p style="margin:0;">${new Date(invoice.due_date).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gym Membership / Subscription Fee</td>
                <td style="text-align: right; font-weight: bold;">${currency}${parseFloat(invoice.amount).toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">Total: ${currency}${parseFloat(invoice.amount).toLocaleString('en-IN')}</div>
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>This is a computer generated invoice and does not require a signature.</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
  };

  const handleDeleteInvoice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await axios.delete(`/api/invoices/${id}`);
      setInvoices(invoices.filter(i => i.id !== id));
      toast.success("Invoice deleted");
    } catch (error) {
      toast.error("Failed to delete invoice");
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          invoice.member?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All Invoices" || invoice.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto no-scrollbar">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 text-left">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">Billing & Invoices</h1>
          <p className="mt-2 text-[15px] font-medium text-slate-500 max-w-lg leading-relaxed">Manage member subscriptions, generate invoices, and track payments.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-xl shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] text-[15px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:scale-95"
        >
          <Receipt className="-ml-1 mr-2.5 h-5 w-5 stroke-[2.5px]" />
          Create Invoice
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden flex-1 flex flex-col backdrop-blur-3xl transition-all">
        {/* Tabs and Search */}
        <div className="p-0 border-b border-slate-100 flex flex-col">
          <div className="flex px-6 bg-slate-50/50">
            {["All Invoices", "Paid", "Pending", "Overdue"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "px-6 py-4 text-[14px] font-bold border-b-2 transition-all relative",
                  activeTab === tab
                    ? "border-indigo-600 text-indigo-600 bg-white"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                )}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
              </button>
            ))}
          </div>

          <div className="p-6 sm:flex sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-lg group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-[18px] w-[18px] text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-3.5 border border-slate-200/80 rounded-xl leading-5 bg-white shadow-sm placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all"
                placeholder="Search by invoice number or member name..."
              />
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto no-scrollbar min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
              <span className="text-slate-400 font-bold tracking-widest uppercase text-xs">Fetching Records...</span>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
               <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-5 border border-slate-100">
                <FileText className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No invoices found</h3>
              <p className="mt-2 text-slate-500 max-w-xs mx-auto font-medium leading-relaxed">Try adjusting your filters or create a new invoice for a member.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-100 text-left min-w-[800px]">
              <thead className="bg-slate-50/50 backdrop-blur-sm sticky top-0 z-10 text-left">
                <tr>
                  <th scope="col" className="px-7 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-widest">Invoice</th>
                  <th scope="col" className="px-7 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-widest hidden sm:table-cell">Member</th>
                  <th scope="col" className="px-7 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                  <th scope="col" className="px-7 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th scope="col" className="px-7 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-widest hidden md:table-cell">Due Date</th>
                  <th scope="col" className="relative px-7 py-4 text-right pr-10 text-[12px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100/80 text-left">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-indigo-50/20 transition-all duration-150 group cursor-pointer animate-in fade-in duration-300">
                    <td className="px-7 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:scale-110 transition-transform">
                          <FileText className="h-5 w-5" />
                        </div>
                        <span className="ml-4 text-[14px] font-extrabold text-indigo-600 uppercase tracking-tight">
                          {invoice.invoice_number}
                        </span>
                      </div>
                    </td>
                    <td className="px-7 py-5 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-[14px] font-bold text-slate-900 uppercase">{invoice.member?.name || 'Unknown Member'}</div>
                    </td>
                    <td className="px-7 py-5 whitespace-nowrap">
                      <div className="text-[15px] font-extrabold text-slate-900 tracking-tight">{currency}{parseFloat(invoice.amount).toLocaleString('en-IN')}</div>
                    </td>
                    <td className="px-7 py-5 whitespace-nowrap">
                      <span className={clsx(
                        "px-3.5 py-1.5 inline-flex text-[11px] leading-5 font-bold rounded-xl border uppercase tracking-wider",
                        invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
                        invoice.status === 'Overdue' ? 'bg-rose-50 text-rose-700 border-rose-200/60' :
                        'bg-amber-50 text-amber-700 border-amber-200/60'
                      )}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-7 py-5 whitespace-nowrap text-[13px] font-bold text-slate-500 hidden md:table-cell">
                      <div className="flex items-center text-slate-600 uppercase">
                        <Calendar className="h-4 w-4 mr-2.5 text-indigo-400 stroke-[2.5px]" />
                        {new Date(invoice.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-7 py-5 whitespace-nowrap text-right pr-10 space-x-2">
                       <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteInvoice(invoice.id); }}
                        className="text-slate-400 hover:text-rose-600 transition-all p-2.5 rounded-xl hover:bg-rose-50 focus:outline-none active:scale-90"
                      >
                        <Trash2 className="h-[18px] w-[18px] stroke-[2px]" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDownload(invoice); }}
                        className="text-slate-400 hover:text-indigo-600 transition-all p-2.5 rounded-xl hover:bg-indigo-50 active:scale-90" title="Download PDF"
                      >
                        <Download className="h-[18px] w-[18px] stroke-[2px]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" 
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-200/50">
            <div className="p-8 pb-4 text-left">
               <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Generate Invoice</h2>
                  <p className="mt-1.5 text-[15px] font-medium text-slate-500 leading-relaxed">Link a member and set billing details.</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="h-12 w-12 flex items-center justify-center rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
                >
                  <X className="h-6 w-6 stroke-[2.5px]" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-8 pt-4 space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Member selection */}
                <div className="space-y-2 col-span-2">
                  <label className="text-[14px] font-bold text-slate-700 ml-1">Select Member</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <select
                      required
                      className="block w-full pl-11 pr-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/30 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all appearance-none cursor-pointer"
                      value={formData.member_id}
                      onChange={(e) => setFormData({...formData, member_id: e.target.value})}
                    >
                      <option value="">Choose a member...</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.phone})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-slate-700 ml-1">Billing Amount (₹)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <IndianRupee className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      required
                      type="number"
                      step="0.01"
                      className="block w-full pl-11 pr-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/30 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-slate-700 ml-1">Payment Status</label>
                  <select 
                    className="block w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/30 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all appearance-none cursor-pointer"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Overdue</option>
                  </select>
                </div>

                {/* Due Date */}
                <div className="space-y-2 col-span-2">
                  <label className="text-[14px] font-bold text-slate-700 ml-1">Due Date</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      required
                      type="date"
                      className="block w-full pl-11 pr-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/30 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all"
                      value={formData.due_date}
                      onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-5 py-4 text-[15px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] inline-flex items-center justify-center px-5 py-4 border border-transparent rounded-2xl shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] text-[15px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Plus className="h-5 w-5 mr-2 stroke-[2.5px]" />}
                  {isSubmitting ? "Generating..." : "Save Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
