import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"

export default [
  layout("layouts/root-layout.tsx", [
    route("atributos", "routes/atributos/modificador-atributos.tsx"),
    layout("layouts/auth-layout.tsx", [
      route("login", "routes/auth/login.tsx"),
      route("register", "routes/auth/register.tsx"),
    ]),
    index("routes/home.tsx"),
    layout("routes/local-data-router.tsx", [
      route("local-data", "routes/local-data.tsx"),
    ]),
  ]),
  route("kendo", "routes/atributos/modificador-kendo.tsx"),
  
] satisfies RouteConfig

