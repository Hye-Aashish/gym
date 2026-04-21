import { Building, CreditCard, Users, Bell, Shield, Paintbrush } from "lucide-react";
import { clsx } from "clsx";

const SETTINGS_SECTIONS = [
  { id: "general", name: "General Settings", icon: Building, description: "Gym details, location, and business hours" },
  { id: "billing", name: "Payment & Billing", icon: CreditCard, description: "Payment gateways, tax rates, and currency" },
  { id: "plans", name: "Membership Plans", icon: Users, description: "Create and manage subscription tiers" },
  { id: "notifications", name: "Notifications", icon: Bell, description: "Email and SMS templates" },
  { id: "security", name: "Security & Access", icon: Shield, description: "Staff roles and permissions" },
  { id: "appearance", name: "Appearance", icon: Paintbrush, description: "Brand colors, logos, and themes" },
];

export function Settings() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage your gym system configurations.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200/60 overflow-hidden flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
          <div className="p-4 md:p-6 space-y-4 md:col-span-1">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Configuration</h2>
            <nav className="space-y-1">
              {SETTINGS_SECTIONS.map((section, idx) => (
                <button
                  key={section.id}
                  className={clsx(
                    "w-full flex items-start px-3 py-3 text-left rounded-lg transition-colors group",
                    idx === 0 ? "bg-indigo-50" : "hover:bg-neutral-50"
                  )}
                >
                  <section.icon className={clsx(
                    "flex-shrink-0 mt-0.5 h-6 w-6",
                    idx === 0 ? "text-indigo-600" : "text-neutral-400 group-hover:text-neutral-500"
                  )} />
                  <div className="ml-3">
                    <p className={clsx(
                      "text-sm font-medium",
                      idx === 0 ? "text-indigo-900" : "text-neutral-900"
                    )}>
                      {section.name}
                    </p>
                    <p className={clsx(
                      "text-xs mt-1",
                      idx === 0 ? "text-indigo-700" : "text-neutral-500"
                    )}>
                      {section.description}
                    </p>
                  </div>
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-4 md:p-6 md:col-span-1 bg-neutral-50/30">
            <div className="space-y-6 max-w-md">
              <h2 className="text-lg font-medium text-neutral-900">General Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Gym Name</label>
                  <input
                    type="text"
                    defaultValue="Fitness Point Fitness Center"
                    className="mt-1 block w-full border-neutral-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Support Email</label>
                  <input
                    type="email"
                    defaultValue="support@Fitness Point.com"
                    className="mt-1 block w-full border-neutral-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">Currency</label>
                  <select className="mt-1 block w-full border-neutral-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border bg-white">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>INR (₹)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center">
                    <div className="flex items-center h-5">
                      <input
                        id="maintenance"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-neutral-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="maintenance" className="font-medium text-neutral-700">Maintenance Mode</label>
                      <p className="text-neutral-500 text-xs">Temporarily disable member access</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
