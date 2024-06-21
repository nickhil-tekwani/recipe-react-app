import React from "react";
import { Outlet } from "react-router-dom";

function Details() {

  return (
    <div className="home">
      <div class="container">
        <Outlet data-testid="required-outlet" />
      </div>
    </div>
  );
}

export default Details;