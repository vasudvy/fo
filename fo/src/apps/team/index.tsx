import { BaseApp } from "../base/types";
import { AppProps } from "../base/types";
import { WindowFrame } from "@/components/layout/WindowFrame";

function TeamAppComponent({ isWindowOpen, onClose, isForeground }: AppProps) {
  return (
    <WindowFrame
      title="Teams"
      isOpen={isWindowOpen}
      onClose={onClose}
      isForeground={isForeground}
    >
      <div className="flex flex-col h-full bg-white p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-xl font-semibold mb-2">Teams Collaboration</h2>
          <p className="text-gray-600 mb-4">Advanced team communication and collaboration</p>
          <div className="text-sm text-gray-500">
            <p>• Team chat and channels</p>
            <p>• Video meetings and calls</p>
            <p>• File sharing and collaboration</p>
            <p>• Project management integration</p>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

export const TeamApp: BaseApp = {
  id: "team",
  name: "Teams",
  icon: { type: "image", src: "/icons/team.png" },
  description: "Team collaboration and communication platform",
  component: TeamAppComponent,
  helpItems: [],
  metadata: {
    name: "Teams",
    version: "1.0",
    creator: { name: "Founder's Office", url: "https://fo.office" },
    github: "https://github.com/fo/office",
    icon: "/icons/team.png",
  },
};