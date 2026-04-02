import { Settings, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your workspace preferences</p>
      </div>

      <div className="max-w-2xl space-y-4">
        <SettingCard
          icon={Palette}
          title="Branding"
          description="Customize your form's look and feel with your brand colors and logo."
          tag="Coming Soon"
        />
        <SettingCard
          icon={Bell}
          title="Notifications"
          description="Get notified when a client submits an onboarding form."
          tag="Coming Soon"
        />
        <SettingCard
          icon={Shield}
          title="Security"
          description="Manage access controls, password protection for forms, and HIPAA compliance settings."
          tag="Coming Soon"
        />
      </div>
    </div>
  );
}

function SettingCard({ icon: Icon, title, description, tag }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-gray-500" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {tag && (
            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium uppercase tracking-wide">
              {tag}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
