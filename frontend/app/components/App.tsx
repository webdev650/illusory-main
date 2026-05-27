"use client";
import React from "react";
import { TCanvas } from "./TCanvas";

export const App = ({head1 , head2, head3, head4} : {head1 : string; head2: string; head3: string; head4 : string}) => {
  return (
<>
  <TCanvas 
  head1={head1}
  head2={head2}
  head3={head3}
  head4={head4}
  />
</>
  );
};

