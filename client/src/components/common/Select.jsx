import { motion } from 'framer-motion'

export default function Select({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder = 'Seleccionar...',
  className = ''
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-white/80">
          {label}
          {required && <span className="text-nfl-red ml-1">*</span>}
        </label>
      )}
      <motion.select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`input-field appearance-none cursor-pointer ${error ? 'border-nfl-red' : ''}`}
        whileFocus={{ scale: 1.01 }}
      >
        <option value="" className="bg-stadium-dark">{placeholder}</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-stadium-dark"
          >
            {option.label}
          </option>
        ))}
      </motion.select>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-nfl-red text-sm"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}
