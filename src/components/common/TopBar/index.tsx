import { X } from "lucide-react";
import "./styles.css";
export default function Topbar() {
  return (
    <div className="grid grid-cols-[auto_max-content] select-none h-12.5 fixed top-0 left-0 right-0  bg-background">
      <div data-tauri-drag-region className="h-full w-full"></div>
      <div className="flex items-center justify-center gap-2 mr-2">
        <button id="titlebar-minimize" title="minimize">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M19 13H5v-2h14z" />
          </svg>
        </button>
        <button id="titlebar-maximize" title="maximize">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M4 4h16v16H4zm2 4v10h12V8z" />
          </svg>
        </button>
        <button
          title="close"
          className="border-none p-1 hover:bg-red-400 hover:rounded-sm"
        >
          <X color="#E3DFFF" size={16} />
        </button>
      </div>
    </div>
  );
}
