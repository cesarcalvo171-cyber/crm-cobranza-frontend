import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from '../../providers/AuthProvider';
import { loginValidationSchema } from '../../validations/auth';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, KeyRound, Loader2 } from 'lucide-react';

export function Login() {
  const { session, login } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);

  // Si ya hay una sesión iniciada, no permitir ver el login y redirigir
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    setAuthError(null);
    try {
      await login(values.email, values.password);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('[AUTH ERROR]', error);
      // Mensajes de error más amigables
      if (error.message === 'Invalid login credentials') {
        setAuthError('Correo electrónico o contraseña incorrectos.');
      } else {
        setAuthError(error.message || 'Ocurrió un error inesperado al intentar iniciar sesión.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 font-sans relative overflow-hidden">
      {/* Luces de fondo decorativas premium (Glow) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md px-6 z-10">
        {/* Encabezado Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-3 border border-indigo-400/20">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-serif">CRM Cobranza</h1>
          <p className="text-sm text-slate-400 mt-1.5 font-medium">Plataforma de Cobranza Inteligente</p>
        </div>

        {/* Tarjeta de Formulario (Glassmorphism) */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-100">Iniciar Sesión</h2>
            <p className="text-xs text-slate-400 mt-1">Ingresa tus credenciales administrativas para continuar.</p>
          </div>

          {/* Alerta de error de autenticación */}
          {authError && (
            <div className="mb-5 p-4 bg-red-950/40 border border-red-800/50 rounded-xl flex items-start gap-3 animate-fade-in text-red-200">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs font-medium leading-relaxed">{authError}</div>
            </div>
          )}

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="email">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </span>
                    <Field
                      name="email"
                      type="email"
                      id="email"
                      placeholder="nombre@empresa.com"
                      className={`w-full bg-slate-950 border text-slate-100 placeholder-slate-600 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none transition-all duration-200 ${
                        errors.email && touched.email
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500'
                          : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      }`}
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-[11px] font-medium text-red-400 mt-1 pl-1"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-medium text-slate-300" htmlFor="password">
                      Contraseña
                    </label>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </span>
                    <Field
                      name="password"
                      type="password"
                      id="password"
                      placeholder="••••••••"
                      className={`w-full bg-slate-950 border text-slate-100 placeholder-slate-600 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none transition-all duration-200 ${
                        errors.password && touched.password
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500'
                          : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      }`}
                    />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-[11px] font-medium text-red-400 mt-1 pl-1"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2.5 font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 border border-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-200" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Entrar al Panel'
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-500 mt-8 leading-relaxed">
          Acceso estrictamente autorizado.<br />
          © {new Date().getFullYear()} CRM Cobranza Inteligente. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
