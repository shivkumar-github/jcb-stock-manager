import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { validateProduct } from '@/lib/validateProduct'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const emptyForm = {
  part_number: '',
  name: '',
  quantity: '0',
  minimum_quantity: '5',
  selling_price: '',
}

export default function AddProductDialog({ onAdded, triggerClassName }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function resetForm() {
    setForm(emptyForm)
    setErrors({})
  }

  function handleOpenChange(nextOpen) {
    setOpen(nextOpen)
    if (!nextOpen) {
      resetForm()
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

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
      .insert(payload)
      .select()
      .single()

    setSubmitting(false)

    if (error) {
      if (error.code === '23505') {
        toast.error('A product with this part number already exists.')
      } else {
        toast.error('Failed to add product: ' + error.message)
      }
      return
    }

    toast.success('Product added successfully.')
    onAdded(data)
    setOpen(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button className={triggerClassName} />}>
        <Plus />
        <span className="hidden xs:inline">Add Product</span>
        <span className="xs:hidden">Add</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Enter the details for the new product, then save.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="add-part-number">Part Number</Label>
              <Input
                id="add-part-number"
                value={form.part_number}
                onChange={(e) => handleChange('part_number', e.target.value)}
                placeholder="e.g. PN-1001"
                className="h-9"
              />
              {errors.part_number && (
                <p className="text-sm text-red-600">{errors.part_number}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="add-name">Product Name</Label>
              <Input
                id="add-name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Hex Bolt M8"
                className="h-9"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="add-quantity">Quantity</Label>
                <Input
                  id="add-quantity"
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
                <Label htmlFor="add-minimum-quantity">Minimum Quantity</Label>
                <Input
                  id="add-minimum-quantity"
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
              <Label htmlFor="add-selling-price">Selling Price</Label>
              <Input
                id="add-selling-price"
                type="number"
                step="0.01"
                value={form.selling_price}
                onChange={(e) => handleChange('selling_price', e.target.value)}
                placeholder="e.g. 199.99"
                className="h-9"
              />
              {errors.selling_price && (
                <p className="text-sm text-red-600">{errors.selling_price}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting} className="h-9">
              {submitting ? 'Saving...' : 'Save Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}