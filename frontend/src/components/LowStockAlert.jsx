import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LowStockAlert({ lowStockProducts }) {
  if (!lowStockProducts || lowStockProducts.length === 0) {
    return null
  }

  return (
    <Card className="border-amber-200 border-l-4 border-l-amber-500 bg-amber-50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 text-amber-900">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm shadow-amber-500/30">
            <AlertTriangle className="size-4" />
          </span>
          <span className="font-bold tracking-tight">
            Low Stock Alert ({lowStockProducts.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col divide-y divide-amber-200">
          {lowStockProducts.map((product) => (
            <li
              key={product.id}
              className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <span className="font-semibold text-foreground">{product.name}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  ({product.part_number})
                </span>
              </div>
              <span className="text-sm font-bold text-amber-700 tabular-nums">
                Qty: {product.quantity}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}