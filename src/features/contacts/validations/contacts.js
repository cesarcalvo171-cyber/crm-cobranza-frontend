import * as Yup from 'yup';

export const contactValidationSchema = Yup.object().shape({
  customer_number: Yup.string()
    .trim()
    .required('El número de cliente es requerido.'),
  name: Yup.string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres.')
    .required('El nombre del cliente es requerido.'),
  email: Yup.string()
    .trim()
    .email('Formato de correo electrónico inválido.')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  whatsapp_number: Yup.string()
    .trim()
    .transform((value) => (value === '' ? null : value)),
  sms_number: Yup.string()
    .trim()
    .transform((value) => (value === '' ? null : value)),
  status: Yup.string()
    .oneOf(['active', 'inactive', 'overdue'], 'El estatus debe ser active, inactive u overdue.')
    .required('El estatus es requerido.'),
}).test(
  'at-least-one-channel',
  'Debe proporcionar al menos un número de WhatsApp o un teléfono de SMS.',
  function (value) {
    const { whatsapp_number, sms_number } = value;
    return !!(whatsapp_number?.trim() || sms_number?.trim());
  }
);
