
import React from 'react';
import { Outlet } from 'react-router';
import ListaEmpleados from '../components/lista-empleados';


const LocalDataRouter = () => {
  return (
    <div>
      <ListaEmpleados />
      {/* Outlet para rutas hijas */}
      <Outlet />
    </div>
  );
};

export default LocalDataRouter;