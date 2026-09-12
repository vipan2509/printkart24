import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import OrdersDashboardClient from '@/components/orders-dashboard-client'

export default async function OrdersDashboard() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login')
  return <OrdersDashboardClient />
}
