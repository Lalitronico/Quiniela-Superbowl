import { motion } from 'framer-motion'

export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  icon,
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
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
            {icon}
          </span>
        )}
        <motion.input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`input-field ${icon ? 'pl-12' : ''} ${error ? 'border-nfl-red focus:border-nfl-red focus:ring-nfl-red/30' : ''}`}
          whileFocus={{ scale: 1.01 }}
        />
      </div>
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
