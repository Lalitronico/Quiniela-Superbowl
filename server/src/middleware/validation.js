import { body, validationResult } from 'express-validator'

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Error de validacion',
      errors: errors.array().map(e => e.msg)
    })
  }
  next()
}

export const validateParticipant = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email invalido')
    .normalizeEmail(),
  body('avatar')
    .optional()
    .trim()
    .isLength({ max: 10 }).withMessage('Avatar invalido'),
  handleValidationErrors
]

export const validatePredictions = [
  body('userId')
    .trim()
    .notEmpty().withMessage('El userId es requerido')
    .isUUID().withMessage('userId invalido'),
  body('predictions')
    .notEmpty().withMessage('Las predicciones son requeridas')
    .isObject().withMessage('Formato de predicciones invalido'),
  handleValidationErrors
]

export const validateResults = [
  body('results')
    .notEmpty().withMessage('Los resultados son requeridos')
    .isObject().withMessage('Formato de resultados invalido'),
  handleValidationErrors
]
