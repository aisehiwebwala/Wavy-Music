import React, { useState } from "react";
import { toggleProxy, isProxyEnabled } from "../api/client";
import { Shield } from "lucide-react";

export default function ProxyToggle() {
  const [proxyActive, setProxyActive] = useState(isProxyEnabled());

  const handleToggle = () => {
    const newState = !proxyActive;
    setProxyActive(newState);
    toggleProxy(newState);
  };

  return (
    <div 
      className="flex items-center justify-between px-3 py-4 cursor-pointer"
      onClick={handleToggle}
      role="switch"
      aria-checked={proxyActive}
    >
      <div className="flex items-center gap-3 text-sm font-medium">
        <Shield size={20} />
        <span>API Proxy</span>
      </div>
      <div 
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${
          proxyActive ? "bg-white" : "bg-white/20"
        }`}
      >
        <span 
          className={`inline-block h-3 w-3 transform rounded-full transition-transform duration-300 ${
            proxyActive ? "translate-x-5 bg-black" : "translate-x-1 bg-white"
          }`} 
        />
      </div>
    </div>
  );
}