export default function StockBadge({ quantity, minimumQuantity }) {
  let label = 'IN STOCK'
  let classes = 'bg-green-100 text-green-800 border border-green-300'

  if (quantity === 0) {
    label = 'OUT OF STOCK'
    classes = 'bg-red-100 text-red-800 border border-red-300'
  } else if (quantity <= minimumQuantity) {
    label = 'LOW STOCK'
    classes = 'bg-yellow-100 text-yellow-800 border border-yellow-300'
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${classes}`}
    >
      {label}
    </span>
  )
}