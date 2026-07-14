import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LowStockAlert({ lowStockProducts }) {
  if (!lowStockProducts || lowStockProducts.length === 0) {
    return null
  }

  return (
    <Card className="border-yellow-300 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800">
          <span>⚠</span>
          <span>Low Stock Alert ({lowStockProducts.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2">
          {lowStockProducts.map((product) => (
            <li
              key={product.id}
              className="flex flex-col gap-1 border-b border-yellow-200 pb-2 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <span className="font-medium">{product.name}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  ({product.part_number})
                </span>
              </div>
              <span className="text-sm font-semibold text-yellow-800">
                Quantity: {product.quantity}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}