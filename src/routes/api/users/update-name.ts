import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/users/update-name')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/api/users/update-name"!</div>
}
