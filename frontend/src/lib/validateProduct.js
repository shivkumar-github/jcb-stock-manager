export function validateProduct(values) {
  const errors = {}

  if (!values.part_number || !values.part_number.trim()) {
    errors.part_number = 'Part number is required.'
  }

  if (!values.name || !values.name.trim()) {
    errors.name = 'Product name is required.'
  }

  if (values.quantity === '' || values.quantity === null || values.quantity === undefined) {
    errors.quantity = 'Quantity is required.'
  } else {
    const quantity = Number(values.quantity)
    if (!Number.isInteger(quantity) || quantity < 0) {
      errors.quantity = 'Quantity must be a whole number of 0 or more.'
    }
  }

  if (
    values.minimum_quantity === '' ||
    values.minimum_quantity === null ||
    values.minimum_quantity === undefined
  ) {
    errors.minimum_quantity = 'Minimum quantity is required.'
  } else {
    const minimumQuantity = Number(values.minimum_quantity)
    if (!Number.isInteger(minimumQuantity) || minimumQuantity < 0) {
      errors.minimum_quantity = 'Minimum quantity must be a whole number of 0 or more.'
    }
  }

  if (values.selling_price !== '' && values.selling_price !== null && values.selling_price !== undefined) {
    const price = Number(values.selling_price)
    if (Number.isNaN(price) || price < 0) {
      errors.selling_price = 'Selling price must be a valid number of 0 or more.'
    }
  }

  return errors
}