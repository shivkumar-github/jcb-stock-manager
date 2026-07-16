import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ProductTable from '@/components/ProductTable'
import AddProductDialog from '@/components/AddProductDialog'
import EditProductDialog from '@/components/EditProductDialog'
import DeleteProductDialog from '@/components/DeleteProductDialog'
import LowStockAlert from '@/components/LowStockAlert'
import { Package, AlertTriangle, PackageX, LogOut, Search } from 'lucide-react'

export default function StockDashboard({ onLogout }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [editProduct, setEditProduct] = useState(null)
  const [editOpen, setEditOpen] = useState(false)

  const [deleteProduct, setDeleteProduct] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  async function fetchProducts() {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setProducts(data ?? [])
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return products

    return products.filter(
      (product) =>
        product.part_number.toLowerCase().includes(term) ||
        product.name.toLowerCase().includes(term)
    )
  }, [products, searchTerm])

  const lowStockProducts = useMemo(
    () => products.filter((product) => product.quantity <= product.minimum_quantity),
    [products]
  )

  const outOfStockProducts = useMemo(
    () => products.filter((product) => product.quantity === 0),
    [products]
  )

  function handleAdded(newProduct) {
    setProducts((prev) => [newProduct, ...prev])
  }

  function handleEditRequest(product) {
    setEditProduct(product)
    setEditOpen(true)
  }

  function handleUpdated(updatedProduct) {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    )
  }

  function handleDeleteRequest(product) {
    setDeleteProduct(product)
    setDeleteOpen(true)
  }

  function handleDeleted(deletedId) {
    setProducts((prev) => prev.filter((p) => p.id !== deletedId))
  }

  async function handleQuantityChange(product, change) {
    const newQuantity = Math.max(0, product.quantity + change)

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? { ...p, quantity: newQuantity }
          : p
      )
    )

    const { error } = await supabase
      .from('products')
      .update({ quantity: newQuantity })
      .eq('id', product.id)

    if (error) {
      // Rollback on failure
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: product.quantity }
            : p
        )
      )

      toast.error('Failed to update quantity: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Top nav bar */}
      <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-yellow-400">
              <Package className="size-4.5 text-neutral-950" />
            </div>
            <span className="text-base font-bold tracking-tight text-white sm:text-lg">
              Stock Manager
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AddProductDialog onAdded={handleAdded} triggerClassName="font-semibold shadow-lg" />
            <Button
              variant="outline"
              onClick={onLogout}
              className="border-neutral-700 bg-transparent text-white hover:bg-neutral-800 hover:text-white"
            >
              <LogOut />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Page title band */}
      <div className="border-b bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-2.5 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
            <span className="size-1.5 rounded-full bg-yellow-400" />
            Dashboard
          </span>
          <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Inventory Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track stock levels, manage products, and stay ahead of shortages.
          </p>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="overflow-hidden border-t-4 border-t-neutral-900 shadow-sm">
            <CardContent className="flex items-center gap-4 py-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-neutral-900">
                <Package className="size-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Total Products
                </p>
                <p className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
                  {products.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-t-4 border-t-amber-500 shadow-sm">
            <CardContent className="flex items-center gap-4 py-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                <AlertTriangle className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Low Stock
                </p>
                <p className="text-3xl font-extrabold tracking-tight text-amber-600 tabular-nums">
                  {lowStockProducts.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-t-4 border-t-red-600 shadow-sm">
            <CardContent className="flex items-center gap-4 py-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-red-50">
                <PackageX className="size-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Out of Stock
                </p>
                <p className="text-3xl font-extrabold tracking-tight text-red-600 tabular-nums">
                  {outOfStockProducts.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <LowStockAlert lowStockProducts={lowStockProducts} />

        {/* Product list */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
              Products
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-600">
                {filteredProducts.length}
              </span>
            </CardTitle>

            <div className="relative w-full sm:w-72">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by part number or name..."
                className="h-10 w-full rounded-lg pl-9"
              />
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {loading && (
              <div className="flex flex-col gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 w-full animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                <p className="font-medium">Couldn't load products</p>
                <p className="text-sm">{error}</p>
                <Button variant="outline" size="sm" className="w-fit" onClick={fetchProducts}>
                  Try again
                </Button>
              </div>
            )}

            {!loading && !error && (
              <ProductTable
                products={filteredProducts}
                onEdit={handleEditRequest}
                onDelete={handleDeleteRequest}
                onQuantityChange={handleQuantityChange}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <EditProductDialog
        open={editOpen}
        product={editProduct}
        onOpenChange={setEditOpen}
        onUpdated={handleUpdated}
      />

      <DeleteProductDialog
        open={deleteOpen}
        product={deleteProduct}
        onOpenChange={setDeleteOpen}
        onDeleted={handleDeleted}
      />
    </div>
  )
}