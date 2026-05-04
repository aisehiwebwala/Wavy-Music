import React, { useState } from "react";
import { toggleProxy, isProxyEnabled } from "../api/client";

export default function ProxyToggle() {
  // Initialize the state with the current value from local storage / client.js
  const [proxyActive, setProxyActive] = useState(isProxyEnabled());

  const handleToggle = (e) => {
    const isChecked = e.target.checked;
    setProxyActive(isChecked); // Update the React UI state
    toggleProxy(isChecked);    // Update the API client & LocalStorage
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px" }}>
      <input
        id="proxy-toggle"
        type="checkbox"
        checked={proxyActive}
        onChange={handleToggle}
        style={{ cursor: "pointer", width: "16px", height: "16px" }}
      />
      <label htmlFor="proxy-toggle" style={{ cursor: "pointer", fontSize: "14px" }}>
        Enable Proxy
      </label>
    </div>
  );
}