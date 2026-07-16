import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { validateProduct } from '@/lib/validateProduct'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function EditProductDialog({ open, product, onOpenChange, onUpdated }) {
  const [form, setForm] = useState({
    part_number: '',
    name: '',
    quantity: '0',
    minimum_quantity: '5',
    selling_price: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (product) {
      setForm({
        part_number: product.part_number ?? '',
        name: product.name ?? '',
        quantity: String(product.quantity ?? 0),
        minimum_quantity: String(product.minimum_quantity ?? 5),
        selling_price:
          product.selling_price === null || product.selling_price === undefined
            ? ''
            : String(product.selling_price),
      })
      setErrors({})
    }
  }, [product])

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!product) return

    const validationErrors = validateProduct(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setSubmitting(true)

    const payload = {
      part_number: form.part_number.trim(),
      name: form.name.trim(),
      quantity: Number(form.quantity),
      minimum_quantity: Number(form.minimum_quantity),
      selling_price: form.selling_price === '' ? null : Number(form.selling_price),
    }

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', product.id)
      .select()
      .single()

    setSubmitting(false)

    if (error) {
      if (error.code === '23505') {
        toast.error('A product with this part number already exists.')
      } else {
        toast.error('Failed to update product: ' + error.message)
      }
      return
    }

    toast.success('Product updated successfully.')
    onUpdated(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details, then save.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="edit-part-number">Part Number</Label>
              <Input
                id="edit-part-number"
                value={form.part_number}
                onChange={(e) => handleChange('part_number', e.target.value)}
                className="h-9"
              />
              {errors.part_number && (
                <p className="text-sm text-red-600">{errors.part_number}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="h-9"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="edit-quantity">Quantity</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={form.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  className="h-9"
                />
                {errors.quantity && (
                  <p className="text-sm text-red-600">{errors.quantity}</p>
                )}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="edit-minimum-quantity">Minimum Quantity</Label>
                <Input
                  id="edit-minimum-quantity"
                  type="number"
                  value={form.minimum_quantity}
                  onChange={(e) => handleChange('minimum_quantity', e.target.value)}
                  className="h-9"
                />
                {errors.minimum_quantity && (
                  <p className="text-sm text-red-600">{errors.minimum_quantity}</p>
                )}
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="edit-selling-price">Selling Price</Label>
              <Input
                id="edit-selling-price"
                type="number"
                step="0.01"
                value={form.selling_price}
                onChange={(e) => handleChange('selling_price', e.target.value)}
                className="h-9"
              />
              {errors.selling_price && (
                <p className="text-sm text-red-600">{errors.selling_price}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting} className="h-9">
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}