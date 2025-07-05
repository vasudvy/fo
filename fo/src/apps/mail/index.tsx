import { BaseApp } from "../base/types";
import { AppProps } from "../base/types";
import { WindowFrame } from "@/components/layout/WindowFrame";

function MailAppComponent({ isWindowOpen, onClose, isForeground }: AppProps) {
  return (
    <WindowFrame
      title="Mail"
      isOpen={isWindowOpen}
      onClose={onClose}
      isForeground={isForeground}
    >
      <div className="flex flex-col h-full bg-white p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-xl font-semibold mb-2">Mail Application</h2>
          <p className="text-gray-600 mb-4">Advanced email management for founder's office</p>
          <div className="text-sm text-gray-500">
            <p>• Email composition and management</p>
            <p>• Thread organization</p>
            <p>• Advanced search and filters</p>
            <p>• Multiple account support</p>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

export const MailApp: BaseApp = {
  id: "mail",
  name: "Mail",
  icon: { type: "image", src: "/icons/mail.png" },
  description: "Advanced email management system",
  component: MailAppComponent,
  helpItems: [],
  metadata: {
    name: "Mail",
    version: "1.0",
    creator: { name: "Founder's Office", url: "https://fo.office" },
    github: "https://github.com/fo/office",
    icon: "/icons/mail.png",
  },
};