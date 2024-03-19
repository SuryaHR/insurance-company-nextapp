"use client";
import AdjusterLineItemComponent from "./AdjusterLineItemComponent";
import { LineItemContextProvider } from "./LineItemContext";

const AdjusterLineItemComponentWrapper = () => (
  <LineItemContextProvider>
    <AdjusterLineItemComponent />
  </LineItemContextProvider>
);
export default AdjusterLineItemComponentWrapper;
