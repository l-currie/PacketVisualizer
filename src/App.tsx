import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import PerformanceScreen from "./Tabs/PerformanceScreen";
import ProcessScreen from "./Tabs/ProcessScreen";

import useUsageData from "./hooks/useUsageData";
import useSystemData from "./hooks/useSystemData";

export default function App() {
  const { usageArr } = useUsageData();
  const { cpuData, memoryData, gpuData } = useSystemData();

  return (
    <Router>
      <header>
        <nav>
          <ul>
            <li>
              <NavLink to="/processes">Processes</NavLink>
            </li>
            <li>
              <NavLink to="/">Performance</NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <PerformanceScreen cpuData={cpuData} memoryData={memoryData} gpuData={gpuData} usageArr={usageArr} />
          }
        />
        <Route path="/processes" element={<ProcessScreen />} />
      </Routes>
    </Router>
  );
}
