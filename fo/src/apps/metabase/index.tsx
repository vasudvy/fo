import { BaseApp } from "../base/types";
import { AppProps } from "../base/types";
import { WindowFrame } from "@/components/layout/WindowFrame";

function MetabaseAppComponent({ isWindowOpen, onClose, isForeground }: AppProps) {
  return (
    <WindowFrame
      title="Metabase"
      isOpen={isWindowOpen}
      onClose={onClose}
      isForeground={isForeground}
    >
      <div className="flex flex-col h-full bg-white p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-semibold mb-2">Metabase Analytics</h2>
          <p className="text-gray-600 mb-4">Business intelligence and company operations terminal</p>
          <div className="text-sm text-gray-500">
            <p>• Business intelligence dashboards</p>
            <p>• Data visualization and reporting</p>
            <p>• SQL query builder</p>
            <p>• Company metrics tracking</p>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

export const MetabaseApp: BaseApp = {
  id: "metabase",
  name: "Metabase",
  icon: { type: "image", src: "/icons/metabase.png" },
  description: "Business intelligence and analytics platform",
  component: MetabaseAppComponent,
  helpItems: [],
  metadata: {
    name: "Metabase",
    version: "1.0",
    creator: { name: "Founder's Office", url: "https://fo.office" },
    github: "https://github.com/fo/office",
    icon: "/icons/metabase.png",
  },
};