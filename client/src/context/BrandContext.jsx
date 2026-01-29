import { createContext, useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const BrandContext = createContext(null)

// Default brand config used as fallback
const DEFAULT_BRAND = {
  slug: 'default',
  name: 'Super Bowl LX Quiniela',
  logoUrl: null,
  primaryColor: '#3B82F6',
  predictionsLockAt: '2026-02-08T18:30:00-08:00',
}

export function BrandProvider({ children }) {
  const { brand: brandSlug } = useParams()
  const navigate = useNavigate()
  const [brand, setBrand] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadBrand = async () => {
      if (!brandSlug) {
        // No brand in URL, use default
        setBrand(DEFAULT_BRAND)
        setLoading(false)
        return
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/api`
          : '/api'

        const response = await fetch(`${apiUrl}/${brandSlug}/brand-info`)

        if (!response.ok) {
          if (response.status === 404) {
            setError('Brand not found')
            // Redirect to default brand
            navigate('/default', { replace: true })
            return
          }
          throw new Error('Failed to load brand')
        }

        const brandData = await response.json()
        setBrand(brandData)
        setError(null)

        // Apply brand primary color as CSS variable
        document.documentElement.style.setProperty('--brand-primary', brandData.primaryColor)
      } catch (err) {
        console.error('Error loading brand:', err)
        setError(err.message)
        setBrand(DEFAULT_BRAND)
      } finally {
        setLoading(false)
      }
    }

    loadBrand()
  }, [brandSlug, navigate])

  const value = {
    brand,
    brandSlug: brandSlug || 'default',
    loading,
    error,
    isLocked: brand?.predictionsLockAt ? new Date() > new Date(brand.predictionsLockAt) : false,
  }

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  const context = useContext(BrandContext)
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider')
  }
  return context
}

export default BrandContext
