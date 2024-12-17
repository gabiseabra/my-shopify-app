import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('/products', 'routes/products/list.tsx', { id: 'products/list' }, [
    route('new', 'routes/products/upsert.tsx', { id: 'products/new' }),
    route(':handle/edit', 'routes/products/upsert.tsx', {
      id: 'products/edit',
    }),
  ]),
] satisfies RouteConfig
