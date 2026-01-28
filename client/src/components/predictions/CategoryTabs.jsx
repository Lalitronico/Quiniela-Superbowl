import { motion } from 'framer-motion'

const categories = [
  { id: 'deportivas', label: 'Deportivas', icon: '🏈', color: 'from-green-500 to-green-700' },
  { id: 'entretenimiento', label: 'Entretenimiento', icon: '🎤', color: 'from-purple-500 to-purple-700' },
  { id: 'comerciales', label: 'Comerciales', icon: '📺', color: 'from-blue-500 to-blue-700' },
  { id: 'curiosidades', label: 'Curiosidades', icon: '🎯', color: 'from-orange-500 to-orange-700' }
]

export default function CategoryTabs({ activeCategory, onCategoryChange, completedCategories = [] }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => {
        const isActive = activeCategory === category.id
        const isCompleted = completedCategories.includes(category.id)

        return (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative px-4 py-3 rounded-xl font-medium transition-all duration-300
              flex items-center gap-2
              ${isActive
                ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
              }
            `}
          >
            <span className="text-xl">{category.icon}</span>
            <span className="hidden sm:inline">{category.label}</span>

            {isCompleted && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-field-green rounded-full flex items-center justify-center text-xs"
              >
                ✓
              </motion.span>
            )}

            {isActive && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 bg-gradient-to-r rounded-xl -z-10"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
