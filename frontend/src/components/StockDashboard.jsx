import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ProductTable from '@/components/ProductTable'
import AddProductDialog from '@/components/AddProductDialog'
import EditProductDialog from '@/components/EditProductDialog'
import DeleteProductDialog from '@/components/DeleteProductDialog'
import LowStockAlert from '@/components/LowStockAlert'

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

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{products.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{lowStockProducts.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{outOfStockProducts.length}</p>
          </CardContent>
        </Card>
      </div>

      <LowStockAlert lowStockProducts={lowStockProducts} />

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-2xl">Stock Management Dashboard</CardTitle>
          <div className="flex items-center gap-2">
            <AddProductDialog onAdded={handleAdded} />
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by part number or product name..."
              className="sm:max-w-sm"
            />
          </div>

          {loading && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-full animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col gap-3 rounded-md border border-red-300 bg-red-50 p-4 text-red-800">
              <p className="font-medium">Failed to load products</p>
              <p className="text-sm">{error}</p>
              <Button variant="outline" size="sm" className="w-fit" onClick={fetchProducts}>
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && (
            <ProductTable
              products={filteredProducts}
              onEdit={handleEditRequest}
              onDelete={handleDeleteRequest}
            />
          )}
        </CardContent>
      </Card>

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