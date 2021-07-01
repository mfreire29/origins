import React, { Suspense, lazy } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import UserProvider from "./context/User";
const ContainerLogin = lazy(() => import("./components/ContainerLogin"));
const MisAcciones = lazy(() => import("./components/MisAcciones"));
const ItemDetail = lazy(() => import("./components/ItemDetail"));

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Suspense fallback="Cargando...">
          <Switch>
            <Route exact path="/">
              <ContainerLogin />
            </Route>
            <Route exact path="/misacciones">
              <MisAcciones />
            </Route>
            <Route exact path="/itemDetail/:id">
              <ItemDetail />
            </Route>
          </Switch>
        </Suspense>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
