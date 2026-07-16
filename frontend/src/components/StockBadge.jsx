export default function StockBadge({ quantity, minimumQuantity }) {
  let config = {
    label: 'In Stock',
    dot: 'bg-emerald-200',
    classes: 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30',
  }

  if (quantity === 0) {
    config = {
      label: 'Out of Stock',
      dot: 'bg-red-200',
      classes: 'bg-red-500 text-white shadow-sm shadow-red-500/30',
    }
  } else if (quantity <= minimumQuantity) {
    config = {
      label: 'Low Stock',
      dot: 'bg-amber-200',
      classes: 'bg-amber-500 text-white shadow-sm shadow-amber-500/30',
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${config.classes}`}
    >
      <span className={`size-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}