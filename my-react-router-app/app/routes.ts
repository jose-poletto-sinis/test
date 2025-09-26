import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"

export default [
  layout("layouts/root-layout.tsx", [
    route("atributos", "routes/atributos/modificador-atributos.tsx"),
    layout("layouts/auth-layout.tsx", [
      route("login", "routes/auth/login.tsx"),
      route("register", "routes/auth/register.tsx"),
    ]),
    index("routes/home.tsx"),
    route("lista-atributos", "routes/lista-atributos.tsx", [
      route("delete/:id", "routes/forms/form-delete.tsx"),
      route("updateatributo/:id", "routes/UpdateAtributo.tsx"),
    ]),
  ]),
] satisfies RouteConfig

