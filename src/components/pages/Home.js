import React from "react";
import Slider from "../organisms/Slider";
import Vmc from "./inc/Vmc";
import Company from "../organisms/Company";
import Subsidiaries from "../organisms/Subsidiaries";

function Home() {
  return (
    <div>
      <Slider />
      {/* our company */}
      <Company />
      {/* Our Mission, Vision & Values */}
      <Vmc />
      {/* Subsidiaries */}
      <Subsidiaries />
    </div>
  );
}

export default Home;
