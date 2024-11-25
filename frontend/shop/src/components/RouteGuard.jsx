import React from "react";
import { Navigate } from "react-router-dom";

const RouteGuard = ({ user, children }) => {
  return user ? (
    children
  ) : (
    <div
      id="guard"
      className={`z-0 mt-48  font-abeezee font-semibold text-2xl`}
    >
      <p>Please register or login to your account to see data!!</p>
    </div>
  );
};

export default RouteGuard;
