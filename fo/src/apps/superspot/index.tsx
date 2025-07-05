import { BaseApp } from "../base/types";
import { AppProps } from "../base/types";
import { WindowFrame } from "@/components/layout/WindowFrame";

function SuperSpotAppComponent({ isWindowOpen, onClose, isForeground }: AppProps) {
  return (
    <WindowFrame
      title="SuperSpot"
      isOpen={isWindowOpen}
      onClose={onClose}
      isForeground={isForeground}
    >
      <div className="flex flex-col h-full bg-white p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-xl font-semibold mb-2">SuperSpot Integration Hub</h2>
          <p className="text-gray-600 mb-4">Track and monitor company-wide third-party integrations</p>
          <div className="text-sm text-gray-500">
            <p>• Integration status monitoring</p>
            <p>• API health checking</p>
            <p>• Performance metrics tracking</p>
            <p>• Alert management</p>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

export const SuperSpotApp: BaseApp = {
  id: "superspot",
  name: "SuperSpot",
  icon: { type: "image", src: "/icons/superspot.png" },
  description: "Third-party integration monitoring platform",
  component: SuperSpotAppComponent,
  helpItems: [],
  metadata: {
    name: "SuperSpot",
    version: "1.0",
    creator: { name: "Founder's Office", url: "https://fo.office" },
    github: "https://github.com/fo/office",
    icon: "/icons/superspot.png",
  },
};