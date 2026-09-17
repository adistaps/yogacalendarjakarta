"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const registerSchema = z
  .object({
    orgName: z.string().min(2, "Nama organisasi minimal 2 karakter"),
    nama: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    konfirmasiPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
    syarat: z.boolean().refine((val) => val === true, "Anda harus menyetujui syarat dan ketentuan"),
  })
  .refine((data) => data.password === data.konfirmasiPassword, {
    message: "Password tidak cocok",
    path: ["konfirmasiPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;



export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call server-side API route (uses service role to bypass RLS)
      const res = await fetch('/api/eo/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgName: data.orgName,
          nama: data.nama,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Pendaftaran gagal');
      }

      // Sign in automatically after successful registration
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        // Registration succeeded, but auto-login failed — redirect to login
        router.push('/eo/login?registered=1');
        return;
      }

      // Redirect to pending page
      router.push('/eo/pending');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Pendaftaran gagal';
      if (message.includes('sudah terdaftar') || message.includes('already registered')) {
        setError('Email sudah terdaftar. Silakan login.');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[4fr_6fr] relative">
      {/* Back to Home Button */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white lg:text-white/80 hover:text-white transition-colors group"
        style={{ fontFamily: "var(--font-manrope)", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.05em" }}
      >
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-colors">
          <ArrowLeft size={18} />
        </div>
      </Link>
      {/* Kiri - Hidden di mobile */}
      <div
        className="hidden lg:flex relative overflow-hidden flex-col items-center justify-center"
        style={{ backgroundColor: "var(--color-dark)" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80"
          alt="Yoga"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-12">
          <svg
            width="40"
            height="40"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto mb-6"
          >
            <path
              d="M16 28C16 28 4 20 4 11C4 7 8 4 12 6C13.5 4 14.8 3 16 3C17.2 3 18.5 4 20 6C24 4 28 7 28 11C28 20 16 28 16 28Z"
              stroke="white"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M16 28C16 28 10 22 10 16C10 12 12.5 10 16 12C19.5 10 22 12 22 16C22 22 16 28 16 28Z"
              stroke="white"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
          </svg>
          <p
            className="text-white/90"
            style={{
              fontFamily: "var(--font-manrope)",
              fontSize: "1.75rem",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.4,
            }}
          >
            &ldquo;The body benefits from movement, and the mind benefits from stillness.&rdquo;
          </p>
          <p
            className="mt-4 text-white/60"
            style={{
              fontFamily: "var(--font-manrope)",
              fontSize: "0.8rem",
            }}
          >
            - Sakyong Mipham
          </p>
        </div>
      </div>

      {/* Kanan */}
      <div className="flex items-center justify-center px-8 py-12 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="lg:hidden text-center mb-8">
            <span
              style={{
                fontFamily: "var(--font-manrope)",
                fontWeight: 400,
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-text)",
              }}
            >
              Yoga Calendar Jakarta
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-manrope)",
              fontWeight: 400,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              color: "var(--color-text)",
              marginBottom: "0.5rem",
            }}
          >
            Daftar Sebagai EO
          </h2>
          <p
            className="mb-8"
            style={{
              fontFamily: "var(--font-manrope)",
              fontWeight: 300,
              fontSize: "0.9rem",
              color: "var(--color-text-muted)",
            }}
          >
            Bergabung dan mulai kelola event yoga Anda
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="orgName" className="text-sm text-text mb-1 block">
                Nama Organisasi / Studio
              </Label>
              <Input
                id="orgName"
                placeholder="Nama studio atau organisasi yoga"
                {...register("orgName")}
                className="border-gray-200"
              />
              {errors.orgName && (
                <p className="text-red-500 text-xs mt-1">{errors.orgName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="nama" className="text-sm text-text mb-1 block">
                Nama Lengkap (PIC)
              </Label>
              <Input
                id="nama"
                placeholder="Nama lengkap penanggung jawab"
                {...register("nama")}
                className="border-gray-200"
              />
              {errors.nama && (
                <p className="text-red-500 text-xs mt-1">{errors.nama.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm text-text mb-1 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                {...register("email")}
                className="border-gray-200"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-sm text-text mb-1 block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="border-gray-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="konfirmasi" className="text-sm text-text mb-1 block">
                Konfirmasi Password
              </Label>
              <div className="relative">
                <Input
                  id="konfirmasi"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("konfirmasiPassword")}
                  className="border-gray-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.konfirmasiPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.konfirmasiPassword.message}</p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="syarat"
                {...register("syarat")}
                className="mt-1"
              />
              <Label htmlFor="syarat" className="text-xs text-text-muted leading-relaxed">
                Saya menyetujui{" "}
                <Link href="#" className="text-primary-val hover:underline">
                  Syarat dan Ketentuan
                </Link>{" "}
                serta{" "}
                <Link href="#" className="text-primary-val hover:underline">
                  Kebijakan Privasi
                </Link>
              </Label>
            </div>
            {errors.syarat && (
              <p className="text-red-500 text-xs">{errors.syarat.message}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{
                backgroundColor: "var(--color-primary-val)",
                fontFamily: "var(--font-manrope)",
                fontWeight: 500,
                fontSize: "0.8rem",
                letterSpacing: "0.05em",
                borderRadius: "4px",
              }}
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              DAFTAR SEKARANG
            </button>
          </form>

          <p
            className="text-center mt-8"
            style={{
              fontFamily: "var(--font-manrope)",
              fontSize: "0.85rem",
              color: "var(--color-text-muted)",
            }}
          >
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-medium hover:underline"
              style={{ color: "var(--color-primary-val)" }}
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
