import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import StockBadge from '@/components/StockBadge'

function formatPrice(value) {
  if (value === null || value === undefined) return '—'
  return `₹${Number(value).toFixed(2)}`
}

function getRowClass(product) {
  if (product.quantity === 0) {
    return 'bg-red-100 hover:bg-red-100'
  }

  if (product.quantity <= product.minimum_quantity) {
    return 'bg-red-50 hover:bg-red-50'
  }

  return ''
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onQuantityChange,
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-16 text-center">
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search, or add a new product to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Part Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead className="text-right">Minimum Qty</TableHead>
            <TableHead className="text-right">Selling Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              className={getRowClass(product)}
            >
              <TableCell className="font-medium">
                {product.part_number}
              </TableCell>

              <TableCell>{product.name}</TableCell>

              <TableCell>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={product.quantity === 0}
                      onClick={() =>
                        onQuantityChange(product, -1)
                      }
                    >
                      −
                    </Button>

                    <span className="min-w-8 text-center font-semibold text-lg">
                      {product.quantity}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onQuantityChange(product, 1)
                      }
                    >
                      +
                    </Button>
                  </div>

                  <StockBadge
                    quantity={product.quantity}
                    minimumQuantity={product.minimum_quantity}
                  />
                </div>
              </TableCell>

              <TableCell className="text-right">
                {product.minimum_quantity}
              </TableCell>

              <TableCell className="text-right">
                {formatPrice(product.selling_price)}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(product)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}