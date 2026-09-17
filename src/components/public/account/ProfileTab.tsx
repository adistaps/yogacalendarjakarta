"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2
        style={{
          fontFamily: "var(--font-manrope)",
          fontWeight: 500,
          fontSize: "1.5rem",
          color: "var(--color-text)",
          marginBottom: "1.5rem",
        }}
      >
        Profil Saya
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="namaDepan" className="text-sm text-text mb-1 block">
            Nama Depan
          </Label>
          <Input id="namaDepan" defaultValue="Alya" className="border-gray-200" />
        </div>
        <div>
          <Label htmlFor="namaBelakang" className="text-sm text-text mb-1 block">
            Nama Belakang
          </Label>
          <Input id="namaBelakang" defaultValue="Damar" className="border-gray-200" />
        </div>
        <div>
          <Label htmlFor="email" className="text-sm text-text mb-1 block">
            Email
          </Label>
          <Input id="email" type="email" defaultValue="alya@email.com" className="border-gray-200" />
        </div>
        <div>
          <Label htmlFor="telepon" className="text-sm text-text mb-1 block">
            Nomor Telepon
          </Label>
          <Input id="telepon" defaultValue="+62 812 3456 7890" className="border-gray-200" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="alamat" className="text-sm text-text mb-1 block">
            Alamat
          </Label>
          <Input id="alamat" defaultValue="Jl. Yoga Sehat No. 123, Jakarta Selatan" className="border-gray-200" />
        </div>
        <div>
          <Label htmlFor="kota" className="text-sm text-text mb-1 block">
            Kota
          </Label>
          <Input id="kota" defaultValue="Jakarta Selatan" className="border-gray-200" />
        </div>
        <div>
          <Label htmlFor="tanggalLahir" className="text-sm text-text mb-1 block">
            Tanggal Lahir
          </Label>
          <Input id="tanggalLahir" type="date" defaultValue="1995-06-15" className="border-gray-200" />
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          className="px-6 py-2.5 text-white transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--color-primary-val)",
            fontFamily: "var(--font-manrope)",
            fontWeight: 500,
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
            borderRadius: "4px",
          }}
        >
          SIMPAN PERUBAHAN
        </button>
        <button
          className="px-6 py-2.5 border border-gray-200 hover:bg-gray-50 transition-colors"
          style={{
            fontFamily: "var(--font-manrope)",
            fontWeight: 500,
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
            borderRadius: "4px",
            color: "var(--color-text)",
          }}
        >
          BATAL
        </button>
      </div>
    </div>
  );
}

