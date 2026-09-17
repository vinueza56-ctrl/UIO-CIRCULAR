import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { PWAInstallButton } from '../common/PWAInstallButton';
import {
  Lock,
  Mail,
  ArrowRight,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const ok = login(email, password);
    if (!ok) {
      setErrorMsg('Credenciales incorrectas o usuario inactivo en el sistema aeroportuario.');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 flex flex-col justify-between text-white p-4 sm:p-6">
      {/* Top Airport Navigation Brand */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-sm text-white tracking-tight shadow-md">
            UIO
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block">
              ECOTRACE UIO
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold block">
              Aeropuerto Internacional Mariscal Sucre · Quito
            </span>
          </div>
        </div>

        <PWAInstallButton />
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900 border border-slate-100 space-y-6">
          <div className="text-center space-y-1.5">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 tracking-wider">
              Control de Residuos Reciclables
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-2">
              Iniciar Sesión
            </h2>
            <p className="text-xs text-slate-500">
              Ingresa tus credenciales autorizadas por Corporación Quiport
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700 uppercase">
                Correo Electrónico Corporativo:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="usuario@aeropuertoquito.aero"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700 uppercase">
                Contraseña de Seguridad:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Acceder al Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl w-full mx-auto text-center text-[11px] text-slate-400 py-3">
        © 2026 Corporación Quiport S.A. · Aeropuerto Internacional Mariscal Sucre de Quito · Sistema PWA Offline-First
      </div>
    </div>
  );
};
