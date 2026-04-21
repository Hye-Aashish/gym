import { useState, useEffect } from "react";
import { Plus, Search, Wallet, TrendingDown, Calendar, MoreVertical, X, Loader2, Trash2, FileText, Info } from "lucide-react";
import { clsx } from "clsx";
import axios from "axios";
import { toast } from "sonner";

export function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ monthly_total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Utilities",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/expenses");
      setExpenses(response.data);
    } catch (error) {
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get("/api/expenses/summary");
      setSummary(response.data);
    } catch (error) {}
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/expenses", {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setExpenses([response.data, ...expenses]);
      setShowAddModal(false);
      setFormData({ title: "", amount: "", category: "Utilities", date: new Date().toISOString().split('T')[0], notes: "" });
      fetchSummary();
      toast.success("Expense recorded successfully");
    } catch (error) {
      toast.error("Failed to add expense. Please check your input.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`/api/expenses/${id}`);
      setExpenses(expenses.filter(e => e.id !== id));
      fetchSummary();
      toast.success("Expense deleted successfully");
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All Categories" || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto no-scrollbar relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 text-left">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">Expenses</h1>
          <p className="mt-2 text-[15px] font-medium text-slate-500 max-w-lg leading-relaxed">Track and categorize your gym operating costs and utilities.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-xl shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] text-[15px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:scale-95"
        >
          <Plus className="-ml-1 mr-2.5 h-5 w-5 stroke-[2.5px]" />
          Record Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-8 transition-all hover:shadow-xl group">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-rose-50 p-4 rounded-2xl border border-rose-100 group-hover:scale-110 transition-transform">
              <TrendingDown className="h-7 w-7 text-rose-600" />
            </div>
            <div className="ml-6 flex-1 text-left">
              <p className="text-[14px] font-bold text-slate-400 uppercase tracking-widest">Monthly Spending</p>
              <div className="mt-1 flex items-baseline">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">₹{summary.monthly_total.toLocaleString('en-IN')}</span>
                <span className="ml-2 text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">APRIL '24</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden flex flex-col backdrop-blur-3xl transition-all">
        {/* Filters and Search */}
        <div className="p-6 border-b border-slate-100 sm:flex sm:items-center sm:justify-between gap-4 bg-slate-50/30">
          <div className="relative flex-1 max-w-lg group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-[18px] w-[18px] text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-3.5 border border-slate-200/80 rounded-xl leading-5 bg-white shadow-sm placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all"
              placeholder="Search by title or category..."
            />
          </div>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="mt-4 sm:mt-0 w-full sm:w-auto block border border-slate-200/80 rounded-xl py-3.5 pl-4 pr-10 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-[15px] font-medium bg-white text-slate-700 shadow-sm transition-all appearance-none cursor-pointer"
          >
            <option>All Categories</option>
            <option>Utilities</option>
            <option>Equipment</option>
            <option>Maintenance</option>
            <option>Salary</option>
            <option>Marketing</option>
            <option>Rent</option>
          </select>
        </div>

        {/* Expenses Table */}
        <div className="overflow-x-auto no-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
              <span className="text-slate-400 font-bold tracking-widest uppercase text-xs">Syncing Ledger...</span>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
               <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-5 border border-slate-100">
                <Wallet className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No records found</h3>
              <p className="mt-2 text-slate-500 max-w-xs mx-auto font-medium leading-relaxed">It looks like there are no expenses matching your criteria.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50 backdrop-blur-sm sticky top-0 z-10 text-left">
                <tr>
                  <th scope="col" className="px-7 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-widest">Expense Title</th>
                  <th scope="col" className="px-7 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-widest hidden sm:table-cell">Category</th>
                  <th scope="col" className="px-7 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                  <th scope="col" className="px-7 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-widest hidden md:table-cell">Date</th>
                  <th scope="col" className="relative px-7 py-4 text-right pr-10 text-[12px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100/80 text-left">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-indigo-50/20 transition-all duration-150 group cursor-pointer animate-in fade-in duration-300">
                    <td className="px-7 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner border border-white group-hover:scale-110 transition-transform duration-200">
                          <Wallet className="h-5 w-5 stroke-[2px]" />
                        </div>
                        <div className="ml-5">
                          <div className="text-[15px] font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{expense.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-7 py-5 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-[13px] font-bold text-slate-700 bg-slate-100/50 inline-flex px-3.5 py-1.5 rounded-xl border border-slate-200/50 uppercase tracking-tight">{expense.category}</div>
                    </td>
                    <td className="px-7 py-5 whitespace-nowrap">
                      <div className="text-[15px] font-extrabold text-rose-600 tracking-tight">₹{parseFloat(expense.amount).toLocaleString()}</div>
                    </td>
                    <td className="px-7 py-5 whitespace-nowrap text-[13px] font-bold text-slate-500 hidden md:table-cell">
                      <div className="flex items-center text-slate-600">
                        <Calendar className="h-4 w-4 mr-2.5 text-indigo-400 stroke-[2.5px]" />
                        {new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-7 py-5 whitespace-nowrap text-right pr-6 space-x-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteExpense(expense.id); }}
                        className="text-slate-400 hover:text-rose-600 transition-all p-2.5 rounded-xl hover:bg-rose-50 focus:outline-none active:scale-90"
                      >
                        <Trash2 className="h-[20px] w-[20px] stroke-[2px]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
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
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Record Expense</h2>
                  <p className="mt-1.5 text-[15px] font-medium text-slate-500 leading-relaxed">Enter details for your operating cost or payment.</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="h-12 w-12 flex items-center justify-center rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
                >
                  <X className="h-6 w-6 stroke-[2.5px]" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddExpense} className="p-8 pt-4 space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-2 col-span-2">
                  <label className="text-[14px] font-bold text-slate-700 ml-1">Expense Title</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      required
                      type="text"
                      className="block w-full pl-11 pr-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/30 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all"
                      placeholder="e.g. Electricity Bill April"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-slate-700 ml-1">Amount (₹)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Wallet className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
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

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-slate-700 ml-1">Category</label>
                  <select 
                    className="block w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/30 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all appearance-none cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Utilities</option>
                    <option>Equipment</option>
                    <option>Maintenance</option>
                    <option>Salary</option>
                    <option>Marketing</option>
                    <option>Rent</option>
                    <option>Supplies</option>
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-slate-700 ml-1">Expense Date</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      required
                      type="date"
                      className="block w-full pl-11 pr-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/30 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-700 ml-1">Notes (Optional)</label>
                <div className="relative group">
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <Info className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <textarea
                    rows={2}
                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/30 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-medium transition-all no-scrollbar"
                    placeholder="Reference number, bill ID, etc."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
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
                  {isSubmitting ? "Processing..." : "Record Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
