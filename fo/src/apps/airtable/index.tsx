import { BaseApp } from "../base/types";
import { AppProps } from "../base/types";
import { WindowFrame } from "@/components/layout/WindowFrame";

function AirtableAppComponent({ isWindowOpen, onClose, isForeground }: AppProps) {
  return (
    <WindowFrame
      title="Airtable"
      isOpen={isWindowOpen}
      onClose={onClose}
      isForeground={isForeground}
    >
      <div className="flex flex-col h-full bg-white p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🗂️</div>
          <h2 className="text-xl font-semibold mb-2">Airtable Database</h2>
          <p className="text-gray-600 mb-4">Form creator and database management</p>
          <div className="text-sm text-gray-500">
            <p>• Custom database creation</p>
            <p>• Form builder and automation</p>
            <p>• Data visualization and views</p>
            <p>• Workflow automation</p>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

export const AirtableApp: BaseApp = {
  id: "airtable",
  name: "Airtable",
  icon: { type: "image", src: "/icons/airtable.png" },
  description: "Database and form creation platform",
  component: AirtableAppComponent,
  helpItems: [],
  metadata: {
    name: "Airtable",
    version: "1.0",
    creator: { name: "Founder's Office", url: "https://fo.office" },
    github: "https://github.com/fo/office",
    icon: "/icons/airtable.png",
  },
};