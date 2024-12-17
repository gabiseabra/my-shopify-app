import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/products.tsx"),
  route("/products/new", "routes/product.tsx", { id: 'product/new' }),
  route("/products/:handle/edit", "routes/product.tsx", { id: 'product/edit' }),
] satisfies RouteConfig;
