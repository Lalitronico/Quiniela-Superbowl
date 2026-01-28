import { motion } from 'framer-motion'
import { useWizard } from '../../context/WizardContext'
import StepLayout from '../../components/wizard/StepLayout'

const BRANDS = [
  { id: 'budweiser', name: 'Budweiser', icon: '🍺', color: '#C8102E' },
  { id: 'doritos', name: 'Doritos', icon: '🔺', color: '#FF6600' },
  { id: 'pepsi', name: 'Pepsi', icon: '🥤', color: '#004B93' },
  { id: 'cocacola', name: 'Coca-Cola', icon: '🥤', color: '#F40009' },
  { id: 'amazon', name: 'Amazon', icon: '📦', color: '#FF9900' },
  { id: 'google', name: 'Google', icon: '🔍', color: '#4285F4' },
  { id: 'apple', name: 'Apple', icon: '🍎', color: '#000000' },
  { id: 'otro', name: 'Otro', icon: '❓', color: '#666666' }
]

function BrandCard({ brand, isSelected, onSelect }) {
  return (
    <motion.button
      className={`brand-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ '--brand-color': brand.color }}
    >
      <div className="brand-icon" style={{ background: brand.color }}>
        <span className="text-2xl">{brand.icon}</span>
      </div>
      <h4 className="font-heading text-base mt-3" style={{ color: 'var(--ink)' }}>
        {brand.name}
      </h4>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="brand-check"
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  )
}

export default function StepCommercial() {
  const { predictions, updatePrediction } = useWizard()

  return (
    <StepLayout
      title="¿MEJOR COMERCIAL?"
      subtitle="¿Cuál marca tendrá el mejor comercial según USA Today Ad Meter?"
    >
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {BRANDS.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <BrandCard
                brand={brand}
                isSelected={predictions.commercial === brand.id}
                onSelect={() => updatePrediction('commercial', brand.id)}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="card p-4 mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-body text-sm" style={{ color: 'var(--ink-muted)' }}>
            Costo de un comercial de 30 segundos: <strong style={{ color: 'var(--ink)' }}>$7 millones USD</strong>
          </p>
        </motion.div>
      </div>
    </StepLayout>
  )
}
