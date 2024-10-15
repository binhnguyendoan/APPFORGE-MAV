import React from "react";
import { Route, useLocation } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "../pages/PrivateRoute";
import Wallet from "../pages/Wallet";
const MyApp = () => {

  return (
    <RecoilRoot>
      <App>
        <SnackbarProvider>

          <ZMPRouter>
            <AnimationRoutes>
              <Route path="/" element={<Login></Login>}></Route>
              <Route path="/signup" element={<Register></Register>}></Route>
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard></Dashboard>
                  </PrivateRoute>}>
              </Route>
              <Route path="/wallet"
                element={
                  <PrivateRoute>
                    <Wallet></Wallet>
                  </PrivateRoute>}>
              </Route>
            </AnimationRoutes>
          </ZMPRouter>

        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};
export default MyApp;
