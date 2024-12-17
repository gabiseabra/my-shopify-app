import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/products", "routes/products/list.tsx", { id: 'products/list' }),
  route("/products/new", "routes/products/upsert.tsx", { id: 'products/new' }),
  route("/products/:handle/edit", "routes/products/upsert.tsx", { id: 'products/edit' }),
] satisfies RouteConfig;
