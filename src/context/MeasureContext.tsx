import React, { createContext, useState } from "react";

const MeasureContext = createContext("");
const MeasureDispatchContext = createContext<any>(undefined);

function MeasureProvider({ children }: any) {
  const [measureDetails, setMeasureDetails] = useState("");

  return (
    <MeasureContext.Provider value={measureDetails}>
      <MeasureDispatchContext.Provider value={setMeasureDetails}>
        {children}
      </MeasureDispatchContext.Provider>
    </MeasureContext.Provider>
  );
}

export { MeasureProvider, MeasureContext, MeasureDispatchContext };
