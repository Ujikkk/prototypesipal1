/**
 * Validasi Page - Student Login with NIM + Password
 * 
 * Mahasiswa login dengan NIM sebagai username dan password.
 * Setelah login berhasil, langsung redirect ke dashboard.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAlumni } from '@/contexts/AlumniContext';
import { LogIn, Eye, EyeOff, AlertCircle, Shield, CheckCircle2, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ValidasiPage() {
  const navigate = useNavigate();
  const { loginWithCredentials } = useAlumni();
  
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async () => {
    // Reset error
    setError('');
    
    // Validation
    if (!nim.trim()) {
      setError('NIM wajib diisi');
      return;
    }
    
    if (!password) {
      setError('Password wajib diisi');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await loginWithCredentials(nim.trim(), password);
      
      if (result.success) {
        setLoginSuccess(true);
        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError(result.error || 'Login gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  const handleContactAdmin = () => {
    alert('Silakan hubungi admin melalui email: prodi-abt@polines.ac.id');
  };

  // Success state
  if (loginSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="glass-card rounded-2xl p-8 text-center animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Login Berhasil!
                </h2>
                <p className="text-muted-foreground mb-4">
                  Mengarahkan ke dashboard Anda...
                </p>
                <div className="w-32 h-1 bg-muted rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-primary animate-shimmer" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                Login Mahasiswa
              </h1>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Masuk dengan NIM dan password untuk mengakses dashboard Anda.
              </p>
            </div>

            {/* Login Form */}
            <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <LogIn className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Masuk ke Akun</h2>
                  <p className="text-sm text-muted-foreground">Gunakan NIM sebagai username</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* NIM Input */}
                <div>
                  <Label htmlFor="nim" className="text-foreground font-medium mb-2 block">
                    NIM (Username)
                  </Label>
                  <Input
                    id="nim"
                    placeholder="Masukkan NIM Anda (contoh: 20210001)"
                    value={nim}
                    onChange={(e) => {
                      setNim(e.target.value.replace(/\D/g, '').slice(0, 8));
                      setError('');
                    }}
                    onKeyDown={handleKeyDown}
                    className="h-12 rounded-xl"
                    disabled={isLoading}
                  />
                </div>

                {/* Password Input */}
                <div>
                  <Label htmlFor="password" className="text-foreground font-medium mb-2 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      onKeyDown={handleKeyDown}
                      className="h-12 rounded-xl pr-12"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 animate-fade-up">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-destructive">{error}</p>
                    </div>
                  </div>
                )}

                {/* Login Button */}
                <Button
                  onClick={handleLogin}
                  disabled={isLoading || !nim.trim() || !password}
                  className="w-full h-12"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Masuk
                    </>
                  )}
                </Button>

                {/* Help Section */}
                <div className="pt-4 border-t border-border">
                  <button
                    onClick={handleContactAdmin}
                    className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Lupa password atau belum punya akun?
                  </button>
                </div>
              </div>
            </div>

            {/* Demo Info */}
            <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
              <p className="text-sm text-center text-muted-foreground">
                <span className="font-medium text-foreground">Demo:</span> Gunakan NIM <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">20210001</code> dengan password <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">password123</code>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
