import { BaseApp } from "../base/types";
import { AppProps } from "../base/types";
import { WindowFrame } from "@/components/layout/WindowFrame";

function CulturalAppComponent({ isWindowOpen, onClose, isForeground }: AppProps) {
  return (
    <WindowFrame
      title="Cultural"
      isOpen={isWindowOpen}
      onClose={onClose}
      isForeground={isForeground}
    >
      <div className="flex flex-col h-full bg-white p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-xl font-semibold mb-2">Cultural Assessment</h2>
          <p className="text-gray-600 mb-4">Internal HR assessment and cultural analysis</p>
          <div className="text-sm text-gray-500">
            <p>• Employee engagement surveys</p>
            <p>• Cultural assessment tools</p>
            <p>• Performance evaluation</p>
            <p>• Insights and recommendations</p>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

export const CulturalApp: BaseApp = {
  id: "cultural",
  name: "Cultural",
  icon: { type: "image", src: "/icons/cultural.png" },
  description: "HR assessment and cultural analysis platform",
  component: CulturalAppComponent,
  helpItems: [],
  metadata: {
    name: "Cultural",
    version: "1.0",
    creator: { name: "Founder's Office", url: "https://fo.office" },
    github: "https://github.com/fo/office",
    icon: "/icons/cultural.png",
  },
};