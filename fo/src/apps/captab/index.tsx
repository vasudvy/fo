import { BaseApp } from "../base/types";
import { AppProps } from "../base/types";
import { WindowFrame } from "@/components/layout/WindowFrame";

function CapTabAppComponent({ isWindowOpen, onClose, isForeground }: AppProps) {
  return (
    <WindowFrame
      title="CapTab"
      isOpen={isWindowOpen}
      onClose={onClose}
      isForeground={isForeground}
    >
      <div className="flex flex-col h-full bg-white p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">💼</div>
          <h2 className="text-xl font-semibold mb-2">CapTab Management</h2>
          <p className="text-gray-600 mb-4">Cap table, equity and performance metrics terminal</p>
          <div className="text-sm text-gray-500">
            <p>• Cap table management</p>
            <p>• Equity tracking and vesting</p>
            <p>• Investment round management</p>
            <p>• Performance metrics dashboard</p>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

export const CapTabApp: BaseApp = {
  id: "captab",
  name: "CapTab",
  icon: { type: "image", src: "/icons/captab.png" },
  description: "Cap table and equity management platform",
  component: CapTabAppComponent,
  helpItems: [],
  metadata: {
    name: "CapTab",
    version: "1.0",
    creator: { name: "Founder's Office", url: "https://fo.office" },
    github: "https://github.com/fo/office",
    icon: "/icons/captab.png",
  },
};