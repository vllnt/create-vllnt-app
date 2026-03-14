export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
        <p className="mt-1 text-2xl font-bold">0</p>
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Active</h3>
        <p className="mt-1 text-2xl font-bold">0</p>
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Revenue</h3>
        <p className="mt-1 text-2xl font-bold">$0</p>
      </div>
    </div>
  )
}
