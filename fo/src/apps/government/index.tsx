import { BaseApp } from "../base/types";
import { AppProps } from "../base/types";
import { WindowFrame } from "@/components/layout/WindowFrame";

function GovernmentAppComponent({ isWindowOpen, onClose, isForeground }: AppProps) {
  return (
    <WindowFrame
      title="Government"
      isOpen={isWindowOpen}
      onClose={onClose}
      isForeground={isForeground}
    >
      <div className="flex flex-col h-full bg-white p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🏛️</div>
          <h2 className="text-xl font-semibold mb-2">Government Portal</h2>
          <p className="text-gray-600 mb-4">Regulatory compliance and government interactions</p>
          <div className="text-sm text-gray-500">
            <p>• Regulatory filing management</p>
            <p>• Compliance tracking</p>
            <p>• Tax record management</p>
            <p>• License renewal monitoring</p>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

export const GovernmentApp: BaseApp = {
  id: "government",
  name: "Government",
  icon: { type: "image", src: "/icons/government.png" },
  description: "Regulatory compliance and government portal",
  component: GovernmentAppComponent,
  helpItems: [],
  metadata: {
    name: "Government",
    version: "1.0",
    creator: { name: "Founder's Office", url: "https://fo.office" },
    github: "https://github.com/fo/office",
    icon: "/icons/government.png",
  },
};