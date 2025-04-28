import React, { useState } from "react";
import useProcessData, { ProcessInfo } from "../hooks/useProcessData";

function ProcessScreen() {
  const { processData } = useProcessData();
  return (
    <div>
      Processes
      {processData.map((p) => (
        <div>
          <p>{p.name + " " + p.pid + " " + p.parent_id + " " + p.memory_kb}</p>
        </div>
      ))}
    </div>
  );
}

export default ProcessScreen;
