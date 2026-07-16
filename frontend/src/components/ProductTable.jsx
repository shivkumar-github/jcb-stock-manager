import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import StockBadge from '@/components/StockBadge'
import { Pencil, Trash2, Minus, Plus, PackageSearch } from 'lucide-react'

function formatPrice(value) {
  if (value === null || value === undefined) return '—'
  return `₹${Number(value).toFixed(2)}`
}

function getRowClass(product, index) {
  if (product.quantity === 0) {
    return 'bg-red-50/70 hover:bg-red-50'
  }

  if (product.quantity <= product.minimum_quantity) {
    return 'bg-amber-50/50 hover:bg-amber-50'
  }

  return index % 2 === 1 ? 'bg-muted/30 hover:bg-muted/50' : 'hover:bg-muted/50'
}

function getCardClass(product) {
  if (product.quantity === 0) {
    return 'border-red-200 bg-red-50/60'
  }

  if (product.quantity <= product.minimum_quantity) {
    return 'border-amber-200 bg-amber-50/40'
  }

  return ''
}

const headCellClass = 'text-xs font-semibold tracking-wide text-muted-foreground uppercase'

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onQuantityChange,
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
        <PackageSearch className="size-8 text-muted-foreground" />
        <p className="text-base font-medium text-foreground">No products found</p>
        <p className="text-sm text-muted-foreground">
          Try a different search, or add a new product to get started.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {products.map((product) => (
          <Card key={product.id} className={`shadow-sm ${getCardClass(product)}`}>
            <CardContent className="flex flex-col gap-3 py-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="leading-snug font-semibold text-foreground">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.part_number}</p>
                </div>
                <StockBadge
                  quantity={product.quantity}
                  minimumQuantity={product.minimum_quantity}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={product.quantity === 0}
                    onClick={() => onQuantityChange(product, -1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus />
                  </Button>

                  <span className="min-w-6 text-center text-base font-semibold tabular-nums">
                    {product.quantity}
                  </span>

                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onQuantityChange(product, 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus />
                  </Button>
                </div>

                <div className="text-right text-sm">
                  <p className="text-muted-foreground">Min {product.minimum_quantity}</p>
                  <p className="font-medium text-foreground">{formatPrice(product.selling_price)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onEdit(product)}
                >
                  <Pencil />
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => onDelete(product)}
                >
                  <Trash2 />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: table with sticky header */}
      <div className="hidden overflow-hidden rounded-lg border shadow-sm sm:block">
        <div className="max-h-[65vh] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow className="hover:bg-transparent">
                <TableHead className={`pl-4 ${headCellClass}`}>Part Number</TableHead>
                <TableHead className={headCellClass}>Name</TableHead>
                <TableHead className={`text-center ${headCellClass}`}>Quantity</TableHead>
                <TableHead className={`text-right ${headCellClass}`}>Minimum Qty</TableHead>
                <TableHead className={`text-right ${headCellClass}`}>Selling Price</TableHead>
                <TableHead className={`pr-4 text-right ${headCellClass}`}>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id} className={getRowClass(product, index)}>
                  <TableCell className="pl-4 font-semibold text-foreground">
                    {product.part_number}
                  </TableCell>

                  <TableCell>{product.name}</TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        disabled={product.quantity === 0}
                        onClick={() => onQuantityChange(product, -1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus />
                      </Button>

                      <span className="min-w-8 text-center text-base font-semibold tabular-nums">
                        {product.quantity}
                      </span>

                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => onQuantityChange(product, 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus />
                      </Button>

                      <StockBadge
                        quantity={product.quantity}
                        minimumQuantity={product.minimum_quantity}
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-right text-muted-foreground tabular-nums">
                    {product.minimum_quantity}
                  </TableCell>

                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatPrice(product.selling_price)}
                  </TableCell>

                  <TableCell className="pr-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
                        <Pencil />
                        Edit
                      </Button>

                      <Button variant="destructive" size="sm" onClick={() => onDelete(product)}>
                        <Trash2 />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}