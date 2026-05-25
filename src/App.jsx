import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, Line, Legend
} from 'recharts';
import {
  Camera, AlertCircle, FileText, CheckCircle2, Activity, LayoutDashboard, Upload, X, Plus,
  HardHat, Search, Loader2, Edit3, ExternalLink, Building2, ShieldCheck,
  TrendingUp, Banknote, MapPin, Ruler, Trash, Clock, Database, Settings,
  Briefcase, Image as ImageIcon, CalendarDays, MonitorPlay, FileSpreadsheet, FolderEdit,
  Calculator, Save, MapIcon, ArrowLeft, Globe2, Fingerprint, RefreshCw, ArrowUp, ArrowDown,
      Sun, Moon, Users, UserPlus, Eye, EyeOff, Maximize, Minimize, ChevronLeft, ChevronRight, Download, Menu,
      Lock, User, LogOut, Grid, ChevronDown, Bell, ChevronUp
    } from 'lucide-react';

// --- KONSTANTA & KONFIGURASI ---
const SUPABASE_URL = 'https://hnxomovcwwjbtirupnao.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhueG9tb3Zjd3dqYnRpcnVwbmFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTQzMDEsImV4cCI6MjA5MzQ5MDMwMX0.TTqrps9cuHfJKNS-fHNjmrX1nza7Ktp-wDfbIi8Jhlk';

// SQL_QUERY dihapus untuk Keamanan (Mencegah SQL Injection dari frontend)

const INITIAL_AKTIVITAS = [
  { nama: 'Pek. Galian tanah', kemarin: '', hariIni: '', satuan: 'm' },
  { nama: 'Pek. U-Ditch', kemarin: '', hariIni: '', satuan: 'unit' },
  { nama: 'Pek. Beton Readymix', kemarin: '', hariIni: '', satuan: '' },
  { nama: 'Pek. Timbunan/pemadatan tanah', kemarin: '', hariIni: '', satuan: 'm' },
  { nama: 'Pek. Pengecoran opritan', kemarin: '', hariIni: '', satuan: 'm' },
  { nama: 'Pek. Baja manhole', kemarin: '', hariIni: '', satuan: 'unit' },
  { nama: 'Pek. Galian', kemarin: '', hariIni: '', satuan: 'm' },
  { nama: 'Pek. U-ditch crossing', kemarin: '', hariIni: '', satuan: 'unit' },
  { nama: 'Pek. Pengecoran plat saluran', kemarin: '', hariIni: '', satuan: 'm' },
  { nama: 'Pek. Pengecoran jalan', kemarin: '', hariIni: '', satuan: 'm' }
];

const INITIAL_TENAGA_KERJA = [
  { posisi: 'Pengawas Kontraktor', jumlah: '' },
  { posisi: 'Pelaksana Kontraktor', jumlah: '' },
  { posisi: 'Petugas K3', jumlah: '' },
  { posisi: 'Mandor', jumlah: '' },
  { posisi: 'Tukang', jumlah: '' },
  { posisi: 'Pekerja', jumlah: '' },
  { posisi: 'Pengatur Kendaraan (Flagman)', jumlah: '' },
  { posisi: 'Operator Alat', jumlah: '' },
  { posisi: 'Site Engineer', jumlah: '' },
  { posisi: 'Inspector', jumlah: '' }
];

const INITIAL_DINAS_DATA = [
  { type: 'keterangan', role: 'Instansi/SKPD/Owner', name: '', nip: '' },
  { type: 'personil', role: 'Pejabat Pembuat Komitmen (PPK)', name: '', nip: '' },
  { type: 'personil', role: 'Pejabat Pelaksana Teknis Kegiatan (PPTK)', name: '', nip: '' },
  { type: 'personil', role: 'Kuasa Pengguna Anggaran (KPA)', name: '', nip: '' },
  { type: 'personil', role: 'Staf Teknis', name: '', nip: '' },
  { type: 'personil', role: 'Admin', name: '', nip: '' },
  { type: 'personil', role: 'Bendahara', name: '', nip: '' }
];

const initialKontraktorFields = [
  { id: 'k1', label: 'Kegiatan', value: '', type: 'text' },
  { id: 'k2', label: 'Sub Kegiatan', value: '', type: 'text' },
  { id: 'k3', label: 'Pekerjaan', value: '', type: 'text' },
  { id: 'k4', label: 'Lokasi', value: '', type: 'text' },
  { id: 'k5', label: 'Sumber Dana', value: '', type: 'text' },
  { id: 'k6', label: 'Tahun Anggaran', value: '', type: 'text' },
  { id: 'k7', label: 'Nilai Kontrak', value: '', type: 'text' },
  { id: 'k8', label: 'Nomor Kontrak', value: '', type: 'text' },
  { id: 'k9', label: 'Tanggal Kontrak', value: '', type: 'date' },
  { id: 'k10', label: 'Nomor SPMK', value: '', type: 'text' },
  { id: 'k11', label: 'Tanggal SPMK', value: '', type: 'date' },
  { id: 'k12', label: 'Nomor ADD - 01', value: '', type: 'text' },
  { id: 'k13', label: 'Tanggal ADD - 01', value: '', type: 'date' },
  { id: 'k14', label: 'Waktu Pelaksanaan', value: '', type: 'text' },
  { id: 'k15', label: 'Nama Perusahaan', value: '', type: 'text' },
  { id: 'k16', label: 'Nomor DPA SKPD', value: '', type: 'text' },
  { id: 'k17', label: 'Tanggal DPA SKPD', value: '', type: 'date' },
  { id: 'k18', label: 'Direktur', value: '', type: 'text' }
];

const initialKonsultanFields = [
  { id: 'c1', label: 'Program', value: '', type: 'text' },
  { id: 'c2', label: 'Kegiatan', value: '', type: 'text' },
  { id: 'c3', label: 'Sub Kegiatan', value: '', type: 'text' },
  { id: 'c4', label: 'Pekerjaan', value: '', type: 'text' },
  { id: 'c5', label: 'Lokasi', value: '', type: 'text' },
  { id: 'c6', label: 'Sumber Dana', value: '', type: 'text' },
  { id: 'c7', label: 'Tahun Anggaran', value: '', type: 'text' },
  { id: 'c8', label: 'Nilai Kontrak', value: '', type: 'text' },
  { id: 'c9', label: 'Nomor Surat Perjanjian', value: '', type: 'text' },
  { id: 'c10', label: 'Tanggal Surat Perjanjian', value: '', type: 'date' },
  { id: 'c11', label: 'Nomor SPMK', value: '', type: 'text' },
  { id: 'c12', label: 'Tanggal SPMK', value: '', type: 'date' },
  { id: 'c13', label: 'Nomor ADD - 01', value: '', type: 'text' },
  { id: 'c14', label: 'Tanggal ADD - 01', value: '', type: 'date' },
  { id: 'c15', label: 'Waktu Pelaksanaan', value: '', type: 'text' },
  { id: 'c16', label: 'Nama Perusahaan', value: '', type: 'text' },
  { id: 'c17', label: 'Direktur', value: '', type: 'text' }
];

// --- FUNGSI UTILITAS ---
const isVideo = (url) => /\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i.test(url || '');

const toRoman = (num) => {
  const roman = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  let str = '', i = parseInt(num, 10);
  if (isNaN(i)) return num;
  for (let q of Object.keys(roman)) {
    let qN = Math.floor(i / roman[q]);
    i -= qN * roman[q];
    str += q.repeat(qN);
  }
  return str;
};

const buildDynamicFields = (data, initial) => {
  if (data && Array.isArray(data.fields) && data.fields.length > 0) return data.fields;
  return initial;
};

const safeRender = (val, fallback = '-') => {
  if (val === null || val === undefined || val === '') return fallback;
  if (React.isValidElement(val)) return val;
  if (Array.isArray(val)) return val.length > 0 ? val.join(', ') : fallback;
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
};

const findDynamicValue = (data, labels, keys = []) => {
  if (!data || !data.fields) return null;
  const field = data.fields.find(f => {
    const l = String(f.label).toLowerCase();
    return labels.some(kw => l.includes(kw)) || keys.some(kw => String(f.id).toLowerCase().includes(kw));
  });
  return field ? field.value : null;
};

const getSegNameFromLog = (desc) => {
  const match = String(desc || '').match(/data hasil survei untuk (.*?)\.\n/);
  return match && match[1] ? match[1].trim() : 'Segmen';
};

const getFileIconInfo = (filename) => {
  const ext = String(filename || '').split('.').pop().toLowerCase();
  if (ext === 'pdf') return { bg: 'bg-rose-100', color: 'text-rose-600', icon: FileText };
  if (['xls', 'xlsx', 'csv'].includes(ext)) return { bg: 'bg-emerald-100', color: 'text-emerald-600', icon: FileSpreadsheet };
  return { bg: 'bg-blue-100', color: 'text-blue-600', icon: FileText };
};

const compressImage = async (file) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) return resolve(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024; const MAX_HEIGHT = 1024;
        let width = img.width; let height = img.height;
        if (width > height) { if (width > MAX_WIDTH) { height = Math.round((height *= MAX_WIDTH / width)); width = MAX_WIDTH; } } 
        else { if (height > MAX_HEIGHT) { width = Math.round((width *= MAX_HEIGHT / height)); height = MAX_HEIGHT; } }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
        }, 'image/jpeg', 0.6); // Kompresi diperkuat (60%)
      };
    };
  });
};

// --- GENERATOR PDF ---
const generateDailyReportReceipt = async (reportData, projectData, reporterName = 'Admin Command Center') => {
  if (!window.html2canvas || !window.jspdf) return;

  // 1. FORMAT WAKTU KERJA (SHIFTS)
  let waktuStrPDF = '-';
  if (reportData.shifts && reportData.shifts.length > 0) {
      waktuStrPDF = reportData.shifts.map((s, i) => {
          const shiftTitle = reportData.shifts.length > 1 ? `Shift ${i+1}: ` : '';
          if (s.tanggalMulai === s.tanggalSelesai) {
              return `${shiftTitle}${s.jamMulai} - ${s.jamSelesai} WIB`;
          } else {
              return `${shiftTitle}${s.tanggalMulai} (${s.jamMulai}) s/d ${s.tanggalSelesai} (${s.jamSelesai})`;
          }
      }).join('<br/>');
  }

  // 2. FORMAT AKTIVITAS PEKERJAAN
  const aktivitasTerisi = (reportData.aktivitas || []).filter(act => 
     (act.kemarin && act.kemarin.toString().trim() !== '0' && act.kemarin.toString().trim() !== '') || 
     (act.hariIni && act.hariIni.toString().trim() !== '0' && act.hariIni.toString().trim() !== '') ||
     (act.nama && act.nama.trim() !== '') 
  );
  const aktivitasRows = aktivitasTerisi.map((act, i) => {
    const k = parseFloat(act.kemarin) || 0;
        const h = parseFloat(act.hariIni) || 0;
        return `<tr>
          <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center;">${i + 1}</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1;">${act.nama}</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center;">${k}</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center;">${h}</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${k + h}</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center;">${act.satuan || ''}</td>
        </tr>`;
      }).join('');

  // 3. FORMAT KONDISI CUACA (3 KOLOM)
  const cuacaKeys = Object.keys(reportData.cuaca || {});
  let cuacaRows3Col = '';
  
  for (let i = 0; i < cuacaKeys.length; i += 3) {
    const jam1 = cuacaKeys[i] || ''; const stat1 = jam1 ? reportData.cuaca[jam1] : '';
    const jam2 = cuacaKeys[i + 1] || ''; const stat2 = jam2 ? reportData.cuaca[jam2] : '';
    const jam3 = cuacaKeys[i + 2] || ''; const stat3 = jam3 ? reportData.cuaca[jam3] : '';
    
    cuacaRows3Col += `<tr>
      <td style="padding: 4px; border: 1px solid #cbd5e1; text-align: center;">${jam1}</td>
      <td style="padding: 4px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${stat1}</td>
      <td style="padding: 4px; border: 1px solid #cbd5e1; text-align: center;">${jam2}</td>
      <td style="padding: 4px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${stat2}</td>
      <td style="padding: 4px; border: 1px solid #cbd5e1; text-align: center;">${jam3}</td>
      <td style="padding: 4px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${stat3}</td>
    </tr>`;
  }

  // 4. FORMAT TENAGA KERJA (2 KOLOM)
  let tkValid = [];
  if (Array.isArray(reportData.tenagaKerja)) {
      tkValid = reportData.tenagaKerja.filter(tk => tk.posisi && tk.posisi.trim() !== '');
  } else if (typeof reportData.tenagaKerja === 'object') {
      // Menangani format data lama
      tkValid = Object.keys(reportData.tenagaKerja || {}).map(k => ({ posisi: k, jumlah: reportData.tenagaKerja[k] }));
  }

  const halfTk = Math.ceil(tkValid.length / 2);
  const tkLeft = tkValid.slice(0, halfTk);
  const tkRight = tkValid.slice(halfTk);

  let tkRows2Col = '';
  for (let i = 0; i < tkLeft.length; i++) {
    const posL = tkLeft[i].posisi; const countL = tkLeft[i].jumlah || 0;
    const posR = tkRight[i] ? tkRight[i].posisi : ''; const countR = tkRight[i] ? (tkRight[i].jumlah || 0) : '';
    tkRows2Col += `<tr>
      <td style="padding: 4px 6px; border: 1px solid #cbd5e1;">${posL}</td>
      <td style="padding: 4px 6px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${countL} Orang</td>
      <td style="padding: 4px 6px; border: 1px solid #cbd5e1;">${posR}</td>
      <td style="padding: 4px 6px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${posR ? countR + ' Orang' : ''}</td>
    </tr>`;
  }

  // 5. MEMBUAT ELEMEN HTML VIRTUAL
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px'; 
  container.style.backgroundColor = '#ffffff';
  container.style.padding = '10px'; 
  container.style.color = '#1e293b';

  container.innerHTML = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.5;">
      <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #1e293b; padding-bottom: 15px;">
        <h1 style="margin: 0; font-size: 24px; color: #0f172a; text-transform: uppercase; font-weight: 900;">LAPORAN HARIAN PROYEK</h1>
        <p style="margin: 5px 0 0; font-size: 14px; font-weight: bold; color: #475569;">${projectData?.pekerjaan || reportData.lokasi}</p>
      </div>

      <table style="width: 100%; margin-bottom: 20px; font-size: 13px;">
        <tr>
          <td style="width: 15%; font-weight: bold;">Tanggal</td><td style="width: 35%;">: ${reportData.tanggal}</td>
          <td style="width: 15%; font-weight: bold;">Pelapor</td><td style="width: 35%;">: ${reporterName}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; vertical-align: top;">Waktu Kerja</td><td style="vertical-align: top;">: ${waktuStrPDF}</td>
          <td style="font-weight: bold; vertical-align: top;">Lokasi</td><td style="vertical-align: top;">: ${reportData.lokasi || '-'}</td>
        </tr>
      </table>

      <h3 style="font-size: 14px; background-color: #f8fafc; padding: 6px 10px; margin: 15px 0 10px 0; border-left: 4px solid #3b82f6;">A. KONDISI CUACA</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 15px;">
        <tr style="background-color: #e2e8f0;">
          <th style="padding: 4px; border: 1px solid #cbd5e1; width: 16.6%;">Waktu (Jam)</th>
          <th style="padding: 4px; border: 1px solid #cbd5e1; width: 16.6%;">Status</th>
          <th style="padding: 4px; border: 1px solid #cbd5e1; width: 16.6%;">Waktu (Jam)</th>
          <th style="padding: 4px; border: 1px solid #cbd5e1; width: 16.6%;">Status</th>
          <th style="padding: 4px; border: 1px solid #cbd5e1; width: 16.6%;">Waktu (Jam)</th>
          <th style="padding: 4px; border: 1px solid #cbd5e1; width: 16.6%;">Status</th>
        </tr>
        ${cuacaRows3Col}
      </table>

      <h3 style="font-size: 14px; background-color: #f8fafc; padding: 6px 10px; margin: 15px 0 10px 0; border-left: 4px solid #3b82f6;">B. AKTIVITAS PEKERJAAN</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 15px;">
        <tr style="background-color: #e2e8f0;">
          <th style="padding: 6px; border: 1px solid #cbd5e1; width: 5%;">No</th>
          <th style="padding: 6px; border: 1px solid #cbd5e1; width: 43%;">Item Pekerjaan</th>
          <th style="padding: 6px; border: 1px solid #cbd5e1; width: 13%;">Vol Kemarin</th>
          <th style="padding: 6px; border: 1px solid #cbd5e1; width: 13%;">Vol Hari Ini</th>
          <th style="padding: 6px; border: 1px solid #cbd5e1; width: 13%;">Total Vol</th>
          <th style="padding: 6px; border: 1px solid #cbd5e1; width: 13%;">Satuan</th>
        </tr>
        ${aktivitasRows || `<tr><td colspan="6" style="padding: 10px; border: 1px solid #cbd5e1; text-align: center; color: #64748b;">Tidak ada aktivitas pekerjaan yang dilaporkan</td></tr>`}
      </table>

      <h3 style="font-size: 14px; background-color: #f8fafc; padding: 6px 10px; margin: 15px 0 10px 0; border-left: 4px solid #3b82f6;">C. JUMLAH TENAGA KERJA</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 15px;">
        <tr style="background-color: #e2e8f0;">
          <th style="padding: 4px; border: 1px solid #cbd5e1; width: 35%;">Posisi / Jabatan</th>
          <th style="padding: 4px; border: 1px solid #cbd5e1; width: 15%;">Jumlah</th>
          <th style="padding: 4px; border: 1px solid #cbd5e1; width: 35%;">Posisi / Jabatan</th>
          <th style="padding: 4px; border: 1px solid #cbd5e1; width: 15%;">Jumlah</th>
        </tr>
        ${tkRows2Col || `<tr><td colspan="4" style="padding: 10px; border: 1px solid #cbd5e1; text-align: center; color: #64748b;">Tidak ada tenaga kerja yang diinput</td></tr>`}
      </table>

      <h3 style="font-size: 14px; background-color: #f8fafc; padding: 6px 10px; margin: 15px 0 10px 0; border-left: 4px solid #3b82f6;">D. CATATAN / KENDALA / SARAN</h3>
      <div style="border: 1px solid #cbd5e1; padding: 15px; font-size: 12px; min-height: 60px; background-color: #f8fafc;">
        ${reportData.catatan ? reportData.catatan.replace(/\n/g, '<br/>') : '<i>Tidak ada catatan, kendala, atau saran.</i>'}
      </div>
      
      <div style="margin-top: 25px; text-align: right; padding-right: 20px;">
          <p style="margin: 0; font-size: 12px;">Dilaporkan Oleh,</p>
          <p style="margin: 0; font-weight: bold; text-decoration: underline;">${reporterName}</p>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // 6. RENDER & CETAK PDF (FIT TO 1 PAGE)
  try {
    await new Promise(r => setTimeout(r, 500)); // Beri waktu DOM untuk render
    
    // MENGURANGI SCALE & MENGGUNAKAN KOMPRESI AGAR FILE TIDAK BENGKAK
    const canvas = await window.html2canvas(container, { scale: 1.5, useCORS: true, logging: false });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const marginX = 10;
    const marginTop = 5; 
    const marginBottom = 10;
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    const maxPdfWidth = pageWidth - (marginX * 2);
    const maxPdfHeight = pageHeight - (marginTop + marginBottom); 
    
    let pdfWidth = maxPdfWidth;
    let pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    if (pdfHeight > maxPdfHeight) {
        pdfHeight = maxPdfHeight;
        pdfWidth = (canvas.width * pdfHeight) / canvas.height;
    }
    
    const xOffset = marginX + (maxPdfWidth - pdfWidth) / 2;

    // MENGUBAH FORMAT DARI PNG KE JPEG DENGAN KUALITAS 0.8 (80%) UNTUK KOMPRESI MAKSIMAL
    const imgData = canvas.toDataURL('image/jpeg', 0.8);
    pdf.addImage(imgData, 'JPEG', xOffset, marginTop, pdfWidth, pdfHeight);
    
    pdf.save(`Laporan_Harian_${reporterName.replace(/\s+/g, '_')}_${reportData.tanggal}.pdf`);
    
  } catch (err) {
    console.error("Gagal cetak PDF:", err);
  } finally {
    document.body.removeChild(container);
  }
};

// --- KOMPONEN WIDGET KECIL ---
const SurveyDetailRow = ({ label, value, isEven }) => (
  <div className={`flex flex-col sm:flex-row py-3 px-6 border-b border-slate-100 last:border-0 ${isEven ? 'bg-slate-50/50' : 'bg-white'}`}>
    <div className="w-full sm:w-1/3 mb-1 sm:mb-0 pr-4">
      <span className="text-[11px] font-bold text-slate-500 uppercase">{label}</span>
    </div>
    <div className="w-full sm:w-2/3 flex flex-col sm:pl-4 sm:border-l sm:border-slate-200/60">
      <span className="text-sm font-bold text-slate-800">{value}</span>
    </div>
  </div>
);

const SurveyInputRow = ({ label, children }) => (
  <div>
    <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-500">{label}</label>
    {children}
  </div>
);

const PdfThumbnail = () => (
  <div className="flex flex-col items-center justify-center w-full h-full text-rose-500">
    <FileText size={48} className="mb-2 opacity-80" />
    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">PDF Document</span>
  </div>
);

const PdfThumbnailReal = ({ fileUrl }) => {
  const canvasRef = useRef(null);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let renderTask = null;
    let isMounted = true;

    const renderPdf = async () => {
      if (!window.pdfjsLib || !fileUrl) {
        if (isMounted) setError(true);
        return;
      }
      try {
        const loadingTask = window.pdfjsLib.getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const desiredWidth = 400; // Resolusi thumbnail
        const viewport = page.getViewport({ scale: 1 });
        const scale = desiredWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        const context = canvas.getContext('2d');
        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport
        };
        
        renderTask = page.render(renderContext);
        await renderTask.promise;
        if (isMounted) setLoaded(true);
      } catch (err) {
        if (err?.name === 'RenderingCancelledException' || err?.message?.includes('cancelled')) {
          return; // Abaikan error pembatalan render saat komponen unmount
        }
        console.error("Gagal memuat PDF Thumbnail:", err);
        if (isMounted) setError(true);
      }
    };

    // Retry mechanism in case pdfjsLib is not loaded yet
    const checkAndRender = () => {
       if (window.pdfjsLib) {
          renderPdf();
       } else {
          setTimeout(checkAndRender, 500);
       }
    };
    
    checkAndRender();

    return () => {
      isMounted = false;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [fileUrl]);

  if (error) return <PdfThumbnail />;

  return (
    <>
      {!loaded && <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400"><Loader2 className="animate-spin mb-2" size={24} /><span className="text-[9px] font-bold uppercase tracking-widest">Loading...</span></div>}
      <canvas ref={canvasRef} className={`w-full h-full object-cover object-top transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`} />
    </>
  );
};

const CircularStatCard = ({ icon: Icon, label, percentage, trend, isPositive, subContent, dropShadowColor }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const safePercentage = isNaN(Number(percentage)) ? 0 : Number(percentage);
  const strokeDashoffset = circumference - (safePercentage / 100) * circumference;
  const shadowClass = dropShadowColor === 'emerald' ? 'drop-shadow-[0_2px_4px_rgba(16,185,129,0.9)]' : 'drop-shadow-[0_2px_4px_rgba(59,130,246,0.9)]';
  const strokeColor = dropShadowColor === 'emerald' ? '#10b981' : '#3b82f6';

  return (
    <div className="bg-white p-4 md:p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center relative h-full hover:shadow-md hover:-translate-y-1.5 transition-all duration-500 group overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[40px] opacity-10 transition-opacity duration-700 group-hover:opacity-30 -mr-8 -mt-8 pointer-events-none ${dropShadowColor === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
      <div className="flex justify-between items-start w-full mb-1 relative z-10 text-left">
        <span className="text-slate-400 text-[11px] md:text-xs uppercase font-bold tracking-wider leading-tight mt-1">{String(label || '')}</span>
        <div className={`p-1.5 rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 shadow-sm ${dropShadowColor === 'emerald' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100/50' : 'bg-blue-50 text-blue-600 border border-blue-100/50'}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
      <div className="relative flex items-center justify-center flex-1 w-full my-1 z-10">
        <svg viewBox="0 0 100 100" className={`transform -rotate-90 w-28 h-28 md:w-36 md:h-36 ${shadowClass} transition-transform duration-700 group-hover:scale-105`}>
          <circle cx="50" cy="50" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="transparent" strokeLinecap="round" />
          <circle cx="50" cy="50" r={radius} stroke={strokeColor} strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1500 ease-out" />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <div className="flex items-center gap-0.5 drop-shadow-sm">
            {trend !== undefined && <span className={isPositive ? "text-emerald-500 text-[10px] md:text-xs" : "text-rose-500 text-[10px] md:text-xs"}>{isPositive ? '▲' : '▼'}</span>}
            <span className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">{safePercentage.toFixed(0)}<span className="text-lg md:text-xl text-slate-800 font-bold ml-0.5">%</span></span>
          </div>
        </div>
      </div>
      <div className="mt-auto w-full relative z-10 pt-2">{subContent}</div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, sub, status, centered }) => (
  <div className={`bg-white p-4 md:p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col relative h-full hover:shadow-md hover:-translate-y-1.5 transition-all duration-500 group overflow-hidden text-left ${centered ? 'items-center text-center' : ''}`}>
    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[40px] opacity-10 transition-opacity duration-700 group-hover:opacity-30 -mr-8 -mt-8 pointer-events-none ${status === 'good' ? 'bg-emerald-500' : status === 'warning' ? 'bg-rose-500' : 'bg-slate-500'}`}></div>
    <div className="flex justify-between items-start w-full mb-2 relative z-10">
      <span className="text-slate-400 text-[11px] md:text-xs uppercase font-bold tracking-wider leading-tight mt-1">{String(label || '')}</span>
      <div className="p-1.5 rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 shadow-sm bg-slate-50 text-slate-500 border border-slate-100/80">
        <Icon size={20} strokeWidth={2.5} />
      </div>
    </div>
    <div className="mt-1 flex flex-col items-center justify-center flex-1 w-full relative z-10">
      <h3 className="font-bold text-slate-800 tracking-tight leading-tight transition-transform duration-500 group-hover:scale-105 text-center flex flex-col items-center w-full">
        {typeof value === 'string' && value.includes('\n') ? (
          <>
            <span className="text-4xl md:text-5xl leading-none text-slate-800 font-bold">{value.split('\n')[0]}</span>
            <span className="text-sm md:text-base mt-2 text-slate-800 tracking-normal w-full px-2 font-bold">{value.split('\n')[1]}</span>
          </>
        ) : (
          <span className="text-4xl md:text-5xl text-slate-800 font-bold">{safeRender(value)}</span>
        )}
      </h3>
    </div>
    <div className="mt-auto w-full relative z-10 pt-3">
      <div className="text-[11px] md:text-xs font-semibold flex flex-col items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100 w-full text-center">
        <div className="shrink-0">{status === 'warning' && <span className="block w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />}{status === 'good' && <span className="block w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />}{status === 'neutral' && <span className="block w-2.5 h-2.5 rounded-full bg-slate-300" />}</div>
        <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">{safeRender(sub, '')}</div>
      </div>
    </div>
  </div>
);

const FeedItem = ({ item, onView, onDelete, isUnread }) => {
  const isProblem = item.is_problem;
  const timeStr = new Date(item.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  const isToday = new Date().toDateString() === new Date(item.created_at).toDateString();
  const timeDisplay = isToday ? `Hari Ini, ${timeStr.split(' ')[0]}` : new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

  // Mengubah enter menjadi bullet (•) agar rapi dalam 1 baris
  const cleanDesc = (item.description || 'Tidak ada keterangan').replace(/\n/g, ' • ');
  const hasMedia = !!item.media_url;
  const firstMediaUrl = hasMedia ? String(item.media_url).split(',')[0] : '';
  const mediaCount = hasMedia ? String(item.media_url).split(',').length : 0;

  return (
    <div onClick={() => onView(item)} className={`py-3.5 group relative flex items-start gap-3 transition-all px-2 -mx-2 hover:bg-slate-50/80 rounded-xl cursor-pointer ${isUnread ? 'bg-blue-50/40 border border-blue-100/50 shadow-sm mb-1' : ''}`}>
      
      {/* Ikon Tipe Aktivitas atau Thumbnail Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 border shadow-sm overflow-hidden ${isProblem ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-blue-50 border-blue-100 text-blue-500'}`}>
         {hasMedia ? (
             isVideo(firstMediaUrl) ? (
                 <div className="w-full h-full bg-slate-800 flex items-center justify-center"><MonitorPlay size={14} className="text-white" /></div>
             ) : (
                 <img src={firstMediaUrl} alt="thumb" className="w-full h-full object-cover" />
             )
         ) : (
             isProblem ? <AlertCircle size={14} /> : <FileText size={14} />
         )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5 gap-2 pr-6">
          <h4 className={`text-xs font-bold truncate flex items-center ${isProblem ? 'text-rose-600' : 'text-slate-800 group-hover:text-blue-600 transition-colors'}`}>
            {item.title}
            {isUnread && <span className="ml-2 inline-block px-1.5 py-[2px] bg-rose-500 text-white text-[8px] font-black uppercase tracking-wider rounded-md shadow-sm animate-pulse">Baru</span>}
          </h4>
          <div className="shrink-0 text-[9px] font-semibold text-slate-400">{timeDisplay}</div>
        </div>
        
        {/* Teks Deskripsi hanya 1 baris */}
        <p className="text-[11px] text-slate-500 font-medium truncate pr-6">{cleanDesc}</p>

        {/* Thumbnail Preview Gambar di Dalam Log */}
        {hasMedia && (
          <div className="mt-2.5 flex items-center gap-3">
             <div className="h-16 w-24 rounded-lg overflow-hidden border border-slate-200 shadow-sm relative bg-slate-100">
                {isVideo(firstMediaUrl) ? (
                   <>
                     <video src={firstMediaUrl} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 flex items-center justify-center bg-black/20"><MonitorPlay size={16} className="text-white drop-shadow-md" /></div>
                   </>
                ) : (
                   <img src={firstMediaUrl} alt="Lampiran" className="w-full h-full object-cover" />
                )}
                {mediaCount > 1 && (
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold backdrop-blur-[1px]">
                      +{mediaCount - 1}
                   </div>
                )}
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                  <ImageIcon size={12} className="text-blue-500" /> {mediaCount > 1 ? `${mediaCount} Lampiran` : 'Ada Lampiran'}
                </span>
                <span className="text-[9px] text-slate-400 font-bold mt-0.5">Klik untuk melihat detail</span>
             </div>
          </div>
        )}
      </div>

      {onDelete && (
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="absolute top-3.5 right-2 p-1.5 bg-white shadow-sm border border-rose-100 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 hover:scale-110 z-10" title="Hapus Log">
          <Trash size={12} />
        </button>
      )}
    </div>
  );
};

const SChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const planObj = payload.find(p => p.dataKey === 'r');
    const actualObj = payload.find(p => p.dataKey === 'a');
    const plan = planObj && planObj.value !== undefined ? planObj.value : 0;
    const hasActual = actualObj && actualObj.value !== null && actualObj.value !== undefined && actualObj.value !== '';
    const actual = hasActual ? actualObj.value : null;
    const dev = hasActual ? (actual - plan).toFixed(2) : '0.00';
    const devColor = hasActual && actual >= plan ? 'text-emerald-500' : 'text-rose-500';
    const devSign = hasActual && actual > plan ? '+' : '';

    let displayLabel = typeof label === 'object' ? JSON.stringify(label) : String(label || '');
    if (displayLabel.startsWith('M') || displayLabel.startsWith('W')) displayLabel = `Minggu Ke-${displayLabel.substring(1)}`;

    return (
      <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] text-left z-50 relative">
        <p className="text-sm font-bold text-slate-800 mb-3 tracking-widest border-b border-slate-100 pb-2 uppercase">{displayLabel}</p>
        <div className="space-y-2">
          <div className="flex justify-between gap-8 text-xs"><span className="text-slate-500 font-normal uppercase tracking-tighter">Rencana:</span><span className="font-normal text-slate-700">{Number(plan).toFixed(2)}%</span></div>
          {hasActual ? (
            <>
              <div className="flex justify-between gap-8 text-xs"><span className="text-blue-500 font-normal uppercase tracking-tighter">Progres:</span><span className="font-normal text-slate-800">{Number(actual).toFixed(2)}%</span></div>
              <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between gap-8 text-xs"><span className="text-slate-500 font-normal uppercase tracking-tighter">Deviasi:</span><span className={`font-medium ${devColor}`}>{devSign}{dev}%</span></div>
            </>
          ) : (<div className="pt-2 mt-2 border-t border-slate-100 flex justify-between gap-8 text-xs"><span className="text-slate-400 font-normal uppercase tracking-tighter italic">Progres belum diupdate</span></div>)}
        </div>
      </div>
    );
  }
  return null;
};

const AutoResizeTextarea = ({ value, onChange, placeholder, className }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = (textareaRef.current.scrollHeight + 2) + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className={`${className} resize-none overflow-hidden block`}
      rows={1}
    />
  );
};

// --- KOMPONEN VIEW KHUSUS ---
const AbsensiView = ({ attendances, onBack, onDelete, isProcessing, onRefresh, employees, setEmployeeForm, setShowEmployeeModal, setDeleteConfig }) => {
  const [deleteConfigAbsensi, setDeleteConfigAbsensi] = useState(null);
  const [activeTab, setActiveTab] = useState('log');
  
  // State untuk Tab Rekap
  const [filterMonth, setFilterMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const handleDeleteAbsensi = async () => {
    if (!deleteConfigAbsensi) return;
    await onDelete(deleteConfigAbsensi.id);
    setDeleteConfigAbsensi(null);
  };

  // --- LOGIKA REKAPITULASI OTOMATIS ---
  const rekapData = useMemo(() => {
    if (!filterMonth || !employees) return [];
    
    const [year, month] = filterMonth.split('-');
    const targetMonth = parseInt(month, 10) - 1; // 0-indexed
    const targetYear = parseInt(year, 10);

    // 1. Buat kerangka dasar dari master karyawan
    const rekapMap = new Map();
    employees.forEach(emp => {
      rekapMap.set(emp.name, {
        ...emp,
        hadir: 0,
        terlambat: 0,
        tepatWaktu: 0,
        pulangAwal: 0
      });
    });

    // 2. Loop semua data absensi dan cocokkan
    (attendances || []).forEach(abs => {
      if (!abs.check_in_time) return;
      const absDate = new Date(abs.check_in_time);
      
      if (absDate.getMonth() === targetMonth && absDate.getFullYear() === targetYear) {
         const empName = abs.employee_name;
         if (rekapMap.has(empName)) {
            const current = rekapMap.get(empName);
            current.hadir += 1;
            if (String(abs.status || '').includes('Terlambat')) current.terlambat += 1;
            if (String(abs.status || '').includes('Masuk - Tepat Waktu')) current.tepatWaktu += 1;
            if (String(abs.status || '').includes('Lebih Awal')) current.pulangAwal += 1;
         } else {
            // Jika ada data absen tapi orangnya sudah dihapus dari master (Opsional ditampilkan)
            rekapMap.set(empName, {
              employee_id: 'N/A', name: empName, role: abs.role || 'N/A',
              hadir: 1,
              terlambat: String(abs.status || '').includes('Terlambat') ? 1 : 0,
              tepatWaktu: String(abs.status || '').includes('Masuk - Tepat Waktu') ? 1 : 0,
              pulangAwal: String(abs.status || '').includes('Lebih Awal') ? 1 : 0
            });
         }
      }
    });

    return Array.from(rekapMap.values());
  }, [attendances, employees, filterMonth]);

  // Ekspor ke CSV / Excel
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID Karyawan,Nama Lengkap,Jabatan,Total Hadir (Hari),Masuk Tepat Waktu,Terlambat,Pulang Lebih Awal\n";
    
    rekapData.forEach(r => {
      csvContent += `"${r.employee_id}","${r.name}","${r.role}",${r.hadir},${r.tepatWaktu},${r.terlambat},${r.pulangAwal}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Absen_${filterMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans relative">
      {/* Modal Konfirmasi Hapus Khusus Absensi */}
      {deleteConfigAbsensi && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative text-center">
            <div className="mx-auto w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-5"><AlertCircle size={28} /></div>
            <h3 className="text-xl font-black mb-2 text-slate-800">Apakah Anda Yakin?</h3>
            <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed">Data absensi atas nama <b>{deleteConfigAbsensi.name}</b> ini akan dihapus secara permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfigAbsensi(null)} className="flex-1 py-3.5 bg-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">Batal</button>
              <button onClick={handleDeleteAbsensi} disabled={isProcessing} className="flex-1 py-3.5 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors shadow-md">{isProcessing ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Ya, Hapus'}</button>
            </div>
          </div>
        </div>
      )}

      <header className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-white shrink-0 z-10 shadow-sm relative">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors" title="Kembali">
            <ArrowLeft size={20} />
          </button>
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Fingerprint size={24} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 leading-none">HR & PERSONALIA</h1>
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">REKAPITULASI ABSENSI & DATA KARYAWAN</p>
          </div>
        </div>
        <button onClick={onRefresh} disabled={isProcessing} className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl border border-blue-100 transition-colors flex items-center gap-2 shadow-sm" title="Segarkan Data Terkini">
           <RefreshCw size={20} className={isProcessing ? "animate-spin" : ""} />
           <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">Refresh</span>
        </button>
      </header>

      <div className="bg-white border-b border-slate-200 px-6 sm:px-10 flex gap-6 shrink-0 shadow-sm relative z-0 overflow-x-auto custom-scrollbar">
        <button onClick={() => setActiveTab('log')} className={`py-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'log' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}><Clock size={16}/> Log Kehadiran</button>
        <button onClick={() => setActiveTab('rekap')} className={`py-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'rekap' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}><FileSpreadsheet size={16}/> Rekap & Laporan</button>
        <button onClick={() => setActiveTab('karyawan')} className={`py-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'karyawan' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}><Users size={16}/> Master Karyawan</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm flex flex-col max-w-6xl mx-auto overflow-hidden min-h-[60vh]">
          
          {activeTab === 'log' && (
            <>
              <div className="p-6 md:p-8 border-b border-slate-100 bg-[#f8fafc] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><Clock className="text-emerald-500"/> Log Kehadiran Karyawan</h3>
                  <p className="text-xs text-slate-500 font-bold mt-1">Real-time dari Aplikasi Mobile Karyawan</p>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                   Sinkronisasi Aktif
                </div>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                      <th className="p-4 pl-6">Karyawan</th>
                      <th className="p-4 text-center">Posisi Lokasi</th>
                      <th className="p-4 text-center">Jam Masuk</th>
                      <th className="p-4 text-center">Jam Pulang</th>
                      <th className="p-4 text-center">Aksi / Maps</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(attendances || []).length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-16">
                           <div className="flex flex-col items-center justify-center text-slate-400">
                             <Clock size={40} className="mb-3 opacity-20"/>
                             <span className="text-sm font-bold">Belum ada data kehadiran.</span>
                           </div>
                        </td>
                      </tr>
                    ) : (
                      (attendances || []).map((abs) => (
                        <tr key={abs.id} className="hover:bg-slate-50/80 transition-all group">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black shadow-sm shrink-0 border ${abs.location_type === 'Kantor Pusat' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                 {String(abs.employee_name || 'U').charAt(0).toUpperCase()}
                               </div>
                               <div className="flex flex-col">
                                 <div className="font-black text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{safeRender(abs.employee_name)}</div>
                                 <div className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-wide">{safeRender(abs.role)}</div>
                               </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col items-center justify-center">
                               <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest mb-1.5 shadow-sm border ${abs.location_type === 'Kantor Pusat' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                                  <MapPin size={10} className="inline mr-1 -mt-0.5" />
                                  {safeRender(abs.location_type)}
                               </span>
                               <span className="text-[10px] font-bold text-slate-600 line-clamp-1 text-center max-w-[150px]" title={abs.location_name}>{safeRender(abs.location_name)}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            {abs.check_in_time ? (
                              <div className="flex flex-col items-center">
                                <span className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                                   <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>
                                   {new Date(abs.check_in_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')} <span className="text-[9px] text-slate-400">WIB</span>
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{new Date(abs.check_in_time).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                {String(abs.status || '').includes('Terlambat') && (
                                  <span className="mt-1.5 px-2 py-0.5 bg-rose-100 text-rose-600 border border-rose-200 text-[8px] font-black uppercase rounded shadow-sm">Terlambat</span>
                                )}
                                {String(abs.status || '').includes('Masuk - Tepat Waktu') && (
                                  <span className="mt-1.5 px-2 py-0.5 bg-emerald-100 text-emerald-600 border border-emerald-200 text-[8px] font-black uppercase rounded shadow-sm">Tepat Waktu</span>
                                )}
                              </div>
                            ) : (
                              <span className="bg-rose-50 text-rose-500 border border-rose-100 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-sm">Tidak Absen</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {abs.check_out_time ? (
                              <div className="flex flex-col items-center">
                                <span className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                                   <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                                   {new Date(abs.check_out_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')} <span className="text-[9px] text-slate-400">WIB</span>
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{new Date(abs.check_out_time).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                {String(abs.status || '').includes('Lebih Awal') && (
                                  <span className="mt-1.5 px-2 py-0.5 bg-amber-100 text-amber-600 border border-amber-200 text-[8px] font-black uppercase rounded shadow-sm">Lebih Awal</span>
                                )}
                                {String(abs.status || '').includes('Pulang - Tepat Waktu') && (
                                  <span className="mt-1.5 px-2 py-0.5 bg-blue-100 text-blue-600 border border-blue-200 text-[8px] font-black uppercase rounded shadow-sm">Tepat Waktu</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-2xl font-black text-slate-300">-</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {abs.latitude && abs.longitude && (
                                <a href={`https://www.google.com/maps/search/?api=1&query=${abs.latitude},${abs.longitude}`} target="_blank" rel="noopener noreferrer" className="inline-flex p-2 bg-slate-50 border border-slate-200 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl transition-colors shadow-sm" title="Lihat di Maps">
                                   <MapPin size={16}/>
                                </a>
                              )}
                              <button 
                                onClick={() => setDeleteConfigAbsensi({ id: abs.id, name: abs.employee_name })} 
                                className="inline-flex p-2 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-500 hover:text-rose-700 rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100" 
                                title="Hapus Data Absen"
                              >
                                 <Trash size={16}/>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'rekap' && (
            <>
              <div className="p-6 md:p-8 border-b border-slate-100 bg-[#f8fafc] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><FileSpreadsheet className="text-amber-500"/> Laporan Kehadiran Bulanan</h3>
                  <p className="text-xs text-slate-500 font-bold mt-1">Rekap otomatis absensi karyawan untuk keperluan Payroll / Penggajian</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                   <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm flex-1">
                      <CalendarDays size={16} className="text-slate-400" />
                      <input 
                         type="month" 
                         value={filterMonth} 
                         onChange={e => setFilterMonth(e.target.value)}
                         className="bg-transparent outline-none text-xs font-black text-slate-700 w-full"
                      />
                   </div>
                   <button 
                      onClick={handleExportCSV} 
                      className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase shadow-sm hover:bg-emerald-700 transition-colors shrink-0"
                      title="Unduh format Excel / CSV"
                   >
                      <Upload size={16} /> <span className="hidden sm:inline">Export CSV</span>
                   </button>
                </div>
              </div>

              <div className="overflow-x-auto w-full custom-scrollbar flex-1">
                <table className="w-full text-left border-collapse min-w-[800px]">
                   <thead className="bg-slate-50 border-b border-slate-200">
                     <tr className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                        <th className="p-4 pl-6 w-12 text-center">No</th>
                        <th className="p-4">Karyawan</th>
                        <th className="p-4 text-center">Total Hadir</th>
                        <th className="p-4 text-center">Masuk Tepat Waktu</th>
                        <th className="p-4 text-center text-rose-500">Terlambat Masuk</th>
                        <th className="p-4 text-center text-amber-500">Pulang Lebih Awal</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {rekapData.length === 0 ? (
                         <tr><td colSpan="6" className="p-12 text-center text-slate-400 font-bold text-xs">Belum ada rekap kehadiran di bulan ini.</td></tr>
                      ) : (
                         rekapData.map((rek, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                               <td className="p-4 pl-6 font-bold text-slate-400 text-xs text-center">{idx + 1}</td>
                               <td className="p-4">
                                  <div className="font-bold text-slate-800 text-sm">{rek.name}</div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{rek.employee_id}</span>
                                     <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{rek.role}</span>
                                  </div>
                               </td>
                               <td className="p-4 text-center">
                                 <span className="font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                                   {rek.hadir} <span className="text-[10px] uppercase font-bold text-blue-400 ml-1">Hari</span>
                                 </span>
                               </td>
                               <td className="p-4 text-center font-bold text-slate-700">{rek.tepatWaktu}</td>
                               <td className="p-4 text-center font-bold text-rose-600 bg-rose-50/30">{rek.terlambat}</td>
                               <td className="p-4 text-center font-bold text-amber-600 bg-amber-50/30">{rek.pulangAwal}</td>
                            </tr>
                         ))
                      )}
                   </tbody>
                </table>
              </div>
              {rekapData.length > 0 && (
                 <div className="p-4 bg-slate-50 border-t border-slate-200 text-[10px] font-bold text-slate-500 text-center uppercase tracking-widest">
                    Laporan ini di-generate otomatis secara Real-Time berdasarkan Log Kehadiran Aplikasi Mobile.
                 </div>
              )}
            </>
          )}

          {activeTab === 'karyawan' && (
            <>
              <div className="p-6 md:p-8 border-b border-slate-100 bg-[#f8fafc] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><Users className="text-blue-500"/> Daftar Karyawan</h3>
                  <p className="text-xs text-slate-500 font-bold mt-1">Kelola data personil & akses login aplikasi mobile</p>
                </div>
                <button onClick={() => { setEmployeeForm({ id: null, employee_id: '', name: '', role: 'Pelaksana', pin: '' }); setShowEmployeeModal(true); }} className="bg-blue-600 text-white px-4 py-3 rounded-2xl flex items-center gap-2 text-[10px] font-bold uppercase shadow-sm hover:bg-blue-700 transition-colors">
                   <UserPlus size={16} /> <span className="hidden sm:inline">Tambah Karyawan</span>
                </button>
              </div>

              <div className="overflow-x-auto w-full custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[600px]">
                   <thead className="bg-slate-50 border-b border-slate-200">
                     <tr className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                        <th className="p-4 pl-6 w-32">ID Karyawan</th>
                        <th className="p-4">Nama Lengkap</th>
                        <th className="p-4">Jabatan / Role</th>
                        <th className="p-4 text-center">PIN Akses</th>
                        <th className="p-4 text-center w-28">Aksi</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {employees.length === 0 ? (
                         <tr><td colSpan="5" className="p-12 text-center text-slate-400 font-bold text-xs">Belum ada data karyawan terdaftar.<br/>Klik tombol "Tambah Karyawan" untuk menambahkan personil.</td></tr>
                      ) : (
                         employees.map(emp => (
                            <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                               <td className="p-4 pl-6 font-black text-slate-700 text-xs">{emp.employee_id}</td>
                               <td className="p-4 font-bold text-slate-800 text-sm">{emp.name}</td>
                               <td className="p-4"><span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-200">{emp.role}</span></td>
                               <td className="p-4 text-center">
                                 <span className="font-mono text-slate-500 font-bold bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md text-xs tracking-[0.3em]">{emp.pin}</span>
                               </td>
                               <td className="p-4 text-center">
                                  <div className="flex justify-center gap-2">
                                     <button onClick={() => { setEmployeeForm(emp); setShowEmployeeModal(true); }} className="p-1.5 text-blue-500 bg-white border border-slate-200 shadow-sm hover:bg-blue-50 rounded-xl transition-colors"><Edit3 size={14}/></button>
                                     <button onClick={() => setDeleteConfig({ id: emp.id, type: 'employee', name: emp.name })} className="p-1.5 text-rose-500 bg-white border border-slate-200 shadow-sm hover:bg-rose-50 rounded-xl transition-colors"><Trash size={14}/></button>
                                  </div>
                               </td>
                            </tr>
                         ))
                      )}
                   </tbody>
                </table>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

const MasterMapView = ({ allProjects, onSelectProject, mapType }) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  
  // STATE BARU: Preferensi Tampilan Layer di Peta Induk (Disimpan ke Local Storage)
  const [showPaths, setShowPaths] = useState(() => {
    const saved = localStorage.getItem('master_showPaths');
    return saved !== null ? JSON.parse(saved) : true; // Default Tampil Jalur
  });
  const [showDistances, setShowDistances] = useState(() => {
    const saved = localStorage.getItem('master_showDistances');
    return saved !== null ? JSON.parse(saved) : false; // Default Sembunyi Jarak agar Master Map tidak terlalu ramai
  });
  const [showSketchLabels, setShowSketchLabels] = useState(() => {
    const saved = localStorage.getItem('master_showSketchLabels');
    return saved !== null ? JSON.parse(saved) : false; // Default Sembunyi Label
  });
  const [showSketchPoints, setShowSketchPoints] = useState(() => {
    const saved = localStorage.getItem('master_showSketchPoints');
    return saved !== null ? JSON.parse(saved) : false; // Default Sembunyi Titik
  });

  useEffect(() => { localStorage.setItem('master_showPaths', JSON.stringify(showPaths)); }, [showPaths]);
  useEffect(() => { localStorage.setItem('master_showDistances', JSON.stringify(showDistances)); }, [showDistances]);
  useEffect(() => { localStorage.setItem('master_showSketchLabels', JSON.stringify(showSketchLabels)); }, [showSketchLabels]);
  useEffect(() => { localStorage.setItem('master_showSketchPoints', JSON.stringify(showSketchPoints)); }, [showSketchPoints]);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerLayerRef = useRef(null);
  const routeLayerRef = useRef(null); // LAYER BARU UNTUK JALUR RENCANA
  const surveyLayerRef = useRef(null); // LAYER BARU UNTUK JALUR REALISASI
  const tileLayerRef = useRef(null); 
  const isInitialFitDone = useRef(false);

  useEffect(() => {
    const checkLeaflet = setInterval(() => {
      if (window.L) { setIsMapLoaded(true); clearInterval(checkLeaflet); }
    }, 100);
    return () => clearInterval(checkLeaflet);
  }, []);

  useEffect(() => {
    if (isMapLoaded && mapContainerRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = window.L.map(mapContainerRef.current, { zoomControl: false }).setView([-0.4948, 117.1492], 12);
      window.L.control.zoom({ position: 'bottomright' }).addTo(mapInstanceRef.current);
      
      markerLayerRef.current = window.L.featureGroup().addTo(mapInstanceRef.current);
      routeLayerRef.current = window.L.layerGroup().addTo(mapInstanceRef.current);
      surveyLayerRef.current = window.L.layerGroup().addTo(mapInstanceRef.current);
      
      setIsMapReady(true);

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 400);
    }
  }, [isMapLoaded]);

  useEffect(() => {
    if (isMapReady && mapInstanceRef.current) {
      if (tileLayerRef.current) mapInstanceRef.current.removeLayer(tileLayerRef.current);
      
      let url = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&apistyle=s.t%3A2%7Cp.v%3Aoff'; 
      let attribution = '';

      if (mapType === 'roadmap') {
        url = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&apistyle=s.t%3A2%7Cp.v%3Aoff';
      } else if (mapType === 'osm') {
        url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'; 
        attribution = '&copy; OpenStreetMap contributors';
      } else if (mapType === 'esri') {
        url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'; 
        attribution = 'Tiles &copy; Esri';
      } else if (mapType === 'carto') {
        url = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'; 
        attribution = '&copy; OSM contributors & CARTO';
      }

      tileLayerRef.current = window.L.tileLayer(url, { maxNativeZoom: 19, maxZoom: 22, attribution }).addTo(mapInstanceRef.current);
    }
  }, [isMapReady, mapType]);

  // --- LOGIKA UTAMA RENDER PETA INDUK (MARKER + JALUR) ---
  useEffect(() => {
    if (isMapReady && mapInstanceRef.current && markerLayerRef.current && routeLayerRef.current && surveyLayerRef.current) {
      markerLayerRef.current.clearLayers();
      routeLayerRef.current.clearLayers();
      surveyLayerRef.current.clearLayers();
      
      let bounds = window.L.latLngBounds();
      let hasData = false;

      // 1. Fungsi Gambar Marker Titik Pusat Proyek
      const createProjectMarker = (proj) => {
        const actualProg = parseFloat(proj.actual_progress || 0);
        const isRunning = proj.status === 'Running' || actualProg > 0;
        const statusText = isRunning ? 'Pelaksanaan' : 'Persiapan';
        const rgbColor = isRunning ? '59, 130, 246' : '244, 63, 94';
        const hexColor = isRunning ? '#3b82f6' : '#f43f5e';

        return window.L.divIcon({
          className: 'bg-transparent border-0 overflow-visible',
          html: `
              <div class="relative flex items-center justify-center pointer-events-auto cursor-pointer group" style="transform: translate(-50%, -50%); width: 48px; height: 48px; z-index: 1000;">
                  <div class="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 ease-out w-max max-w-[240px] z-[9999] pointer-events-none flex flex-col items-center">
                     <div class="bg-white/80 backdrop-blur-[70px] rounded-2xl shadow-2xl border border-white/60 overflow-hidden relative w-full p-4">
                        <h3 class="text-[11px] font-black text-slate-800 leading-relaxed text-left mb-3 line-clamp-3 uppercase tracking-wider">${proj.pekerjaan}</h3>
                        <div class="flex justify-between items-end border-t border-slate-300/40 pt-3">
                           <div class="flex flex-col text-left"><span class="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Status</span><span class="text-[10px] font-black uppercase tracking-widest" style="color: ${hexColor}">${statusText}</span></div>
                           <div class="flex flex-col text-right pl-6"><span class="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Progress</span><span class="text-2xl font-black leading-none drop-shadow-sm" style="color: ${hexColor}">${actualProg.toFixed(1)}<span class="text-sm">%</span></span></div>
                        </div>
                     </div>
                     <div class="w-4 h-4 rotate-45 -mt-2.5 z-[-1] shadow-sm" style="background: rgba(255,255,255,0.8); backdrop-filter: blur(70px); border-right: 1px solid rgba(255,255,255,0.5); border-bottom: 1px solid rgba(255,255,255,0.5);"></div>
                  </div>
                  <div class="absolute w-[25px] h-[25px] rounded-full opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" style="background: radial-gradient(circle, rgba(${rgbColor}, 0.8) 0%, rgba(${rgbColor}, 0.4) 50%, rgba(${rgbColor}, 0) 80%);"></div>
                  <div class="w-[15px] h-[15px] rounded-full z-10 relative group-hover:scale-110 transition-transform duration-300 shadow-sm" style="background-color: ${hexColor}; border: 2px solid white; box-shadow: 0 0 4px 1px rgba(${rgbColor}, 0.6);"></div>
              </div>
            `,
          iconSize: [0, 0]
        });
      };

      // 2. Fungsi Gambar Label Jarak
      const createDistLabel = (text, isTotal, colorHex) => window.L.divIcon({
        className: 'bg-transparent border-0 overflow-visible',
        html: `<div style="transform: translate(-50%, ${isTotal ? '-150%' : '-50%'}); background-color: ${isTotal ? colorHex : 'rgba(0,0,0,0.8)'}; color: #fff; border: 1px solid ${colorHex};" class="w-max px-2.5 py-1 rounded-lg text-[9px] font-black whitespace-nowrap shadow-sm backdrop-blur-md">${isTotal ? 'Total: ' : ''}${text}</div>`,
        iconSize: [0, 0]
      });

      // 3. Fungsi Gambar Titik Biasa untuk Rute
      const createSimplePointMarker = (color) => {
        return window.L.divIcon({
          className: 'bg-transparent border-0',
          html: `<div style="transform: translate(-50%, -50%); background-color: ${color};" class="w-3 h-3 border-2 border-white rounded-full shadow-md"></div>`,
          iconSize: [0, 0]
        });
      };

      // 4. Fungsi Gambar Pin Map untuk Survei Awal/Akhir
      const createSurveyPinMarker = (theme, prefix, segName, lat, lng) => {
        const gradId = theme === 'Blue' ? `gB-${Math.random()}` : `gR-${Math.random()}`;
        const stop1 = theme === 'Blue' ? '#38bdf8' : '#fb7185';
        const stop2 = theme === 'Blue' ? '#2563eb' : '#e11d48';
        const textColor = theme === 'Blue' ? 'text-blue-600' : 'text-rose-600';
        return window.L.divIcon({
          className: 'bg-transparent border-0 overflow-visible',
          html: `<div class="relative flex flex-col items-center group cursor-pointer pointer-events-auto" style="transform: translate(-50%, -100%);">
                   <div class="absolute bottom-full mb-2.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.15)] border border-slate-200/50 whitespace-nowrap text-center z-[9999] opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 pointer-events-none origin-bottom">
                      <div class="text-[9px] font-black uppercase tracking-wide leading-tight text-slate-800"><span class="${textColor}">${prefix}</span><br/>${segName}</div>
                   </div>
                   <div class="relative origin-bottom group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-300">
                      <svg width="24" height="32" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.5));">
                        <defs><linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${stop1}" /><stop offset="100%" stop-color="${stop2}" /></linearGradient></defs>
                        <circle cx="192" cy="192" r="80" fill="white" />
                        <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" fill="url(#${gradId})" />
                      </svg>
                   </div>
                 </div>`,
          iconSize: [0, 0]
        });
      };

      // --- LOOP SELURUH PROYEK ---
      allProjects.forEach(p => {
        const plannedPath = p.planned_path || [];
        const actualSegments = p.actual_segments_data || [];

        // Formatting data untuk kompatibilitas ke belakang (Migrasi Garis Lurus Awal & Akhir)
        let actualSegsToRender = [];
        actualSegments.forEach(seg => {
            let pts = seg.points || [];
            let bEnd = seg.boundary_end;
            if (!seg.points) {
                if (seg.startLat && seg.startLng) pts.push({lat: parseFloat(seg.startLat), lng: parseFloat(seg.startLng)});
                if (seg.endLat && seg.endLng) bEnd = {lat: parseFloat(seg.endLat), lng: parseFloat(seg.endLng)};
            }
            actualSegsToRender.push({ ...seg, points: pts, boundary_end: bEnd });
        });

        // A. GAMBAR SKETSA / JALUR RENCANA
        if (showPaths && plannedPath.length > 0) {
          plannedPath.forEach((pathObj) => {
            if (!pathObj || !pathObj.points || pathObj.points.length === 0) return;
            const coords = pathObj.points.map(pt => [parseFloat(pt.lat), parseFloat(pt.lng)]).filter(c => !isNaN(c[0]) && !isNaN(c[1]));
            
            if (coords.length > 0) {
              const isPolygon = pathObj.type === 'polygon';
              let shape;
              if (isPolygon) {
                shape = window.L.polygon(coords, { color: pathObj.color || '#10b981', weight: 3, fillColor: pathObj.color || '#10b981', fillOpacity: 0.3, dashArray: pathObj.isDashed ? '10, 10' : null }).addTo(routeLayerRef.current);
              } else {
                shape = window.L.polyline(coords, { color: pathObj.color || '#f59e0b', weight: 4, opacity: 0.8, dashArray: pathObj.isDashed ? '10, 10' : null }).addTo(routeLayerRef.current);
              }
              
              coords.forEach(c => bounds.extend(c));
              hasData = true;

              // Label Nama Sketsa
              if (showSketchLabels) {
                const center = shape.getBounds().getCenter();
                window.L.marker(center, { interactive: false, zIndexOffset: 100, icon: window.L.divIcon({ className: 'bg-transparent border-0 overflow-visible', html: `<div style="transform: translate(-50%, -150%); background-color: rgba(0,0,0,0.8); color: ${pathObj.color || (isPolygon ? '#34d399' : '#fbbf24')}; border: 1px ${pathObj.isDashed ? 'dashed' : 'solid'} ${pathObj.color || (isPolygon ? '#10b981' : '#f59e0b')};" class="w-max px-3 py-1.5 rounded-xl text-[9px] font-black whitespace-nowrap shadow-lg uppercase tracking-wider backdrop-blur-md">${p.pekerjaan.substring(0, 15)}... - ${pathObj.name || (isPolygon ? 'Poligon' : 'Sketsa')}</div>`, iconSize: [0, 0] }) }).addTo(routeLayerRef.current);
              }

              // Kalkulasi Jarak & Titik Koordinat Sketsa
              let segmentTotalDist = 0;
              for (let i = 0; i < coords.length; i++) {
                if (showSketchPoints) {
                  window.L.marker([coords[i][0], coords[i][1]], { interactive: false, zIndexOffset: 150, icon: window.L.divIcon({ className: 'bg-transparent border-0', html: `<div style="transform: translate(-50%, -50%); background-color: ${pathObj.color || (isPolygon ? '#10b981' : '#f59e0b')};" class="w-2.5 h-2.5 border border-white rounded-full shadow-md"></div>`, iconSize: [0, 0] }) }).addTo(routeLayerRef.current);
                }
                if (i < coords.length - 1) {
                  const pt1 = window.L.latLng(coords[i][0], coords[i][1]); const pt2 = window.L.latLng(coords[i + 1][0], coords[i + 1][1]);
                  const dist = pt1.distanceTo(pt2); segmentTotalDist += dist;
                  if (showDistances) window.L.marker([(pt1.lat + pt2.lat) / 2, (pt1.lng + pt2.lng) / 2], { interactive: false, zIndexOffset: 200, icon: createDistLabel(dist > 1000 ? `${(dist / 1000).toFixed(2)} km` : `${Math.round(dist)} m`, false, pathObj.color || (isPolygon ? '#10b981' : '#f59e0b')) }).addTo(routeLayerRef.current);
                }
                if (showDistances && i === coords.length - 1 && i > 0) {
                  let closeDist = 0;
                  if (isPolygon && coords.length > 2) {
                      const ptStart = window.L.latLng(coords[0][0], coords[0][1]);
                      const ptEnd = window.L.latLng(coords[i][0], coords[i][1]);
                      closeDist = ptStart.distanceTo(ptEnd);
                      window.L.marker([(ptStart.lat + ptEnd.lat) / 2, (ptStart.lng + ptEnd.lng) / 2], { interactive: false, zIndexOffset: 200, icon: createDistLabel(closeDist > 1000 ? `${(closeDist / 1000).toFixed(2)} km` : `${Math.round(closeDist)} m`, false, pathObj.color || '#10b981') }).addTo(routeLayerRef.current);
                  }
                  const finalDist = segmentTotalDist + closeDist;
                  window.L.marker([coords[i][0], coords[i][1]], { interactive: false, zIndexOffset: 200, icon: createDistLabel(finalDist > 1000 ? `${(finalDist / 1000).toFixed(2)} km` : `${Math.round(finalDist)} m${isPolygon?' (Keliling)':''}`, true, pathObj.color || (isPolygon ? '#10b981' : '#f59e0b')) }).addTo(routeLayerRef.current);
                }
              }
            }
          });
        }

        // B. GAMBAR JALUR REALISASI (AKTUAL LAPANGAN)
        if (showPaths && actualSegsToRender.length > 0) {
          actualSegsToRender.forEach(seg => {
            if (seg.points && seg.points.length > 0) {
              const coords = seg.points.map(pt => [parseFloat(pt.lat), parseFloat(pt.lng)]).filter(c => !isNaN(c[0]) && !isNaN(c[1]));

              if (coords.length > 0) {
                if (coords.length > 1) {
                  window.L.polyline(coords, { color: '#3b82f6', weight: 5, opacity: 0.9 }).addTo(surveyLayerRef.current);
                }

                // Gambar garis putus-putus penghubung titik rute terakhir ke Target Akhir (Boundary End Survey)
                if (seg.boundary_end && !isNaN(parseFloat(seg.boundary_end.lat))) {
                    const lastPt = coords[coords.length - 1];
                    const boundaryPt = [parseFloat(seg.boundary_end.lat), parseFloat(seg.boundary_end.lng)];
                    window.L.polyline([lastPt, boundaryPt], { color: '#3b82f6', weight: 3, opacity: 0.5, dashArray: '8, 8' }).addTo(surveyLayerRef.current);
                }
                
                if (showSketchPoints) {
                  // Tambahkan titik (point) untuk setiap koordinat di jalur realisasi
                  coords.forEach(coord => {
                     window.L.marker(coord, { icon: createSimplePointMarker('#3b82f6'), zIndexOffset: 4500 }).addTo(surveyLayerRef.current);
                  });
                }
                
                // HANYA GAMBAR PIN MAP/ICON JIKA DATA BERASAL DARI INPUT SURVEI (Memiliki boundary_end)
                if (seg.boundary_end && !isNaN(parseFloat(seg.boundary_end.lat))) {
                    window.L.marker(coords[0], { icon: createSurveyPinMarker('Blue', `Awal Survei`, seg.name, coords[0][0], coords[0][1]), zIndexOffset: 5000 }).addTo(surveyLayerRef.current);
                    window.L.marker([parseFloat(seg.boundary_end.lat), parseFloat(seg.boundary_end.lng)], { icon: createSurveyPinMarker('Red', `Akhir Survei`, seg.name, parseFloat(seg.boundary_end.lat), parseFloat(seg.boundary_end.lng)), zIndexOffset: 5000 }).addTo(surveyLayerRef.current);
                }
                
                coords.forEach(c => bounds.extend(c));
                if (seg.boundary_end && !isNaN(parseFloat(seg.boundary_end.lat))) {
                    bounds.extend([parseFloat(seg.boundary_end.lat), parseFloat(seg.boundary_end.lng)]);
                }
                hasData = true;

                if (showDistances && coords.length > 1) {
                  let segmentTotalDist = 0;
                  for (let i = 0; i < coords.length - 1; i++) {
                     const pt1 = window.L.latLng(coords[i][0], coords[i][1]); 
                     const pt2 = window.L.latLng(coords[i + 1][0], coords[i + 1][1]);
                     const dist = pt1.distanceTo(pt2); segmentTotalDist += dist;
                     window.L.marker([(pt1.lat + pt2.lat) / 2, (pt1.lng + pt2.lng) / 2], { interactive: false, zIndexOffset: 200, icon: createDistLabel(dist > 1000 ? `${(dist / 1000).toFixed(2)} km` : `${Math.round(dist)} m`, false, '#3b82f6') }).addTo(surveyLayerRef.current);
                  }
                  const lastPt = coords[coords.length - 1];
                  window.L.marker([lastPt[0], lastPt[1]], { interactive: false, zIndexOffset: 200, icon: createDistLabel(segmentTotalDist > 1000 ? `${(segmentTotalDist / 1000).toFixed(2)} km` : `${Math.round(segmentTotalDist)} m`, true, '#3b82f6') }).addTo(surveyLayerRef.current);
                }
              }
            }
          });
        }

        // C. GAMBAR TITIK PUSAT (MARKER UTAMA PROYEK)
        const lat = parseFloat(p.start_lat);
        const lng = parseFloat(p.start_lng);
        if (!isNaN(lat) && !isNaN(lng)) {
          const actualProg = parseFloat(p.actual_progress || 0);
          const isRunning = p.status === 'Running' || actualProg > 0;
          
          const areaCircle = window.L.circleMarker([lat, lng], {
            radius: 25, stroke: false, fillColor: isRunning ? '#3b82f6' : '#f43f5e', fillOpacity: 0.2, className: 'animate-pulse' 
          }).addTo(markerLayerRef.current);
          
          areaCircle.on('click', () => onSelectProject(p));

          const marker = window.L.marker([lat, lng], { icon: createProjectMarker(p) }).addTo(markerLayerRef.current);
          marker.on('click', () => onSelectProject(p));
          bounds.extend([lat, lng]);
          hasData = true;
        }
      });

      if (hasData && bounds.isValid() && !isInitialFitDone.current) {
        // Pada Master Map kita atur maxZoom agar view awal lebih luas saat melihat seluruh proyek
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        isInitialFitDone.current = true;
      }
    }
  }, [isMapReady, allProjects, onSelectProject, showPaths, showDistances, showSketchLabels, showSketchPoints]);

  return (
    <>
      <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-slate-900" style={{ height: '100%', width: '100%' }} />
      
      {/* FLOATING TOGGLE LAYERS PETA INDUK (KANAN BAWAH) */}
      <div className="absolute bottom-6 right-4 md:right-6 z-[9999] flex flex-col items-end gap-2 pointer-events-auto">
          <button onClick={() => setShowPaths(!showPaths)} className={`bg-black/60 backdrop-blur-md p-2 sm:px-3 sm:py-2.5 sm:w-[150px] rounded-2xl shadow-lg text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center justify-center sm:justify-start gap-2 border border-white/10 hover:bg-black/80 transition-all ${!showPaths ? 'text-slate-400' : 'text-white border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`} title="Tampilkan/Sembunyikan Jalur Rencana & Realisasi Seluruh Proyek">
            {showPaths ? <Eye size={16} className="text-blue-400" /> : <EyeOff size={16} />} 
            <span className="hidden sm:inline truncate">Jalur Proyek</span>
          </button>
          
          {showPaths && (
             <>
              <button onClick={() => setShowSketchPoints(!showSketchPoints)} className={`bg-black/60 backdrop-blur-md p-2 sm:px-3 sm:py-2.5 sm:w-[150px] rounded-2xl shadow-lg text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center justify-center sm:justify-start gap-2 border border-white/10 hover:bg-black/80 transition-all ${!showSketchPoints ? 'text-slate-400' : 'text-white border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}>
                <MapPin size={16} className={showSketchPoints ? "text-emerald-400" : ""} /> <span className="hidden sm:inline truncate">Titik Lokasi</span>
              </button>
              <button onClick={() => setShowSketchLabels(!showSketchLabels)} className={`bg-black/60 backdrop-blur-md p-2 sm:px-3 sm:py-2.5 sm:w-[150px] rounded-2xl shadow-lg text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center justify-center sm:justify-start gap-2 border border-white/10 hover:bg-black/80 transition-all ${!showSketchLabels ? 'text-slate-400' : 'text-white border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'}`}>
                <FileText size={16} className={showSketchLabels ? "text-amber-400" : ""} /> <span className="hidden sm:inline truncate">Label Nama</span>
              </button>
              <button onClick={() => setShowDistances(!showDistances)} className={`bg-black/60 backdrop-blur-md p-2 sm:px-3 sm:py-2.5 sm:w-[150px] rounded-2xl shadow-lg text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center justify-center sm:justify-start gap-2 border border-white/10 hover:bg-black/80 transition-all ${!showDistances ? 'text-slate-400' : 'text-white border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'}`}>
                <Ruler size={16} className={showDistances ? "text-cyan-400" : ""} /> <span className="hidden sm:inline truncate">Jarak (m/km)</span>
              </button>
             </>
          )}
      </div>
    </>
  );
};

const MasterDashboardView = ({ allProjects, onSelectProject, onAddProject, onBackToSelection, onViewRekap }) => {
  // State untuk kontrol peta induk
  const [mapType, setMapType] = useState(() => localStorage.getItem('master_mapType') || 'satellite');
  const [isUIHidden, setIsUIHidden] = useState(true);
  
  useEffect(() => { localStorage.setItem('master_mapType', mapType); }, [mapType]);

  // --- KALKULASI RINGKASAN PORTOFOLIO KESELURUHAN ---
  const totalProjects = allProjects.length;
  const runningProjects = allProjects.filter(p => p.status === 'Running' || parseFloat(p.actual_progress || 0) > 0).length;
  const avgProgress = totalProjects > 0 ? allProjects.reduce((sum, p) => sum + parseFloat(p.actual_progress || 0), 0) / totalProjects : 0;

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans bg-slate-900">
      
      {/* MAP BACKGROUND (100% SCREEN) */}
      <div className="absolute inset-0 z-0">
        <MasterMapView allProjects={allProjects} onSelectProject={onSelectProject} mapType={mapType} />
      </div>

      {/* LOGO & MENU TOGGLE (MENGAMBANG DI KIRI ATAS) */}
      <div 
        onClick={() => setIsUIHidden(!isUIHidden)}
        className="absolute top-4 left-4 md:top-6 md:left-6 z-[99999] flex items-center gap-3 group cursor-pointer pointer-events-auto"
        title={isUIHidden ? "Tampilkan Menu Utama" : "Sembunyikan Menu"}
      >
         <div className="w-12 h-12 bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 group-hover:bg-black/80 transition-all relative overflow-hidden">
            <Menu size={20} className={`absolute transition-all duration-500 ${!isUIHidden ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
            <Activity size={20} className={`absolute transition-all duration-500 ${isUIHidden ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
         </div>
         {/* Teks indikator Peta Induk */}
         <div className="hidden sm:flex flex-col opacity-90 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
           <h1 className="text-sm font-black tracking-tight text-white leading-none drop-shadow-md">Peta Induk</h1>
           <p className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mt-1 drop-shadow-md">Master Dashboard</p>
         </div>
      </div>

      {/* FLOATING HEADER BUTTONS (KANAN ATAS) */}
      <header className={`absolute top-4 right-4 md:top-6 md:right-6 z-20 flex justify-end items-start pointer-events-none transition-all duration-500 ease-in-out origin-right ${isUIHidden ? 'opacity-0 scale-95 translate-x-12' : 'opacity-100 scale-100 translate-x-0'}`}>
         <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-3 pointer-events-auto">
             
             {/* Tombol Menu Utama */}
             <button onClick={onBackToSelection} className="bg-black/60 backdrop-blur-md text-slate-200 px-3 py-3 md:px-4 md:py-3.5 rounded-2xl text-[10px] md:text-xs font-black uppercase flex items-center gap-2 shadow-lg hover:bg-black/80 hover:text-white transition-colors border border-white/10" title="Kembali ke Menu Utama">
                <Grid size={16}/> <span className="hidden sm:inline">Menu Utama</span>
             </button>

             {/* Tombol Siklus Peta di Master Dashboard Diperbarui */}
             <button onClick={() => {
                const nextMap = {
                  'satellite': 'roadmap',
                  'roadmap': 'osm',
                  'osm': 'esri',
                  'esri': 'carto',
                  'carto': 'satellite'
                };
                setMapType(nextMap[mapType] || 'satellite');
             }} className="bg-black/60 backdrop-blur-md text-slate-200 px-3 py-3 md:px-4 md:py-3.5 rounded-2xl text-[10px] md:text-xs font-black uppercase flex items-center gap-2 shadow-lg hover:bg-black/80 hover:text-white transition-colors border border-white/10" title="Ganti Tampilan Peta">
                <MapIcon size={16}/> 
                <span className="hidden sm:inline">
                   {mapType === 'satellite' ? 'Satelit (G)' : 
                    mapType === 'roadmap' ? 'Roadmap' : 
                    mapType === 'osm' ? 'OSM' : 
                    mapType === 'esri' ? 'Esri Satelit' : 
                    mapType === 'carto' ? 'CartoDB' : 'Peta'}
                </span>
             </button>

             <button onClick={onViewRekap} className="bg-amber-500 text-white px-3 py-3 md:px-4 md:py-3.5 rounded-2xl text-[10px] md:text-xs font-black uppercase flex items-center gap-2 shadow-lg hover:bg-amber-600 hover:scale-105 transition-all border border-amber-400" title="Rekap Semua Data Proyek">
                <FileSpreadsheet size={16} /> <span className="hidden sm:inline">Rekap Data</span>
             </button>

             <button onClick={onAddProject} className="bg-blue-600 text-white px-3 py-3 md:px-4 md:py-3.5 rounded-2xl text-[10px] md:text-xs font-black uppercase flex items-center gap-2 shadow-lg hover:bg-blue-700 hover:scale-105 transition-all border border-blue-500">
                <Plus size={16} /> <span className="hidden sm:inline">Kamar Baru</span>
             </button>
         </div>
      </header>

      {/* WIDGET RINGKASAN PROGRESS KESELURUHAN (SIMPLIFIED & DARK) */}
      <div className={`absolute bottom-6 left-4 md:left-6 z-20 pointer-events-none transition-all duration-500 ease-in-out ${isUIHidden ? 'translate-y-48 opacity-0' : 'translate-y-0 opacity-100'}`}>
         <div className="bg-black/70 backdrop-blur-md p-5 rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 pointer-events-auto flex flex-col gap-3 min-w-[260px] text-slate-200">
            <div className="text-[11px] md:text-xs font-bold tracking-wide">
               Total Pek/Total Kamar : <span className="text-blue-400 font-black text-base ml-1">{totalProjects}</span>
            </div>
            <div className="text-[11px] md:text-xs font-bold tracking-wide">
               Total Progress Keseluruhan : <span className="text-emerald-400 font-black text-base ml-1">{avgProgress.toFixed(1)}%</span>
            </div>
         </div>
      </div>
      
    </div>
  );
};

const PresentationView = ({ projectData, processedSCurveData, photos, actualProg, onExit }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {
          // Silently handle if fullscreen is not permitted by the browser/iframe
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const slides = [
    { id: 'cover', title: 'Cover Proyek' },
    { id: 'progress', title: 'Progres Pekerjaan' },
    { id: 'items', title: 'Item Utama' },
    { id: 'gallery', title: 'Dokumentasi Lapangan' }
  ];

  const nextSlide = () => setCurrentSlide(p => Math.min(p + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide(p => Math.max(p - 1, 0));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  if (!projectData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-screen w-full text-center bg-slate-50">
        <MonitorPlay size={64} className="text-slate-300 mb-6" />
        <h2 className="text-2xl font-black mb-2 text-slate-800">Mode Presentasi</h2>
        <p className="text-sm text-slate-500 font-medium mb-8">Pilih proyek terlebih dahulu untuk memulai presentasi.</p>
        <button onClick={onExit} className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-8 py-3.5 rounded-2xl font-bold uppercase text-xs tracking-widest transition-colors">Kembali ke Dashboard</button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col h-screen w-full bg-slate-900 text-white relative overflow-hidden font-sans select-none">
      {}
      <div className={`flex justify-between items-center p-6 shrink-0 transition-opacity duration-300 ${isFullscreen ? 'opacity-0 hover:opacity-100 absolute top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md' : 'border-b border-slate-800'}`}>
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors" title="Keluar Mode Presentasi">
            <X size={20} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight leading-none text-white">{projectData?.pekerjaan}</h1>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">PRESENTASI PROYEK</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-slate-400 mr-4">Slide {currentSlide + 1} / {slides.length}</div>
          <button onClick={toggleFullscreen} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors" title="Fullscreen">
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>

      {}
      <div className="flex-1 relative flex items-center justify-center p-8 md:p-16 overflow-hidden">
        
        {/* Slide 0: Cover */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center p-12 transition-all duration-700 transform ${currentSlide === 0 ? 'opacity-100 translate-x-0' : currentSlide > 0 ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'}`}>
           <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-900/50">
             <Building2 size={48} className="text-white" />
           </div>
           <h2 className="text-4xl md:text-6xl font-black text-center text-white tracking-tight mb-6 leading-tight max-w-4xl">
             {projectData?.pekerjaan}
           </h2>
           <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
             <span className="px-6 py-3 bg-slate-800 text-blue-400 rounded-xl text-sm font-black uppercase tracking-widest border border-slate-700 shadow-lg">
               Status: {projectData?.status || 'Running'}
             </span>
             <span className="px-6 py-3 bg-slate-800 text-emerald-400 rounded-xl text-sm font-black uppercase tracking-widest border border-slate-700 shadow-lg">
               Progres Fisik: {Number(actualProg !== null ? actualProg : (projectData?.actual_progress || 0)).toFixed(2)}%
             </span>
           </div>
        </div>

        {/* Slide 1: Kurva S */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 md:p-16 transition-all duration-700 transform w-full h-full ${currentSlide === 1 ? 'opacity-100 translate-x-0' : currentSlide > 1 ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'}`}>
           <h3 className="text-2xl md:text-3xl font-black text-white mb-8 shrink-0 flex items-center gap-3"><TrendingUp className="text-blue-500"/> KURVA S & PROGRES FISIK</h3>
           <div className="flex-1 w-full bg-slate-800/50 rounded-[32px] p-6 border border-slate-700 shadow-xl max-w-6xl flex flex-col">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Progres Saat Ini</span>
                  <span className="text-5xl font-black text-emerald-400">{Number(actualProg !== null ? actualProg : (projectData?.actual_progress || 0)).toFixed(2)}%</span>
                </div>
              </div>
              <div className="flex-1 min-h-0 w-full -ml-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <ComposedChart data={processedSCurveData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorRencanaPres" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorRealisasiPres" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                         <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                     <XAxis dataKey="n" stroke="#94a3b8" fontSize={14} fontWeight="normal" axisLine={false} tickLine={false} />
                     <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={14} fontWeight="normal" axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                     <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }} itemStyle={{ fontWeight: 'bold' }} />
                     <Area type="monotone" dataKey="r" stroke="#06b6d4" strokeWidth={3} fill="url(#colorRencanaPres)" name="Rencana" dot={{ r: 4, strokeWidth: 2, fill: '#1e293b' }} />
                     <Area type="monotone" dataKey="a" stroke="#3b82f6" strokeWidth={4} fill="url(#colorRealisasiPres)" name="Realisasi" dot={{ r: 5, strokeWidth: 2, fill: '#1e293b' }} />
                   </ComposedChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Slide 2: Item Utama */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 md:p-16 transition-all duration-700 transform w-full h-full ${currentSlide === 2 ? 'opacity-100 translate-x-0' : currentSlide > 2 ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'}`}>
           <h3 className="text-2xl md:text-3xl font-black text-white mb-8 shrink-0 flex items-center gap-3"><Ruler className="text-blue-500"/> ITEM PEKERJAAN UTAMA</h3>
           <div className="w-full max-w-5xl bg-slate-800/50 rounded-[32px] border border-slate-700 p-8 shadow-xl overflow-y-auto custom-scrollbar">
              {(!projectData?.item_utama_data || projectData.item_utama_data.length === 0) ? (
                 <div className="text-center py-12 text-slate-400">Belum ada item utama</div>
              ) : (
                 <div className="space-y-4">
                   {projectData.item_utama_data.map((item, idx) => (
                     <div key={idx} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex flex-col gap-3">
                       <div className="flex justify-between items-center">
                         <h4 className="text-lg font-bold text-white">{item.nama}</h4>
                         <span className="text-xs font-black text-blue-400 bg-blue-900/30 px-3 py-1 rounded-lg">Renc. Hari Ini: {item.bobot || '-'}</span>
                       </div>
                       <div className="flex items-center gap-4 w-full">
                          <div className="flex-1 h-4 bg-slate-900 rounded-full overflow-hidden relative">
                             <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, Math.max(0, item.persen || 0))}%` }}></div>
                          </div>
                          <span className="text-sm font-black text-white w-12 text-right">{item.persen}%</span>
                       </div>
                     </div>
                   ))}
                 </div>
              )}
           </div>
        </div>

        {/* Slide 3: Dokumentasi */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 md:p-16 transition-all duration-700 transform w-full h-full ${currentSlide === 3 ? 'opacity-100 translate-x-0' : currentSlide > 3 ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'}`}>
           <h3 className="text-2xl md:text-3xl font-black text-white mb-8 shrink-0 flex items-center gap-3"><ImageIcon className="text-blue-500"/> DOKUMENTASI LAPANGAN</h3>
           <div className="w-full max-w-6xl flex-1 overflow-y-auto custom-scrollbar pr-2 pb-16">
              {photos && photos.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {photos.slice(0, 6).map((photo, idx) => (
                       <div key={idx} className="aspect-video rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 relative group shadow-lg">
                          {photo.media_url?.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ? (
                            <video src={photo.media_url} className="w-full h-full object-cover" />
                          ) : (
                            <img src={photo.media_url} alt={photo.title} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent">
                             <p className="text-xs font-bold text-white line-clamp-1">{photo.title}</p>
                             <p className="text-[9px] text-slate-300 mt-1">{new Date(photo.created_at).toLocaleDateString('id-ID')}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="text-center py-20 text-slate-400 flex flex-col items-center">
                    <ImageIcon size={48} className="opacity-20 mb-4" />
                    <span className="text-sm font-bold uppercase tracking-widest">Belum ada dokumentasi foto lapangan</span>
                 </div>
              )}
           </div>
        </div>

      </div>

      {}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40 bg-slate-800/80 backdrop-blur-md p-2 rounded-2xl border border-slate-700 shadow-2xl">
         <button onClick={prevSlide} disabled={currentSlide === 0} className="p-3 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 rounded-xl transition-colors">
            <ChevronLeft size={24} />
         </button>
         <div className="flex gap-2 px-4">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === i ? 'bg-blue-500 w-6' : 'bg-slate-500 hover:bg-slate-400'}`} title={slides[i].title} />
            ))}
         </div>
         <button onClick={nextSlide} disabled={currentSlide === slides.length - 1} className="p-3 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 rounded-xl transition-colors">
            <ChevronRight size={24} />
         </button>
      </div>

    </div>
  );
};

const RABView = () => (
  <div className="p-8 flex flex-col items-center justify-center h-full text-center">
    <Calculator size={64} className="text-slate-300 mb-6" />
    <h2 className="text-2xl font-black mb-2 text-slate-800">RAB & BOQ</h2>
    <p className="text-sm text-slate-500 font-medium mb-8">Modul Rencana Anggaran Biaya sedang dalam tahap penyempurnaan.</p>
  </div>
);

const TwinViewer = () => {
  const cesiumHtml = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BIM / CIM Custom 3D Viewer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/cesium/1.105.1/Widgets/widgets.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cesium/1.105.1/Cesium.js"></script>
    <style>
        /* Custom scrollbar untuk panel input */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    </style>
</head>
<body class="bg-slate-900 text-slate-800 overflow-hidden m-0 p-0 w-full h-full">

    <div id="map" class="absolute inset-0"></div>

    <!-- WIDGET KOORDINAT MOUSE -->
    <div id="coord-display" class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur text-slate-800 px-5 py-2.5 rounded-2xl shadow-lg border border-slate-200 text-xs font-bold font-mono tracking-wider z-50 flex gap-4 pointer-events-none hidden transition-opacity">
        <span>Lat : <span id="val-lat" class="text-blue-600">-</span></span>
        <span>Long : <span id="val-lng" class="text-blue-600">-</span></span>
    </div>

    <!-- TOMBOL TOGGLE PANEL -->
    <button onclick="toggleControlPanel()" class="absolute top-4 left-4 z-[60] bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-white text-slate-600 hover:text-blue-600 hover:shadow-xl transition-all group" title="Buka/Tutup Pengaturan">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-90 transition-transform duration-300"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
    </button>

    <!-- PANEL PENGATURAN (PUTIH TRANSPARAN & BISA DI-HIDE) -->
    <div id="control-panel-container" class="absolute top-20 left-4 z-[50] w-[320px] bg-white/85 backdrop-blur-xl p-5 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.1)] border border-white/60 transition-all duration-500 origin-top-left max-h-[80vh] overflow-y-auto" style="transform: scale(0.95) translateY(-10px); opacity: 0; pointer-events: none;">
        
        <div class="flex justify-between items-center mb-4 border-b border-slate-200/60 pb-3">
            <h1 class="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
                Pengaturan 3D
            </h1>
            <button onclick="toggleControlPanel()" class="text-slate-400 hover:text-rose-500 transition-colors p-1.5 bg-slate-100/50 hover:bg-rose-50 rounded-xl" title="Tutup Panel"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
        </div>
        
        <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Peta Dasar (Base Map)</label>
        <select id="select-basemap" onchange="changeBasemap()" class="w-full bg-white/60 border border-slate-200 focus:border-blue-400 rounded-xl p-2.5 text-xs mb-3 text-slate-700 outline-none shadow-sm transition-colors cursor-pointer font-medium">
            <option value="satellite">Satelit (ArcGIS World Imagery)</option>
            <option value="street">Peta Jalan (CartoDB Voyager)</option>
        </select>

        <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">URL MapTiler (XYZ)</label>
        <div class="relative mb-3">
            <input type="text" id="input-maptiler" placeholder="https://api.maptiler.com/tiles/.../{z}/{x}/{y}.png" class="w-full bg-white/60 border border-slate-200 focus:bg-white focus:border-blue-400 rounded-xl p-2.5 pr-9 text-xs text-slate-700 outline-none shadow-sm transition-colors font-medium">
            <button type="button" onclick="toggleLayer('maptiler', 'eye-maptiler')" id="eye-maptiler" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 bg-white p-1.5 rounded-lg shadow-sm border border-slate-100 transition-colors cursor-pointer" title="Tampilkan/Sembunyikan Layer">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
        </div>
        
        <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">URL Model 3D (.glb)</label>
        <div class="relative mb-4">
            <input type="text" id="input-url" value="https://lukman040293-hue.github.io/model-3d/gedung.glb" class="w-full bg-white/60 border border-slate-200 focus:bg-white focus:border-blue-400 rounded-xl p-2.5 pr-9 text-xs text-slate-700 outline-none shadow-sm transition-colors font-medium">
            <button type="button" onclick="toggleLayer('model', 'eye-url')" id="eye-url" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 bg-white p-1.5 rounded-lg shadow-sm border border-slate-100 transition-colors cursor-pointer" title="Tampilkan/Sembunyikan 3D Model">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
        </div>
        
        <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="bg-slate-50/50 p-2 rounded-xl border border-slate-100 shadow-sm">
                <label class="text-[9px] font-black text-slate-400 block mb-1.5 uppercase text-center">Latitude</label>
                <input type="number" id="input-lat" value="-0.4939" step="any" class="w-full bg-white border border-slate-200 focus:border-blue-400 rounded-lg p-1.5 text-xs text-slate-700 text-center outline-none font-mono">
            </div>
            <div class="bg-slate-50/50 p-2 rounded-xl border border-slate-100 shadow-sm">
                <label class="text-[9px] font-black text-slate-400 block mb-1.5 uppercase text-center">Longitude</label>
                <input type="number" id="input-lng" value="117.1439" step="any" class="w-full bg-white border border-slate-200 focus:border-blue-400 rounded-lg p-1.5 text-xs text-slate-700 text-center outline-none font-mono">
            </div>
            <div class="bg-slate-50/50 p-2 rounded-xl border border-slate-100 shadow-sm">
                <label class="text-[9px] font-black text-slate-400 block mb-1.5 uppercase text-center" title="Rotasi (Derajat)">Heading</label>
                <input type="number" id="input-heading" value="0" step="1" class="w-full bg-white border border-slate-200 focus:border-blue-400 rounded-lg p-1.5 text-xs text-slate-700 text-center outline-none font-mono">
            </div>
            <div class="bg-slate-50/50 p-2 rounded-xl border border-slate-100 shadow-sm">
                <label class="text-[9px] font-black text-slate-400 block mb-1.5 uppercase text-center" title="Ukuran Benda">Skala</label>
                <input type="number" id="input-scale" value="1.0" step="0.1" class="w-full bg-white border border-slate-200 focus:border-blue-400 rounded-lg p-1.5 text-xs text-slate-700 text-center outline-none font-mono">
            </div>
        </div>
        
        <div class="mb-5 bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100/60 shadow-inner">
            <label class="text-[10px] font-bold text-slate-600 flex justify-between items-center mb-2.5">
                <span class="flex items-center gap-1.5"><span class="text-amber-500 text-sm drop-shadow-sm">🌞</span> Simulasi Cahaya</span>
                <span id="time-val" class="text-amber-700 font-black bg-white px-2 py-0.5 rounded-md shadow-sm border border-amber-200">12:00</span>
            </label>
            <input type="range" id="input-time" min="0" max="23.99" step="0.25" value="12" oninput="updateTime()" class="w-full cursor-pointer accent-amber-500 h-1.5 bg-slate-200 rounded-lg appearance-none">
        </div>
        
        <button onclick="visualizeAll()" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest mb-3 transition-all shadow-md hover:shadow-lg transform active:scale-95 flex justify-center items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="7.5 4.21 12 6.81 16.5 4.21"/><polyline points="7.5 19.79 7.5 14.6 3 12"/><polyline points="21 12 16.5 14.6 16.5 19.79"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            TAMPILKAN 3D
        </button>
        <div class="flex gap-2">
            <button onclick="saveSettings()" id="btn-save" class="w-2/3 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm">
                Simpan
            </button>
            <button onclick="resetCamera()" class="w-1/3 bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-800 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm">
                Reset
            </button>
        </div>
        
        <div class="mt-5 pt-4 border-t border-slate-200/60">
            <p class="text-[10px] text-slate-600 font-bold mb-2 flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> Navigasi Bebas 360°:</p>
            <ul class="text-[9.5px] text-slate-500 space-y-1.5 ml-1">
                <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span> <span class="font-bold text-slate-700">Klik Kiri (Tahan):</span> Menggeser peta</li>
                <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span> <span class="font-bold text-slate-700">Scroll Tengah:</span> Tilt & Rotasi 3D</li>
                <li class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span> <span class="font-bold text-slate-700">Klik Kanan:</span> Memperbesar (Zoom)</li>
            </ul>
        </div>
    </div>

    <script>
        let viewer;
        
        // --- LOGIKA TOGGLE HIDE/SHOW PANEL ---
        let isPanelOpen = false;
        function toggleControlPanel() {
            const panel = document.getElementById('control-panel-container');
            isPanelOpen = !isPanelOpen;
            if (isPanelOpen) {
                panel.style.transform = 'scale(1) translateY(0)';
                panel.style.opacity = '1';
                panel.style.pointerEvents = 'auto';
            } else {
                panel.style.transform = 'scale(0.95) translateY(-10px)';
                panel.style.opacity = '0';
                panel.style.pointerEvents = 'none';
            }
        }
        
        window.onload = function() {
            loadSettings(); 

            try {
                const satelliteProvider = new Cesium.ArcGisMapServerImageryProvider({
                    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
                });

                viewer = new Cesium.Viewer('map', {
                    baseLayerPicker: false, 
                    geocoder: false, 
                    homeButton: false, 
                    infoBox: false,
                    navigationHelpButton: true, 
                    sceneModePicker: true,
                    timeline: false,
                    animation: false,
                    shadows: true, 
                    imageryProvider: satelliteProvider
                });

                viewer.scene.globe.enableLighting = true; 
                viewer.scene.shadowMap.darkness = 0.4; 

                viewer.scene.screenSpaceCameraController.enableTilt = true;
                viewer.scene.screenSpaceCameraController.enableRotate = true;
                viewer.scene.screenSpaceCameraController.enableZoom = true;
                
                updateTime();

                const coordDisplay = document.getElementById('coord-display');
                const valLat = document.getElementById('val-lat');
                const valLng = document.getElementById('val-lng');
                
                const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
                handler.setInputAction(function(movement) {
                    const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
                    if (cartesian) {
                        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                        const lng = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
                        const lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
                        
                        valLat.textContent = lat + '°S';
                        valLng.textContent = lng + '°E';
                        coordDisplay.classList.remove('hidden');
                    } else {
                        coordDisplay.classList.add('hidden');
                    }
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

                // --- AUTO VISUALIZE JIKA ADA DATA TERSIMPAN ---
                // Mencegah tampilan bola bumi default jika user sudah pernah menyimpan koordinat/model
                const savedData = localStorage.getItem('twin_3d_settings');
                if (savedData) {
                    try {
                        const parsedData = JSON.parse(savedData);
                        if (parsedData.lat && parsedData.lng) {
                            // Beri jeda 800ms agar engine Cesium selesai inisialisasi awal sebelum memuat 3D
                            setTimeout(() => {
                                visualizeAll();
                            }, 800);
                        }
                    } catch(err) {
                        console.error("Gagal membaca auto-load 3D settings", err);
                    }
                }

            } catch(e) {
                console.error("Gagal memuat Cesium:", e);
            }
        };

        const svgEye = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
        const svgEyeOff = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>';

        function toggleLayer(type, btnId) {
            if (!viewer) return;
            const btn = document.getElementById(btnId);
            let isVisible = false;

            if (type === 'maptiler') {
                if (viewer.imageryLayers.length > 1) {
                    const layer = viewer.imageryLayers.get(1); 
                    layer.show = !layer.show;
                    isVisible = layer.show;
                }
            } else if (type === 'model') {
                let anyEntity = false;
                viewer.entities.values.forEach(ent => {
                    ent.show = !ent.show;
                    isVisible = ent.show;
                    anyEntity = true;
                });
                if (!anyEntity) return; 
            }

            if (isVisible) {
                btn.innerHTML = svgEye;
                btn.classList.replace('text-rose-500', 'text-blue-500');
            } else {
                btn.innerHTML = svgEyeOff;
                btn.classList.replace('text-blue-500', 'text-rose-500');
            }
        }

        function updateTime() {
            if(!viewer) return;
            const val = parseFloat(document.getElementById('input-time').value);
            const hours = Math.floor(val);
            const minutes = Math.floor((val - hours) * 60);
            
            document.getElementById('time-val').innerText = 
                String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');

            const d = new Date();
            d.setHours(hours, minutes, 0, 0);
            viewer.clock.currentTime = Cesium.JulianDate.fromDate(d);
        }

        function saveSettings() {
            const settings = {
                basemap: document.getElementById('select-basemap').value,
                maptiler: document.getElementById('input-maptiler').value,
                url: document.getElementById('input-url').value,
                lat: document.getElementById('input-lat').value,
                lng: document.getElementById('input-lng').value,
                heading: document.getElementById('input-heading').value,
                scale: document.getElementById('input-scale').value,
                time: document.getElementById('input-time').value
            };
            localStorage.setItem('twin_3d_settings', JSON.stringify(settings));
            
            const btn = document.getElementById('btn-save');
            btn.innerHTML = 'TERSIMPAN ✓';
            btn.classList.replace('bg-emerald-50', 'bg-emerald-500');
            btn.classList.replace('text-emerald-600', 'text-white');
            setTimeout(() => {
                btn.innerHTML = 'Simpan';
                btn.classList.replace('bg-emerald-500', 'bg-emerald-50');
                btn.classList.replace('text-white', 'text-emerald-600');
            }, 2000);
        }

        function loadSettings() {
            const saved = localStorage.getItem('twin_3d_settings');
            if (saved) {
                try {
                    const s = JSON.parse(saved);
                    if(s.basemap) document.getElementById('select-basemap').value = s.basemap;
                    if(s.maptiler) document.getElementById('input-maptiler').value = s.maptiler;
                    if(s.url) document.getElementById('input-url').value = s.url;
                    if(s.lat) document.getElementById('input-lat').value = s.lat;
                    if(s.lng) document.getElementById('input-lng').value = s.lng;
                    if(s.heading) document.getElementById('input-heading').value = s.heading;
                    if(s.scale) document.getElementById('input-scale').value = s.scale;
                    if(s.time) document.getElementById('input-time').value = s.time;
                } catch(e) {}
            }
        }

        function changeBasemap() {
            if(!viewer) return;
            const select = document.getElementById('select-basemap').value;
            const layers = viewer.imageryLayers;
            
            layers.remove(layers.get(0));

            let newProvider;
            if (select === 'satellite') {
                newProvider = new Cesium.ArcGisMapServerImageryProvider({
                    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
                });
            } else {
                newProvider = new Cesium.UrlTemplateImageryProvider({
                    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
                    subdomains: ['a', 'b', 'c', 'd']
                });
            }
            layers.addImageryProvider(newProvider, 0);
        }

        function visualizeAll() {
            if(!viewer) return;
            
            document.getElementById('eye-maptiler').innerHTML = svgEye;
            document.getElementById('eye-maptiler').classList.replace('text-rose-500', 'text-blue-500');
            document.getElementById('eye-url').innerHTML = svgEye;
            document.getElementById('eye-url').classList.replace('text-rose-500', 'text-blue-500');

            while (viewer.imageryLayers.length > 1) {
                viewer.imageryLayers.remove(viewer.imageryLayers.get(1));
            }
            viewer.entities.removeAll();

            const maptilerUrl = document.getElementById('input-maptiler').value;
            if (maptilerUrl) {
                try {
                    viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({ 
                        url: maptilerUrl 
                    }));
                } catch (e) {
                    console.warn("Format URL MapTiler tidak sesuai:", e);
                }
            }

            const lat = parseFloat(document.getElementById('input-lat').value);
            const lng = parseFloat(document.getElementById('input-lng').value);
            const headingDeg = parseFloat(document.getElementById('input-heading').value) || 0;
            const headingRad = Cesium.Math.toRadians(headingDeg);
            const scaleVal = parseFloat(document.getElementById('input-scale').value) || 1.0;
            
            const position = Cesium.Cartesian3.fromDegrees(lng, lat, 0);
            const orientation = Cesium.Transforms.headingPitchRollQuaternion(
                position,
                new Cesium.HeadingPitchRoll(headingRad, 0, 0)
            );

            const modelUrl = document.getElementById('input-url').value;
            if(modelUrl) {
                const modelEntity = viewer.entities.add({
                    position: position,
                    orientation: orientation,
                    model: {
                        uri: modelUrl,
                        scale: scaleVal,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                    }
                });
                
                // Zoom otomatis dengan animasi dan jarak yang diatur agar tidak terlalu dekat
                viewer.flyTo(modelEntity, {
                    duration: 2.0,
                    offset: new Cesium.HeadingPitchRange(
                        0, // Heading (Arah orientasi kamera)
                        Cesium.Math.toRadians(-35), // Pitch (kamera sedikit menunduk agar enak dilihat)
                        500 * scaleVal // Range (jarak aman kamera dari objek, disesuaikan dengan skala)
                    )
                }).catch(function(error) {
                    console.log("Kamera zoom terinterupsi:", error);
                });
            } else {
                viewer.camera.flyTo({
                    destination : Cesium.Cartesian3.fromDegrees(lng, lat, 1000)
                });
            }
        }

        function resetCamera() {
            if(!viewer) return;
            if (viewer.entities.values.length > 0) {
                const scaleVal = parseFloat(document.getElementById('input-scale').value) || 1.0;
                viewer.flyTo(viewer.entities, {
                    duration: 1.5,
                    offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-35), 500 * scaleVal)
                });
            } else {
                const lat = parseFloat(document.getElementById('input-lat').value);
                const lng = parseFloat(document.getElementById('input-lng').value);
                viewer.camera.flyTo({
                    destination : Cesium.Cartesian3.fromDegrees(lng, lat, 1000)
                });
            }
        }
    </script>
</body>
</html>`;

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden">
      {/* Iframe Map Full Area Tanpa Border */}
      <iframe 
        srcDoc={cesiumHtml}
        title="3D BIM Viewer"
        className="absolute inset-0 w-full h-full border-0 z-0"
        allow="fullscreen; autocomplete; xr-spatial-tracking"
      />
    </div>
  );
};

// --- KONFIGURASI WARNA TEMA GANTT CHART ---
const THEME_COLORS = {
  amber: { plan: 'bg-amber-200 border-amber-300', actualBg: 'bg-amber-100 border-amber-300', actualFill: 'bg-amber-500', legendMarker: 'bg-amber-400 border-amber-500' },
  blue: { plan: 'bg-blue-200 border-blue-300', actualBg: 'bg-blue-100 border-blue-300', actualFill: 'bg-blue-500', legendMarker: 'bg-blue-500 border-blue-600' },
  emerald: { plan: 'bg-emerald-200 border-emerald-300', actualBg: 'bg-emerald-100 border-emerald-300', actualFill: 'bg-emerald-500', legendMarker: 'bg-emerald-500 border-emerald-600' },
  rose: { plan: 'bg-rose-200 border-rose-300', actualBg: 'bg-rose-100 border-rose-300', actualFill: 'bg-rose-500', legendMarker: 'bg-rose-500 border-rose-600' },
  purple: { plan: 'bg-purple-200 border-purple-300', actualBg: 'bg-purple-100 border-purple-300', actualFill: 'bg-purple-500', legendMarker: 'bg-purple-500 border-purple-600' },
  slate: { plan: 'bg-slate-200 border-slate-300', actualBg: 'bg-slate-100 border-slate-300', actualFill: 'bg-slate-500', legendMarker: 'bg-slate-500 border-slate-600' }
};

const GanttChartView = ({ projectData, onSaveSchedule, isProcessing }) => {
  const [activeTab, setActiveTab] = useState('input'); // State baru untuk mengontrol Tab
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState({ plan: 'amber', actual: 'blue' });

  useEffect(() => {
    if (projectData && Array.isArray(projectData.schedule_data) && projectData.schedule_data.length > 0) {
      setTasks(projectData.schedule_data);
    } else {
      setTasks([]);
    }
  }, [projectData]);

  // Mengambil tema warna yang tersimpan (jika ada)
  useEffect(() => {
    if (projectData?.id) {
      const savedTheme = localStorage.getItem(`gantt_theme_${projectData.id}`);
      if (savedTheme) {
        try { setTheme(JSON.parse(savedTheme)); } catch(e){}
      }
    }
  }, [projectData?.id]);

  const handleThemeChange = (type, value) => {
    const newTheme = { ...theme, [type]: value };
    setTheme(newTheme);
    if (projectData?.id) localStorage.setItem(`gantt_theme_${projectData.id}`, JSON.stringify(newTheme));
  };

  const handleUpdateTask = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const handleMoveTask = (index, direction) => {
    if (index + direction < 0 || index + direction >= tasks.length) return;
    const newTasks = [...tasks];
    const temp = newTasks[index];
    newTasks[index] = newTasks[index + direction];
    newTasks[index + direction] = temp;
    setTasks(newTasks);
  };

  // FUNGSI EXPORT KE EXCEL (VISUAL GANTT CHART)
  const handleExportExcel = () => {
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; font-family: Calibri, sans-serif; font-size: 11px; }
          th, td { border: 1px solid #cbd5e1; padding: 4px 6px; }
          .head-title { background-color: #0f172a; color: white; font-size: 14px; font-weight: bold; text-align: left; padding: 10px; }
          .header { background-color: #f1f5f9; font-weight: bold; text-align: center; color: #334155; }
          .plan-bg { background-color: #fcd34d; } /* Kuning Rencana */
          .actual-bg { background-color: #3b82f6; } /* Biru Realisasi */
        </style>
      </head>
      <body>
        <table>
          <tr>
            <th colspan="${7 + timelineInfo.days}" class="head-title">JADWAL PELAKSANAAN & TIMELINE - ${projectData?.pekerjaan || 'PROYEK'}</th>
          </tr>
          <tr>
            <th rowspan="2" class="header" style="width: 30px;">No</th>
            <th rowspan="2" class="header" style="width: 250px;">Item Pekerjaan</th>
            <th rowspan="2" class="header" style="width: 60px;">Progres</th>
            <th colspan="2" class="header">Rencana</th>
            <th colspan="2" class="header">Realisasi</th>
            <th colspan="${timelineInfo.days}" class="header">Timeline Pelaksanaan (Rentang: ${timelineInfo.days} Hari)</th>
          </tr>
          <tr>
            <th class="header" style="width: 80px;">Mulai</th>
            <th class="header" style="width: 80px;">Selesai</th>
            <th class="header" style="width: 80px;">Mulai</th>
            <th class="header" style="width: 80px;">Selesai</th>
    `;

    // Header Tanggal
    const startD = timelineInfo.start;
    for (let i = 0; i < timelineInfo.days; i++) {
      const d = new Date(startD);
      d.setDate(d.getDate() + i);
      // Format mso-number-format menghindari excel mengubah tanggal jadi format aneh
      html += `<th class="header" style="width: 25px; font-size: 9px; mso-number-format:'\@';">${d.getDate()}/${d.getMonth() + 1}</th>`;
    }
    html += '</tr>';

    // Helper Parse Date Local
    const parseDateLocal = (str) => {
        if (!str) return null;
        const parts = str.split('-');
        if (parts.length !== 3) return null;
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])).getTime();
    };

    // BODY
    tasks.forEach((t, i) => {
      const pStart = parseDateLocal(t.start);
      const pEnd = parseDateLocal(t.end);
      const aStart = parseDateLocal(t.actualStart);
      const aEnd = parseDateLocal(t.actualEnd);

      // ROW 1: Plan
      html += `
        <tr>
          <td rowspan="2" style="text-align: center; vertical-align: middle;">${i + 1}</td>
          <td rowspan="2" style="vertical-align: middle; font-weight: bold;">${t.name || ''}</td>
          <td rowspan="2" style="text-align: center; vertical-align: middle; font-weight: bold; color: #0f172a;">${t.progress || 0}%</td>
          <td style="text-align: center; color: #64748b; font-size: 10px; background-color: #fffbeb;">${t.start || '-'}</td>
          <td style="text-align: center; color: #64748b; font-size: 10px; background-color: #fffbeb;">${t.end || '-'}</td>
          <td rowspan="2" style="text-align: center; vertical-align: middle; font-size: 10px; background-color: #eff6ff; font-weight: bold;">${t.actualStart || '-'}</td>
          <td rowspan="2" style="text-align: center; vertical-align: middle; font-size: 10px; background-color: #eff6ff; font-weight: bold;">${t.actualEnd || '-'}</td>
      `;

      // Render Plan Bars
      for (let j = 0; j < timelineInfo.days; j++) {
        const d = new Date(startD);
        d.setDate(d.getDate() + j);
        const tTime = d.getTime();
        let bgClass = '';
        if (pStart && pEnd && tTime >= pStart && tTime <= pEnd) bgClass = 'plan-bg';
        html += `<td class="${bgClass}"></td>`;
      }
      html += '</tr>';

      // ROW 2: Actual
      html += `
        <tr>
          <td colspan="2" style="text-align: right; font-size: 9px; color: #94a3b8; border-top: none; background-color: #fafafa;">Visual:</td>
      `;
      // Render Actual Bars
      for (let j = 0; j < timelineInfo.days; j++) {
        const d = new Date(startD);
        d.setDate(d.getDate() + j);
        const tTime = d.getTime();
        let bgClass = '';
        if (aStart && aEnd && tTime >= aStart && tTime <= aEnd) bgClass = 'actual-bg';
        html += `<td class="${bgClass}" style="border-top: none;"></td>`;
      }
      html += '</tr>';
    });

    html += `</table></body></html>`;

    // Download file sebagai .xls
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const projectName = projectData?.pekerjaan ? projectData.pekerjaan.replace(/[^a-z0-9]/gi, '_') : 'Proyek';
    link.download = `Visual_Timeline_${projectName}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const timelineInfo = useMemo(() => {
    const validStartDates = [];
    const validEndDates = [];
    
    // Parser lokal agar tidak terkena bug zona waktu (UTC shift)
    const parseDateLocal = (str) => {
      if (!str) return null;
      const parts = str.split('-');
      if (parts.length !== 3) return null;
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return isNaN(d.getTime()) ? null : d.getTime();
    };

    tasks.forEach(t => {
      const sP = parseDateLocal(t.start); if (sP) validStartDates.push(sP);
      const eP = parseDateLocal(t.end); if (eP) validEndDates.push(eP);
      const sA = parseDateLocal(t.actualStart); if (sA) validStartDates.push(sA);
      const eA = parseDateLocal(t.actualEnd); if (eA) validEndDates.push(eA);
    });

    if (validStartDates.length === 0 || validEndDates.length === 0) {
      const s = new Date();
      s.setHours(0, 0, 0, 0);
      const e = new Date(s);
      e.setDate(e.getDate() + 30);
      return { start: s, end: e, days: 31 };
    }

    const minDate = new Date(Math.min(...validStartDates));
    const maxDate = new Date(Math.max(...validEndDates));
    minDate.setDate(minDate.getDate() - 2);
    maxDate.setDate(maxDate.getDate() + 2);
    minDate.setHours(0, 0, 0, 0);
    maxDate.setHours(0, 0, 0, 0);
    const days = Math.round((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1;
    return { start: minDate, end: maxDate, days: Math.max(days, 7) };
  }, [tasks]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#f4f7fe]">
      <div className="px-6 py-6 md:px-10 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 bg-white/50 backdrop-blur-md shrink-0 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 shadow-sm border border-blue-100 rounded-2xl hidden sm:block text-blue-600">
            <CalendarDays size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 uppercase">Jadwal Pelaksanaan (Gantt Chart)</h3>
            <p className="text-[10px] text-slate-500 uppercase mt-1 tracking-widest font-bold">Timeline Proyek & Progres Pekerjaan</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={handleExportExcel} className="flex-1 sm:flex-none bg-emerald-600 text-white px-4 md:px-6 py-3 rounded-2xl text-[10px] font-bold uppercase shadow-md flex justify-center gap-2 items-center hover:bg-emerald-700 transition-all">
            <FileSpreadsheet size={16} /> <span className="hidden sm:inline">Export Excel</span>
          </button>
          <button onClick={() => onSaveSchedule(tasks)} disabled={isProcessing} className="flex-1 sm:flex-none bg-blue-600 text-white px-4 md:px-6 py-3 rounded-2xl text-[10px] font-bold uppercase shadow-md flex justify-center gap-2 items-center hover:bg-blue-700 transition-all">
            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} <span className="hidden sm:inline">Simpan Jadwal</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col p-4 md:p-8 gap-4 md:gap-6">
        
        {/* KONTROL TAB BARU */}
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-full sm:w-max mx-auto shadow-sm shrink-0">
          <button onClick={() => setActiveTab('input')} className={`flex-1 sm:flex-none px-8 py-3 text-[10px] md:text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'input' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}>
            <LayoutDashboard size={16}/> 1. Input Data
          </button>
          <button onClick={() => setActiveTab('view')} className={`flex-1 sm:flex-none px-8 py-3 text-[10px] md:text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'view' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}>
            <TrendingUp size={16}/> 2. Visualisasi Timeline
          </button>
        </div>

        {/* TAB 1: PENGISIAN INPUT (Sekarang mengambil tinggi penuh) */}
        {activeTab === 'input' && (
          <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-[24px] shrink-0">
              <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide flex items-center gap-2"><LayoutDashboard size={16} className="text-blue-500" /> Daftar Pekerjaan</h4>
              <button onClick={() => setTasks([...tasks, { id: Date.now().toString(), name: '', start: '', end: '', actualStart: '', actualEnd: '', progress: 0 }])} className="text-[10px] font-bold bg-white border border-slate-200 text-blue-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-slate-50 shadow-sm"><Plus size={14} /> Tambah Item</button>
            </div>
            <div className="overflow-auto custom-scrollbar flex-1 min-h-0 pb-4">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
                  <tr className="text-[10px] font-black uppercase text-slate-500 tracking-wider border-b border-slate-200">
                    <th className="p-4 w-12 text-center">No</th>
                    <th className="p-4 min-w-[200px]">Item Pekerjaan</th>
                    <th className="p-4 w-56 text-center">Rencana (Mulai - Selesai)</th>
                    <th className="p-4 w-56 text-center">Realisasi (Mulai - Selesai)</th>
                    <th className="p-4 w-32">Progres (%)</th>
                    <th className="p-4 w-28 text-center"><Settings size={14} className="mx-auto" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasks.length === 0 ? (
                    <tr><td colSpan="6" className="p-16 text-center text-slate-400 text-sm font-bold bg-slate-50/50 border border-dashed border-slate-200 m-4 rounded-2xl">Belum ada jadwal. Klik "Tambah Item" untuk memulai mengisi data.</td></tr>
                  ) : tasks.map((t, i) => (
                    <tr key={t.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="p-4 text-center text-xs font-bold text-slate-400">{i + 1}</td>
                      <td className="p-4"><input type="text" className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:bg-white focus:border-blue-400 p-2.5 rounded-xl text-sm font-bold text-slate-700 outline-none transition-all" value={t.name} onChange={e => handleUpdateTask(i, 'name', e.target.value)} placeholder="Nama Pekerjaan..." /></td>
                      <td className="p-4">
                        <div className="flex gap-2 items-center bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                          <input type="date" className="w-full bg-transparent focus:bg-white focus:border-blue-400 p-2 rounded-lg text-[10px] font-bold text-slate-700 outline-none transition-all" value={t.start || ''} onChange={e => handleUpdateTask(i, 'start', e.target.value)} title="Rencana Mulai" />
                          <span className="text-slate-300">-</span>
                          <input type="date" className="w-full bg-transparent focus:bg-white focus:border-blue-400 p-2 rounded-lg text-[10px] font-bold text-slate-700 outline-none transition-all" value={t.end || ''} onChange={e => handleUpdateTask(i, 'end', e.target.value)} title="Rencana Selesai" />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 items-center bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                          <input type="date" className="w-full bg-transparent focus:bg-white focus:border-blue-400 p-2 rounded-lg text-[10px] font-bold text-slate-700 outline-none transition-all" value={t.actualStart || ''} onChange={e => handleUpdateTask(i, 'actualStart', e.target.value)} title="Realisasi Mulai" />
                          <span className="text-slate-300">-</span>
                          <input type="date" className="w-full bg-transparent focus:bg-white focus:border-blue-400 p-2 rounded-lg text-[10px] font-bold text-slate-700 outline-none transition-all" value={t.actualEnd || ''} onChange={e => handleUpdateTask(i, 'actualEnd', e.target.value)} title="Realisasi Selesai" />
                        </div>
                      </td>
                      <td className="p-4"><div className="flex items-center gap-2"><input type="number" min="0" max="100" className="w-20 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-400 p-2.5 rounded-xl text-xs font-bold text-slate-700 outline-none transition-all text-center" value={t.progress} onChange={e => handleUpdateTask(i, 'progress', e.target.value)} /> <span className="text-xs font-bold text-slate-400">%</span></div></td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleMoveTask(i, -1)} disabled={i === 0} className="p-2 text-slate-400 bg-slate-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all disabled:opacity-30 disabled:hover:bg-slate-50 disabled:hover:text-slate-400" title="Geser ke Atas"><ArrowUp size={14} /></button>
                          <button onClick={() => handleMoveTask(i, 1)} disabled={i === tasks.length - 1} className="p-2 text-slate-400 bg-slate-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all disabled:opacity-30 disabled:hover:bg-slate-50 disabled:hover:text-slate-400" title="Geser ke Bawah"><ArrowDown size={14} /></button>
                          <button onClick={() => setTasks(tasks.filter(item => item.id !== t.id))} className="p-2 text-rose-400 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all" title="Hapus"><Trash size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: TAMPILAN JADWAL GANTT CHART (Sekarang mengambil tinggi penuh) */}
        {activeTab === 'view' && (
          <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 z-10 shrink-0">
              <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide flex items-center gap-2"><TrendingUp size={16} className="text-blue-500" /> Visualisasi Timeline</h4>
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
              
              {/* Opsi Pilihan Warna Rencana (BARU DITAMBAHKAN) */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                 <span className={`w-3 h-3 rounded-sm border ${THEME_COLORS[theme.plan]?.legendMarker || THEME_COLORS.amber.legendMarker}`}></span>
                 Rencana:
                 <select value={theme.plan} onChange={e => handleThemeChange('plan', e.target.value)} className="ml-1 outline-none bg-transparent cursor-pointer font-black text-slate-700">
                   <option value="amber">Kuning</option>
                   <option value="blue">Biru</option>
                   <option value="emerald">Hijau</option>
                   <option value="rose">Merah</option>
                   <option value="purple">Ungu</option>
                   <option value="slate">Abu-abu</option>
                 </select>
              </div>

              {/* Opsi Pilihan Warna Realisasi */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                 <span className={`w-3 h-3 rounded-sm border ${THEME_COLORS[theme.actual]?.legendMarker || THEME_COLORS.blue.legendMarker}`}></span>
                 Realisasi:
                 <select value={theme.actual} onChange={e => handleThemeChange('actual', e.target.value)} className="ml-1 outline-none bg-transparent cursor-pointer font-black text-slate-700">
                   <option value="blue">Biru</option>
                   <option value="emerald">Hijau</option>
                   <option value="amber">Kuning</option>
                   <option value="rose">Merah</option>
                   <option value="purple">Ungu</option>
                   <option value="slate">Abu-abu</option>
                 </select>
              </div>

              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                 Rentang: {timelineInfo.days} Hari
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-auto relative custom-scrollbar flex p-4 bg-[#f8fafc]">
            <div className="flex flex-col sticky left-0 z-30 bg-white border-y border-l border-slate-200 shadow-[2px_0_10px_rgba(0,0,0,0.02)] w-[160px] md:w-[200px] shrink-0 rounded-l-xl">
              <div className="h-[72px] sticky top-0 bg-slate-50 border-b border-slate-200 z-40 flex items-center px-4 text-[10px] font-black uppercase text-slate-500 tracking-widest shrink-0 rounded-tl-xl shadow-sm">
                Item Pekerjaan
              </div>
              {tasks.map((t, i) => (
                <div key={t.id} className="h-14 px-4 flex items-center border-b border-slate-100 text-[11px] font-bold text-slate-700 truncate group relative shrink-0">
                  <span className="truncate w-full block" title={t.name}>{i + 1}. {t.name || 'Pekerjaan Baru'}</span>
                </div>
              ))}
            </div>

            {/* MENGUBAH FLEX-1 MENJADI UKURAN PASTI AGAR GRID TIDAK MELAR (STRETCH) */}
            <div className="flex flex-col relative bg-white border-y border-r border-slate-200 rounded-r-xl" style={{ width: `${timelineInfo.days * 28}px`, minWidth: `${timelineInfo.days * 28}px` }}>
              
              {/* Header Bulan & Tanggal */}
              <div className="flex flex-col sticky top-0 z-20 shadow-sm w-full shrink-0">
                {/* Baris Bulan */}
                <div className="h-8 flex border-b border-slate-200 bg-slate-100 w-full shrink-0 rounded-tr-xl overflow-hidden">
                  {(() => {
                    const months = [];
                    let currentMonthStr = '';
                    let currentMonthDays = 0;

                    for (let i = 0; i < timelineInfo.days; i++) {
                      const d = new Date(timelineInfo.start);
                      d.setDate(d.getDate() + i);
                      const monthName = d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });

                      if (i === 0) {
                        currentMonthStr = monthName;
                        currentMonthDays = 1;
                      } else if (monthName === currentMonthStr) {
                        currentMonthDays++;
                      } else {
                        months.push({ name: currentMonthStr, days: currentMonthDays });
                        currentMonthStr = monthName;
                        currentMonthDays = 1;
                      }

                      if (i === timelineInfo.days - 1) {
                        months.push({ name: currentMonthStr, days: currentMonthDays });
                      }
                    }

                    return months.map((m, idx) => (
                      <div key={idx} className="border-r border-slate-200 flex items-center justify-center text-[10px] font-black uppercase text-slate-600 bg-slate-200/50" style={{ width: `${m.days * 28}px`, minWidth: `${m.days * 28}px` }}>
                        <span className="truncate px-2">{m.name}</span>
                      </div>
                    ));
                  })()}
                </div>

                {/* Baris Tanggal */}
                <div className="h-10 flex border-b border-slate-100 bg-slate-50 w-full shrink-0">
                  {Array.from({ length: timelineInfo.days }).map((_, i) => {
                    const d = new Date(timelineInfo.start);
                    d.setDate(d.getDate() + i);
                    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                    return (
                      // MENGHAPUS FLEX-1 & MIN-W AGAR LEBAR KOTAK TANGGAL KONSISTEN DI ANGKA 28PX
                      <div key={i} className={`w-[28px] shrink-0 border-r border-slate-100 flex flex-col items-center justify-center text-[9px] font-mono ${isWeekend ? 'bg-rose-50/50 text-rose-500 font-bold' : 'text-slate-500'}`}>
                        <span className="font-bold">{d.getDate()}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="relative flex-1 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTI3LjUgMHYyOG0tMjcuNS0yOGgyOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZjFmNWY5IiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')]">
                {tasks.map((t, i) => {
                  
                  const getBarData = (startStr, endStr) => {
                    if (!startStr || !endStr) return { valid: false };
                    const sParts = startStr.split('-');
                    const eParts = endStr.split('-');
                    if (sParts.length !== 3 || eParts.length !== 3) return { valid: false };

                    const startDate = new Date(parseInt(sParts[0]), parseInt(sParts[1]) - 1, parseInt(sParts[2]));
                    const endDate = new Date(parseInt(eParts[0]), parseInt(eParts[1]) - 1, parseInt(eParts[2]));

                    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return { valid: false };

                    const startDiff = Math.round((startDate - timelineInfo.start) / (1000 * 60 * 60 * 24));
                    const dur = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                    return { left: Math.max(0, startDiff * 28), width: Math.max(0, dur * 28), valid: true, startDate, endDate };
                  };

                  const plan = getBarData(t.start, t.end);
                  const actual = getBarData(t.actualStart, t.actualEnd);

                  return (
                    <div key={t.id} className="h-14 border-b border-slate-100/50 flex flex-col relative group shrink-0">
                      
                      {/* Bar Rencana (Plan) Dinamis Diperbarui */}
                      {plan.valid && (
                        <div 
                          className={`absolute h-3.5 rounded-sm top-2 opacity-90 shadow-sm cursor-pointer hover:opacity-100 hover:shadow-md hover:-translate-y-[1px] transition-all z-10 ${THEME_COLORS[theme.plan]?.plan || THEME_COLORS.amber.plan}`} 
                          style={{ left: plan.left + 'px', width: plan.width + 'px' }}
                          title={`Rencana: ${plan.startDate.toLocaleDateString('id-ID')} s/d ${plan.endDate.toLocaleDateString('id-ID')}`}
                        />
                      )}

                      {/* Bar Realisasi (Actual) dengan Progres Dinamis */}
                      {actual.valid && (
                        <div 
                          className={`absolute h-5 rounded-md bottom-2 overflow-hidden shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-[1px] cursor-pointer z-10 ${THEME_COLORS[theme.actual]?.actualBg || THEME_COLORS.blue.actualBg}`} 
                          style={{ left: actual.left + 'px', width: actual.width + 'px' }}
                          title={`Realisasi: ${actual.startDate.toLocaleDateString('id-ID')} s/d ${actual.endDate.toLocaleDateString('id-ID')} (Progres: ${t.progress}%)`}
                        >
                          <div className={`h-full transition-all duration-500 ${THEME_COLORS[theme.actual]?.actualFill || THEME_COLORS.blue.actualFill}`} style={{ width: Math.min(100, Math.max(0, t.progress || 0)) + '%' }}></div>
                          <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white mix-blend-difference opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden px-1">
                            {t.progress}%
                          </div>
                        </div>
                      )}

                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          </div>
        )}

      </div>
    </div>
  );
};

const DokumentasiView = ({ feeds, onView, onDelete }) => {
  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const photos = useMemo(() => {
    let filtered = (feeds || []).filter(f => f.media_url);

    if (filterDate) {
      filtered = filtered.filter(f => {
        const localD = new Date(f.created_at);
        const pad = (n) => n.toString().padStart(2, '0');
        const dStr = `${localD.getFullYear()}-${pad(localD.getMonth() + 1)}-${pad(localD.getDate())}`;
        return dStr === filterDate;
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(f => String(f.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || String(f.description || '').toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return filtered;
  }, [feeds, filterDate, searchQuery]);

  return (
    <div className="h-full flex flex-col">
      <header className="px-6 py-6 md:px-10 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 gap-4 bg-white/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shadow-sm"><ImageIcon size={24} /></div>
          <div><h2 className="text-xl font-bold">Galeri Dokumentasi</h2><p className="text-[10px] text-slate-500 uppercase mt-0.5 tracking-widest font-bold">Kumpulan Foto & Video Lapangan</p></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 flex-1 sm:w-64 shadow-sm">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input type="text" placeholder="Cari foto..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full p-2 outline-none text-xs font-bold bg-transparent text-slate-700" />
          </div>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 shadow-sm shrink-0">
            <Clock size={16} className="text-slate-400 mr-2 shrink-0" />
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="p-2 outline-none text-[11px] font-bold bg-transparent text-slate-700 uppercase" />
            {filterDate && <button onClick={() => setFilterDate('')} className="text-rose-500 ml-2 hover:bg-rose-50 p-1 rounded transition-colors"><X size={14} /></button>}
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar">
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {photos.map(item => (
              <div key={item.display_id || item.id} className="group flex flex-col gap-3 bg-white p-3 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer relative" onClick={() => onView(item)}>
                <div className="h-32 sm:h-40 rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-200/50">
                  {isVideo(item.media_url) ? <video src={item.media_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <img src={item.media_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <button onClick={(e) => { e.stopPropagation(); onDelete({ id: item.original_id || item.id, type: 'media' }); }} className="absolute top-2 right-2 p-2 bg-white/90 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-10 hover:bg-rose-50 shadow-sm backdrop-blur-sm"><Trash size={14} /></button>
                  {item.is_problem && <div className="absolute bottom-2 left-2 bg-rose-500 text-white p-1 rounded-md shadow-md"><AlertCircle size={12} /></div>}
                </div>
                <div className="px-1">
                  <p className="text-[9px] font-bold text-slate-400 mb-1 flex items-center gap-1">{new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')}</p>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">{String(item.title || '')}</h4>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <ImageIcon size={48} className="mb-4 opacity-50" />
            <p className="text-sm font-bold uppercase tracking-widest text-center">Tidak ada dokumentasi ditemukan<br /><span className="text-[10px] font-medium opacity-70 mt-1 block">Silakan sesuaikan filter tanggal atau lakukan pencarian</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

const SiteMapView = ({ projectData, onUpdateRoutes, isUpdating, showMsg, feeds }) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showPlanEditor, setShowPlanEditor] = useState(false);
  const isInitialSiteFitDone = useRef(false); // State penanda untuk Peta Detail
  
  // plannedPath structure: [{ id: string, name: string, color: string, isDashed: boolean, points: [{lat, lng, sta}] }]
  const [plannedPath, setPlannedPath] = useState([]);
  const [actualSegments, setActualSegments] = useState([{ id: 1, name: 'Segmen 1', points: [] }]);
  const [inputMode, setInputMode] = useState('view');
  
  // --- MENYIMPAN PREFERENSI TAMPILAN PETA DI LOKAL MEMORI BROWSER ---
  const [showDistances, setShowDistances] = useState(() => {
    const saved = localStorage.getItem('map_showDistances');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showPaths, setShowPaths] = useState(() => {
    const saved = localStorage.getItem('map_showPaths');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showSketchLabels, setShowSketchLabels] = useState(() => {
    const saved = localStorage.getItem('map_showSketchLabels');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showSketchPoints, setShowSketchPoints] = useState(() => {
    const saved = localStorage.getItem('map_showSketchPoints');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showPhotos, setShowPhotos] = useState(() => {
    const saved = localStorage.getItem('map_showPhotos');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Efek untuk menyimpan ke memori setiap kali tombol diklik/diubah
  useEffect(() => { localStorage.setItem('map_showDistances', JSON.stringify(showDistances)); }, [showDistances]);
  useEffect(() => { localStorage.setItem('map_showPaths', JSON.stringify(showPaths)); }, [showPaths]);
  useEffect(() => { localStorage.setItem('map_showSketchLabels', JSON.stringify(showSketchLabels)); }, [showSketchLabels]);
  useEffect(() => { localStorage.setItem('map_showSketchPoints', JSON.stringify(showSketchPoints)); }, [showSketchPoints]);
  useEffect(() => { localStorage.setItem('map_showPhotos', JSON.stringify(showPhotos)); }, [showPhotos]);

  const mapContainerRef = useRef(null); const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null); const routeLayerRef = useRef(null); const surveyLayerRef = useRef(null); const photoLayerRef = useRef(null);
  const kmlInputRef = useRef(null);

  // --- FUNGSI IMPORT KML ---
  const handleImportKML = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const kmlText = event.target.result;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kmlText, "text/xml");

        const placemarks = xmlDoc.getElementsByTagName("Placemark");
        const importedPaths = [];

        for (let i = 0; i < placemarks.length; i++) {
          const placemark = placemarks[i];
          const lineString = placemark.getElementsByTagName("LineString")[0];
          const polygon = placemark.getElementsByTagName("Polygon")[0];
          
          if (lineString || polygon) {
            const nameElement = placemark.getElementsByTagName("name")[0];
            const name = nameElement ? nameElement.textContent : (polygon ? `Poligon Import ${i + 1}` : `Jalur Import ${i + 1}`);
            
            const targetElement = polygon || lineString;
            const coordElement = targetElement.getElementsByTagName("coordinates")[0];
            if (coordElement) {
              const coordText = coordElement.textContent.trim();
              const coordPairs = coordText.split(/\s+/);
              
              const points = [];
              coordPairs.forEach((pair, idx) => {
                const [lng, lat] = pair.split(','); // KML format is Lng,Lat,Alt
                if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                  points.push({ lat: parseFloat(lat), lng: parseFloat(lng), sta: `T-${idx + 1}` });
                }
              });

              if (points.length > 0) {
                importedPaths.push({
                  id: `import-${Date.now()}-${i}`,
                  name: name,
                  type: polygon ? 'polygon' : 'line',
                  color: polygon ? '#10b981' : '#3b82f6',
                  isDashed: !polygon,
                  points: points
                });
              }
            }
          }
        }

        if (importedPaths.length > 0) {
          setPlannedPath(prev => [...(prev || []), ...importedPaths]);
          if (showMsg) showMsg(`Berhasil mengimpor ${importedPaths.length} sketsa dari KML`, "success");
          
          if (window.L && mapInstanceRef.current) {
            let bounds = window.L.latLngBounds();
            importedPaths.forEach(path => {
              path.points.forEach(pt => {
                bounds.extend([pt.lat, pt.lng]);
              });
            });
            if (bounds.isValid()) {
              mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
            }
          }

          // Buka Editor Rute otomatis jika belum terbuka
          if (!showPlanEditor) {
              setShowPlanEditor(true);
              setInputMode('plan');
          }
        } else {
           if (showMsg) showMsg("Tidak ditemukan jalur atau poligon pada file KML ini", "warning");
        }
      } catch (err) {
        if (showMsg) showMsg("Gagal memparsing file KML", "error");
      }
    };
    reader.readAsText(file);
    // Reset input agar bisa import file yang sama lagi jika perlu
    e.target.value = null;
  };

  // --- FUNGSI EXPORT KE KML ---
  const handleExportKML = () => {
    let kml = `<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n  <Document>\n    <name>Export Peta - ${projectData?.pekerjaan || 'Proyek'}</name>\n`;

    // Style Garis Default (Warna dalam format AABBGGRR di KML)
    kml += `    <Style id="styleRealisasi"><LineStyle><color>ffeb6325</color><width>5</width></LineStyle></Style>\n`;

    // 1. Ekstrak Jalur Sketsa Rencana
    if (plannedPath && plannedPath.length > 0) {
      kml += `    <Folder><name>Sketsa (Rencana & Poligon)</name>\n`;
      plannedPath.forEach(path => {
        if (path.points && path.points.length > 0) {
          // Konversi warna HEX ke format KML (AABBGGRR)
          const customColor = path.color ? path.color.replace('#', '') : (path.type === 'polygon' ? '10b981' : 'f59e0b');
          const r = customColor.substring(0, 2); 
          const g = customColor.substring(2, 4); 
          const b = customColor.substring(4, 6);
          const kmlColor = `ff${b}${g}${r}`;

          kml += `      <Placemark>\n        <name>${path.name}</name>\n`;
          
          if (path.type === 'polygon') {
            let coords = path.points.map(p => `${p.lng},${p.lat},0`);
            // Pastikan titik awal dan akhir sama agar poligon menutup di KML
            if (coords.length > 0 && coords[0] !== coords[coords.length - 1]) { coords.push(coords[0]); }
            kml += `        <Style><LineStyle><color>${kmlColor}</color><width>3</width></LineStyle><PolyStyle><color>66${b}${g}${r}</color></PolyStyle></Style>\n`;
            kml += `        <Polygon><outerBoundaryIs><LinearRing><coordinates>${coords.join(' ')}</coordinates></LinearRing></outerBoundaryIs></Polygon>\n      </Placemark>\n`;
          } else {
            const coords = path.points.map(p => `${p.lng},${p.lat},0`).join(' ');
            kml += `        <Style><LineStyle><color>${kmlColor}</color><width>4</width></LineStyle></Style>\n`;
            kml += `        <LineString><tessellate>1</tessellate><coordinates>${coords}</coordinates></LineString>\n      </Placemark>\n`;
          }
        }
      });
      kml += `    </Folder>\n`;
    }

    // 2. Ekstrak Segmen Realisasi (Aktual)
    if (actualSegments && actualSegments.length > 0) {
      kml += `    <Folder><name>Realisasi Segmen (Aktual)</name>\n`;
      actualSegments.forEach(seg => {
        if (seg.points && seg.points.length > 0) {
          kml += `      <Placemark>\n        <name>${seg.name}</name>\n        <styleUrl>#styleRealisasi</styleUrl>\n`;
          const coordsStr = seg.points.map(p => `${p.lng},${p.lat},0`).join(' ');
          kml += `        <LineString><tessellate>1</tessellate><coordinates>${coordsStr}</coordinates></LineString>\n      </Placemark>\n`;

          kml += `      <Placemark>\n        <name>Awal ${seg.name}</name>\n        <Point><coordinates>${seg.points[0].lng},${seg.points[0].lat},0</coordinates></Point>\n      </Placemark>\n`;

          let endPt = seg.boundary_end || (seg.points.length > 1 ? seg.points[seg.points.length - 1] : null);
          if (endPt) {
             kml += `      <Placemark>\n        <name>Akhir ${seg.name}</name>\n        <Point><coordinates>${endPt.lng},${endPt.lat},0</coordinates></Point>\n      </Placemark>\n`;
          }
        }
      });
      kml += `    </Folder>\n`;
    }

    kml += `  </Document>\n</kml>`;

    // Download File .kml
    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Peta_SynxBuild_${(projectData?.pekerjaan || 'Proyek').replace(/[^a-z0-9]/gi, '_')}.kml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    if (showMsg) showMsg("Berhasil Mengunduh File KML", "success");
  };

  useEffect(() => {
    if (projectData) {
      // Handle legacy planned_path data format and convert to new format
      let initialPlannedPath = [];
      if (projectData.planned_path && Array.isArray(projectData.planned_path)) {
        if (projectData.planned_path.length > 0 && !Array.isArray(projectData.planned_path[0]) && !projectData.planned_path[0].points) {
           // Legacy single path flat array
           initialPlannedPath = [{ id: 'path-1', name: 'Jalur 1', color: '#f59e0b', isDashed: true, points: projectData.planned_path }];
        } else if (projectData.planned_path.length > 0 && Array.isArray(projectData.planned_path[0])) {
           // Legacy array of arrays
           initialPlannedPath = projectData.planned_path.map((path, idx) => ({
             id: `path-${idx+1}`, name: `Jalur ${idx+1}`, color: '#f59e0b', isDashed: true, points: path
           }));
        } else {
           // Assume new format or empty
           initialPlannedPath = projectData.planned_path;
        }
      }
      setPlannedPath(initialPlannedPath);

      if (projectData.actual_segments_data && Array.isArray(projectData.actual_segments_data)) {
        // Konversi format lama (startLat, startLng, dll) menjadi array points
        const formattedSegs = projectData.actual_segments_data.map(seg => {
            if (seg.points) {
                return seg;
            }
            const pts = [];
            let boundaryEnd = null;
            if (seg.startLat && seg.startLng) pts.push({lat: parseFloat(seg.startLat), lng: parseFloat(seg.startLng)});
            if (seg.endLat && seg.endLng) boundaryEnd = {lat: parseFloat(seg.endLat), lng: parseFloat(seg.endLng)};
            return { ...seg, points: pts, boundary_end: boundaryEnd };
        });
        setActualSegments(formattedSegs);
      } else {
        const pts = [];
        let boundaryEnd = null;
        if (projectData.start_lat && projectData.start_lng) pts.push({lat: parseFloat(projectData.start_lat), lng: parseFloat(projectData.start_lng)});
        if (projectData.end_lat && projectData.end_lng) boundaryEnd = {lat: parseFloat(projectData.end_lat), lng: parseFloat(projectData.end_lng)};
        setActualSegments([{ id: 1, name: 'Segmen 1', points: pts, boundary_end: boundaryEnd }]);
      }
    }
  }, [projectData]);

  useEffect(() => {
    const checkLeaflet = setInterval(() => {
      if (window.L) { setIsMapLoaded(true); clearInterval(checkLeaflet); }
    }, 100);
    return () => clearInterval(checkLeaflet);
  }, []);

  useEffect(() => {
    if (isMapLoaded && mapContainerRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = window.L.map(mapContainerRef.current, { zoomControl: false, attributionControl: false }).setView([-0.4948, 117.1492], 15);
      
      // Memunculkan kembali tombol zoom di posisi kiri bawah agar tidak tertutup Legenda / Menu
      window.L.control.zoom({ position: 'bottomleft' }).addTo(mapInstanceRef.current);
      
      routeLayerRef.current = window.L.layerGroup().addTo(mapInstanceRef.current);
      surveyLayerRef.current = window.L.layerGroup().addTo(mapInstanceRef.current);
      photoLayerRef.current = window.L.layerGroup().addTo(mapInstanceRef.current);
    }
  }, [isMapLoaded]);

  useEffect(() => {
    if (isMapLoaded && mapInstanceRef.current) {
      if (tileLayerRef.current) mapInstanceRef.current.removeLayer(tileLayerRef.current);
      
      let url = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&apistyle=s.t%3A2%7Cp.v%3Aoff'; // Default Google Satellite
      let attribution = '';

      tileLayerRef.current = window.L.tileLayer(url, { maxNativeZoom: 19, maxZoom: 22, attribution }).addTo(mapInstanceRef.current);
    }
  }, [isMapLoaded]);

  useEffect(() => {
    if (isMapLoaded && mapInstanceRef.current) {
      const handleMapClick = (e) => {
        if (inputMode === 'plan' || inputMode === 'plan_polygon') {
          setPlannedPath(prev => {
            const newPaths = [...(prev || [])];
            const targetType = inputMode === 'plan' ? 'line' : 'polygon';
            let lastItem = newPaths[newPaths.length - 1];
            let lastType = lastItem ? (lastItem.type || 'line') : null;

            if (newPaths.length === 0 || lastType !== targetType) {
              newPaths.push({ 
                id: `path-${Date.now()}`, 
                name: targetType === 'line' ? `Jalur ${newPaths.length + 1}` : `Poligon ${newPaths.length + 1}`, 
                type: targetType,
                color: targetType === 'line' ? '#f59e0b' : '#10b981', 
                isDashed: targetType === 'line', 
                points: [] 
              });
            }
            const idx = newPaths.length - 1;
            newPaths[idx] = { 
              ...newPaths[idx], 
              points: [...(newPaths[idx].points || []), { lat: e.latlng.lat, lng: e.latlng.lng, sta: `T-${(newPaths[idx].points || []).length + 1}` }] 
            };
            return newPaths;
          });
        } else if (inputMode === 'actual') {
          setActualSegments(prev => {
            const newSegs = [...(prev || [])];
            if (newSegs.length === 0) {
              newSegs.push({ id: Date.now(), name: 'Segmen 1', points: [] });
            }
            const idx = newSegs.length - 1;
            newSegs[idx] = {
              ...newSegs[idx],
              points: [...(newSegs[idx].points || []), { lat: e.latlng.lat, lng: e.latlng.lng }]
            };
            return newSegs;
          });
        }
      };
      mapInstanceRef.current.on('click', handleMapClick);
      return () => { if (mapInstanceRef.current) mapInstanceRef.current.off('click', handleMapClick); };
    }
  }, [isMapLoaded, inputMode, plannedPath, actualSegments]);

  const handleUpdateSeg = (id, field, value) => {
    setActualSegments(p => (p || []).map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleUpdatePath = (id, field, value) => {
    setPlannedPath(p => (p || []).map(path => path.id === id ? { ...path, [field]: value } : path));
  };

  const handleDeletePath = (id) => {
    setPlannedPath(p => (p || []).filter(path => path.id !== id));
  };

  const handleDeletePoint = (pathId, pointIdx) => {
    setPlannedPath(p => (p || []).map(path => {
      if (path.id === pathId) {
        const newPoints = [...path.points];
        newPoints.splice(pointIdx, 1);
        // Rename stations to keep order
        newPoints.forEach((pt, i) => pt.sta = `T-${i + 1}`);
        return { ...path, points: newPoints };
      }
      return path;
    }));
  };

  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current) return;
    routeLayerRef.current.clearLayers(); surveyLayerRef.current.clearLayers();

    const createSimplePointMarker = (color) => {
        return window.L.divIcon({
          className: 'bg-transparent border-0',
          html: `<div style="transform: translate(-50%, -50%); background-color: ${color};" class="w-3 h-3 border-2 border-white rounded-full shadow-md"></div>`,
          iconSize: [0, 0]
        });
    };

    const createMarker = (theme, prefix, segName, lat, lng) => {
        const stop1 = theme === 'Blue' ? '#38bdf8' : '#fb7185';
        const stop2 = theme === 'Blue' ? '#2563eb' : '#e11d48';
        const textColor = theme === 'Blue' ? 'text-blue-600' : 'text-rose-600';

        return window.L.divIcon({
          className: 'bg-transparent border-0 overflow-visible',
          html: `<div class="relative flex flex-col items-center group cursor-pointer pointer-events-auto" style="transform: translate(-50%, -50%);">
                   <div class="absolute bottom-full mb-1.5 px-2 py-1 bg-white/95 backdrop-blur-md rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.15)] border border-slate-200/50 whitespace-nowrap text-center z-[9999] opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 pointer-events-none origin-bottom">
                      <div class="text-[8px] font-black uppercase tracking-wide leading-tight text-slate-800"><span class="${textColor}">${prefix}</span><br/>${segName}</div>
                      <div class="text-[7.5px] font-bold text-slate-500 mt-0.5 tracking-wider font-mono">${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}</div>
                   </div>
                   <div class="w-3.5 h-3.5 rounded-full border-2 border-white shadow-md relative origin-bottom group-hover:scale-110 transition-all duration-300" style="background: linear-gradient(to bottom, ${stop1}, ${stop2});"></div>
                 </div>`,
          iconSize: [0, 0]
        });
    };

    const createSurveyPinMarker = (theme, prefix, segName, lat, lng) => {
      const gradId = theme === 'Blue' ? 'gradBlueMapPin' : 'gradRedMapPin';
      const stop1 = theme === 'Blue' ? '#38bdf8' : '#fb7185';
      const stop2 = theme === 'Blue' ? '#2563eb' : '#e11d48';
      const textColor = theme === 'Blue' ? 'text-blue-600' : 'text-rose-600';

      return window.L.divIcon({
        className: 'bg-transparent border-0 overflow-visible',
        html: `<div class="relative flex flex-col items-center group cursor-pointer pointer-events-auto" style="transform: translate(-50%, -100%);">
                 <div class="absolute bottom-full mb-2.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.15)] border border-slate-200/50 whitespace-nowrap text-center z-[9999] opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 pointer-events-none origin-bottom">
                    <div class="text-[10px] font-black uppercase tracking-wide leading-tight text-slate-800"><span class="${textColor}">${prefix}</span><br/>${segName}</div>
                    <div class="text-[8.5px] font-bold text-slate-500 mt-1 tracking-wider font-mono">${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}</div>
                 </div>
                 <div class="relative origin-bottom group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-300">
                    <svg width="28" height="38" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 6px 8px rgba(0,0,0,0.4));">
                      <defs>
                        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stop-color="${stop1}" />
                          <stop offset="100%" stop-color="${stop2}" />
                        </linearGradient>
                      </defs>
                      <circle cx="192" cy="192" r="80" fill="white" />
                      <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" fill="url(#${gradId})" />
                    </svg>
                 </div>
               </div>`,
        iconSize: [0, 0]
      });
    };

    const createDistLabel = (text, isTotal, colorHex) => window.L.divIcon({
      className: 'bg-transparent border-0 overflow-visible',
      html: `<div style="transform: translate(-50%, ${isTotal ? '-150%' : '-50%'}); background-color: ${isTotal ? colorHex : 'rgba(255,255,255,0.9)'}; color: ${isTotal ? '#fff' : colorHex}; border-color: ${colorHex};" class="w-max px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap border shadow-sm">${isTotal ? 'Total: ' : ''}${text}</div>`,
      iconSize: [0, 0]
    });

    if (showPaths && plannedPath && plannedPath.length > 0) {
      plannedPath.forEach((pathObj) => {
        if (!pathObj || !pathObj.points || pathObj.points.length === 0) return;
        const coords = pathObj.points.map(p => [parseFloat(p.lat), parseFloat(p.lng)]).filter(c => !isNaN(c[0]) && !isNaN(c[1]));
        if (coords.length > 0) {
          const isPolygon = pathObj.type === 'polygon';
          let shape;

          if (isPolygon) {
            shape = window.L.polygon(coords, {
              color: pathObj.color || '#10b981',
              weight: 3,
              fillColor: pathObj.color || '#10b981',
              fillOpacity: 0.3,
              dashArray: pathObj.isDashed ? '10, 10' : null
            }).addTo(routeLayerRef.current);
          } else {
            shape = window.L.polyline(coords, { 
              color: pathObj.color || '#f59e0b', 
              weight: 4, 
              opacity: 0.8, 
              dashArray: pathObj.isDashed ? '10, 10' : null 
            }).addTo(routeLayerRef.current);
          }

          // TAMPILKAN NAMA/KETERANGAN JALUR DI TENGAH GARIS
          if (showSketchLabels) {
            const center = shape.getBounds().getCenter();
            window.L.marker(center, {
              interactive: false,
              zIndexOffset: 100,
              icon: window.L.divIcon({
                className: 'bg-transparent border-0 overflow-visible',
                html: `<div style="transform: translate(-50%, -150%); background-color: rgba(255,255,255,0.95); color: ${pathObj.color || (isPolygon ? '#10b981' : '#f59e0b')}; border: 2px ${pathObj.isDashed ? 'dashed' : 'solid'} ${pathObj.color || (isPolygon ? '#10b981' : '#f59e0b')};" class="w-max px-3 py-1.5 rounded-xl text-[10px] font-black whitespace-nowrap shadow-lg uppercase tracking-wider backdrop-blur-md">${pathObj.name || (isPolygon ? 'Poligon' : 'Garis Sketsa')}</div>`,
                iconSize: [0, 0]
              })
            }).addTo(routeLayerRef.current);
          }

          let segmentTotalDist = 0;
          for (let i = 0; i < coords.length; i++) {
            // Draw marker point
            if (showSketchPoints) {
              window.L.marker([coords[i][0], coords[i][1]], { 
                interactive: false,
                zIndexOffset: 150,
                icon: window.L.divIcon({ 
                  className: 'bg-transparent border-0', 
                  html: `<div style="transform: translate(-50%, -50%); background-color: ${pathObj.color || (isPolygon ? '#10b981' : '#f59e0b')};" class="w-3 h-3 border-2 border-white rounded-full shadow-md"></div>`, 
                  iconSize: [0, 0] 
                }) 
              }).addTo(routeLayerRef.current);
            }
            
            // Calculate distance and draw intermediate labels
            if (i < coords.length - 1) {
              const pt1 = window.L.latLng(coords[i][0], coords[i][1]); const pt2 = window.L.latLng(coords[i + 1][0], coords[i + 1][1]);
              const dist = pt1.distanceTo(pt2); segmentTotalDist += dist;
              if (showDistances) window.L.marker([(pt1.lat + pt2.lat) / 2, (pt1.lng + pt2.lng) / 2], { interactive: false, zIndexOffset: 200, icon: createDistLabel(dist > 1000 ? `${(dist / 1000).toFixed(2)} km` : `${Math.round(dist)} m`, false, pathObj.color || (isPolygon ? '#10b981' : '#f59e0b')) }).addTo(routeLayerRef.current);
            }
            
            // Draw total distance label at the last point
            if (showDistances && i === coords.length - 1 && i > 0) {
              let closeDist = 0;
              if (isPolygon && coords.length > 2) {
                  const ptStart = window.L.latLng(coords[0][0], coords[0][1]);
                  const ptEnd = window.L.latLng(coords[i][0], coords[i][1]);
                  closeDist = ptStart.distanceTo(ptEnd);
                  
                  // Menambahkan label jarak untuk garis penutup (closing segment) pada Poligon
                  window.L.marker([(ptStart.lat + ptEnd.lat) / 2, (ptStart.lng + ptEnd.lng) / 2], {
                      interactive: false,
                      zIndexOffset: 200,
                      icon: createDistLabel(closeDist > 1000 ? `${(closeDist / 1000).toFixed(2)} km` : `${Math.round(closeDist)} m`, false, pathObj.color || '#10b981')
                  }).addTo(routeLayerRef.current);
              }
              const finalDist = segmentTotalDist + closeDist;
              window.L.marker([coords[i][0], coords[i][1]], { interactive: false, zIndexOffset: 200, icon: createDistLabel(finalDist > 1000 ? `${(finalDist / 1000).toFixed(2)} km` : `${Math.round(finalDist)} m${isPolygon?' (Keliling)':''}`, true, pathObj.color || (isPolygon ? '#10b981' : '#f59e0b')) }).addTo(routeLayerRef.current);
            }
          }
        }
      });
    }

    let actualBounds = window.L.latLngBounds();
    let hasActualData = false;

    (actualSegments || []).forEach((seg, idx) => {
      if (seg.points && seg.points.length > 0) {
        const coords = seg.points.map(p => [parseFloat(p.lat), parseFloat(p.lng)]).filter(c => !isNaN(c[0]) && !isNaN(c[1]));
        
        // GABUNGKAN TITIK AKHIR (BOUNDARY) JIKA ADA AGAR GARIS TERBENTUK UNTUK 2 TITIK SAJA
        // if (coords.length === 1 && seg.boundary_end && !isNaN(parseFloat(seg.boundary_end.lat))) {
        //     coords.push([parseFloat(seg.boundary_end.lat), parseFloat(seg.boundary_end.lng)]);
        // }

        if (coords.length > 0) {
          
          // Gambar Garis Realisasi JIKA ADA pergerakan rute (lebih dari 1 titik)
          if (coords.length > 1) {
             const actualShape = window.L.polyline(coords, {
               color: '#3b82f6', // Biru Realisasi
               weight: 5,
               opacity: 0.9,
             }).addTo(surveyLayerRef.current);

             // TAMPILKAN NAMA/KETERANGAN JALUR REALISASI DI TENGAH GARIS
             if (showSketchLabels) {
                const center = actualShape.getBounds().getCenter();
                window.L.marker(center, {
                  interactive: false,
                  zIndexOffset: 110,
                  icon: window.L.divIcon({
                    className: 'bg-transparent border-0 overflow-visible',
                    html: `<div style="transform: translate(-50%, 50%); background-color: rgba(255,255,255,0.95); color: #2563eb; border: 2px solid #3b82f6;" class="w-max px-3 py-1.5 rounded-xl text-[10px] font-black whitespace-nowrap shadow-lg uppercase tracking-wider backdrop-blur-md">${seg.name || 'Segmen Realisasi'}</div>`,
                    iconSize: [0, 0]
                  })
                }).addTo(surveyLayerRef.current);
             }
          }

          // Gambar garis putus-putus ke titik target akhir (Boundary End)
          if (seg.boundary_end && !isNaN(parseFloat(seg.boundary_end.lat))) {
             const lastPt = coords[coords.length - 1];
             const boundaryPt = [parseFloat(seg.boundary_end.lat), parseFloat(seg.boundary_end.lng)];
             window.L.polyline([lastPt, boundaryPt], { 
                color: '#3b82f6', 
                weight: 3, 
                opacity: 0.5, 
                dashArray: '8, 8' 
             }).addTo(surveyLayerRef.current);
          }

          if (showSketchPoints) {
            // Tambahkan titik (point) biasa untuk setiap koordinat rute yang berjalan
            coords.forEach(coord => {
               window.L.marker(coord, { icon: createSimplePointMarker('#3b82f6'), zIndexOffset: 4500 }).addTo(surveyLayerRef.current);
            });
          }

          // HANYA GAMBAR PIN MAP/ICON JIKA DATA BERASAL DARI INPUT SURVEI (Memiliki boundary_end)
          if (seg.boundary_end && !isNaN(parseFloat(seg.boundary_end.lat))) {
              // Pin Awal Survei (Biru)
              window.L.marker(coords[0], { icon: createSurveyPinMarker('Blue', `Awal Survei`, seg.name, coords[0][0], coords[0][1]), zIndexOffset: 5000 }).addTo(surveyLayerRef.current);
              
              // Pin Akhir Survei (Merah)
              window.L.marker([parseFloat(seg.boundary_end.lat), parseFloat(seg.boundary_end.lng)], { icon: createSurveyPinMarker('Red', `Akhir Survei`, seg.name, parseFloat(seg.boundary_end.lat), parseFloat(seg.boundary_end.lng)), zIndexOffset: 5000 }).addTo(surveyLayerRef.current);
              
              actualBounds.extend([parseFloat(seg.boundary_end.lat), parseFloat(seg.boundary_end.lng)]);
          }

          actualBounds.extend(coords[0]);
          if (coords.length > 1) {
              actualBounds.extend(coords[coords.length - 1]);
          }

          // Tambahkan label jarak antar titik realisasi jika showDistances aktif
          if (showDistances && coords.length > 1) {
             let segmentTotalDist = 0;
             for (let i = 0; i < coords.length - 1; i++) {
                const pt1 = window.L.latLng(coords[i][0], coords[i][1]); 
                const pt2 = window.L.latLng(coords[i + 1][0], coords[i + 1][1]);
                const dist = pt1.distanceTo(pt2); 
                segmentTotalDist += dist;
                window.L.marker([(pt1.lat + pt2.lat) / 2, (pt1.lng + pt2.lng) / 2], { interactive: false, zIndexOffset: 200, icon: createDistLabel(dist > 1000 ? `${(dist / 1000).toFixed(2)} km` : `${Math.round(dist)} m`, false, '#3b82f6') }).addTo(surveyLayerRef.current);
             }
             const lastPt = coords[coords.length - 1];
             window.L.marker([lastPt[0], lastPt[1]], { interactive: false, zIndexOffset: 200, icon: createDistLabel(segmentTotalDist > 1000 ? `${(segmentTotalDist / 1000).toFixed(2)} km` : `${Math.round(segmentTotalDist)} m`, true, '#3b82f6') }).addTo(surveyLayerRef.current);
          }

          hasActualData = true;
        }
      }
    });

    if (!showPlanEditor && inputMode === 'view' && hasActualData) {
      if (!isInitialSiteFitDone.current && actualBounds.isValid()) {
         mapInstanceRef.current.fitBounds(actualBounds, { padding: [50, 50], maxZoom: 17 });
         isInitialSiteFitDone.current = true;
      }
    }
  }, [isMapLoaded, plannedPath, actualSegments, showPaths, showDistances, showSketchLabels, showSketchPoints, inputMode, showPlanEditor]);

  // --- EFEK BARU: MENAMPILKAN FOTO MARKER DI PETA ---
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current || !photoLayerRef.current) return;
    photoLayerRef.current.clearLayers();

    if (showPhotos && feeds && feeds.length > 0) {
        // Hapus filter yang membatasi hanya 'Update Progress Rute Realisasi' agar foto survei juga bisa muncul
        // Namun kita tetap harus mengekstrak koordinat dari deskripsi
        const photoFeeds = feeds.filter(f => f.media_url);
        
        photoFeeds.forEach(feed => {
            const desc = feed.description || '';
            const latMatch = desc.match(/Lat\s*([-0-9.]+)/) || desc.match(/Awal\s*\(([-0-9.]+)/);
            const lngMatch = desc.match(/Lng\s*([-0-9.]+)/) || desc.match(/Awal\s*\([^,]+,\s*([-0-9.]+)/);

            if (latMatch && lngMatch) {
                const lat = parseFloat(latMatch[1]);
                const lng = parseFloat(lngMatch[1]);
                const firstImage = feed.media_url.split(',')[0];
                const isVid = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(firstImage || '');

                if (!isNaN(lat) && !isNaN(lng)) {
                     const iconHtml = `
                        <div class="relative flex flex-col items-center group cursor-pointer pointer-events-auto" style="transform: translate(-50%, -100%);">
                            <div class="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-[10000] pointer-events-none whitespace-nowrap bg-white text-slate-800 text-[10px] font-bold py-1.5 px-2.5 rounded-lg shadow-xl border border-slate-200">
                                ${new Date(feed.created_at).toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'})}
                            </div>
                            <div class="w-[160px] h-[110px] bg-white p-1.5 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.3)] relative z-10 group-hover:scale-[1.4] group-hover:-translate-y-2 transition-transform duration-300 origin-bottom border border-slate-200/80 overflow-hidden">
                                ${isVid ? 
                                    `<video src="${firstImage}" class="w-full h-full object-cover rounded-lg bg-slate-800"></video>
                                     <div class="absolute inset-0 flex items-center justify-center pointer-events-none"><svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>` : 
                                    `<img src="${firstImage}" loading="lazy" class="w-full h-full object-cover rounded-lg bg-slate-100" />`
                                }
                            </div>
                            <div class="w-4 h-4 bg-white rotate-45 -mt-2.5 shadow-[2px_2px_5px_rgba(0,0,0,0.15)] relative z-0 border-r border-b border-slate-200/80"></div>
                        </div>
                     `;
                     window.L.marker([lat, lng], {
                        icon: window.L.divIcon({
                            className: 'bg-transparent border-0 overflow-visible',
                            html: iconHtml,
                            iconSize: [0,0]
                        }),
                        zIndexOffset: 6000
                     }).addTo(photoLayerRef.current);
                }
            }
        });
    }
  }, [isMapLoaded, feeds, showPhotos]);

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-slate-900 rounded-3xl">
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />
      
      {/* --- LEGENDA PETA --- */}
      <div className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-4 flex flex-col gap-3 pointer-events-auto">
        <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-200/50 pb-2">Legenda Peta</h4>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="lgBlue" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#2563eb"/></linearGradient></defs>
              <circle cx="192" cy="192" r="80" fill="white" />
              <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" fill="url(#lgBlue)" />
            </svg>
            <span className="truncate text-xs font-medium text-slate-700">Awal Pekerjaan</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="lgRed" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#fb7185"/><stop offset="100%" stopColor="#e11d48"/></linearGradient></defs>
              <circle cx="192" cy="192" r="80" fill="white" />
              <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" fill="url(#lgRed)" />
            </svg>
            <span className="truncate text-xs font-medium text-slate-700">Akhir Pekerjaan</span>
          </div>
          
          {/* --- MENAMPILKAN JALUR DINAMIS DI LEGENDA --- */}
          {showPaths && (plannedPath && plannedPath.length > 0 ? (
            plannedPath.map(path => (
              <div key={path.id} className="flex items-center gap-3">
                {path.type === 'polygon' ? (
                  <div className="w-4 h-3 border-2 bg-opacity-30 shrink-0" style={{ borderColor: path.color || '#10b981', backgroundColor: path.color || '#10b981' }}></div>
                ) : (
                  <div className="w-4 h-1 border-t-[3px] shrink-0" style={{ borderColor: path.color || '#f59e0b', borderStyle: path.isDashed ? 'dashed' : 'solid' }}></div>
                )}
                <span className="truncate max-w-[140px] text-xs font-medium text-slate-700" title={path.name}>{path.name || (path.type === 'polygon' ? 'Poligon' : 'Garis Sketsa')}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-4 h-1 border-t-[3px] border-dashed border-amber-500 shrink-0"></div>
              <span className="truncate text-xs font-medium text-slate-700">Garis Sketsa</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex flex-col items-end gap-2 pointer-events-auto">
        <button onClick={() => setShowPaths(!showPaths)} className={`bg-white p-2 sm:px-3 sm:py-2 sm:w-[130px] rounded-xl shadow-md text-[10px] sm:text-[11px] font-bold flex items-center justify-center sm:justify-start gap-2 border border-slate-100 hover:bg-slate-50 transition-all ${!showPaths ? 'text-slate-400' : 'text-blue-600'}`}>
          {showPaths ? <Eye size={16} className="shrink-0" /> : <EyeOff size={16} className="shrink-0" />} 
          <span className="hidden sm:inline truncate">Jalur (Sketsa)</span>
        </button>
        
        <button onClick={() => setShowPhotos(!showPhotos)} className={`bg-white p-2 sm:px-3 sm:py-2 sm:w-[130px] rounded-xl shadow-md text-[10px] sm:text-[11px] font-bold flex items-center justify-center sm:justify-start gap-2 border border-slate-100 hover:bg-slate-50 transition-all ${!showPhotos ? 'text-slate-400' : 'text-rose-500'}`}>
          <ImageIcon size={16} className="shrink-0" /> <span className="hidden sm:inline truncate">Foto Rute</span>
        </button>

        <input type="file" accept=".kml" ref={kmlInputRef} onChange={handleImportKML} className="hidden" />
        
        <button onClick={() => kmlInputRef.current?.click()} className="bg-white text-slate-700 p-2 sm:px-3 sm:py-2 sm:w-[130px] rounded-xl shadow-md text-[10px] sm:text-[11px] font-bold flex items-center justify-center sm:justify-start gap-2 border border-slate-100 hover:bg-slate-50 transition-all">
          <Upload size={16} className="text-emerald-600 shrink-0" /> <span className="hidden sm:inline truncate">Import KML</span>
        </button>
        
        <button onClick={handleExportKML} className="bg-emerald-600 text-white p-2 sm:px-3 sm:py-2 sm:w-[130px] rounded-xl shadow-md text-[10px] sm:text-[11px] font-bold flex items-center justify-center sm:justify-start gap-2 border border-emerald-500 hover:bg-emerald-700 transition-all">
          <Download size={16} className="shrink-0" /> <span className="hidden sm:inline truncate">Export KML</span>
        </button>

        {!showPlanEditor && (
          <button onClick={() => { setShowPlanEditor(true); setInputMode('plan'); }} className="bg-blue-600 text-white p-2 sm:px-3 sm:py-2 sm:w-[130px] rounded-xl shadow-md text-[10px] sm:text-[11px] font-bold flex items-center justify-center sm:justify-start gap-2 border border-blue-500 hover:bg-blue-700 transition-all">
            <Ruler size={16} className="shrink-0" /> <span className="hidden sm:inline truncate">Editor Rute</span>
          </button>
        )}
      </div>

      {showPlanEditor && (
        <div className="absolute top-32 md:top-28 right-4 bottom-4 z-30 w-[300px] md:w-[360px] bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl flex flex-col pointer-events-auto">
          <button onClick={() => { setShowPlanEditor(false); setInputMode('view'); }} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 rounded-full transition-colors z-40 shadow-sm" title="Tutup Editor">
            <X size={16} />
          </button>
          <div className="p-4 md:p-5 border-b border-slate-100 shrink-0 relative">
            <h4 className="text-sm font-black text-slate-800 mb-3 md:mb-4 pr-8">Input Koordinat</h4>
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border text-center">
              <button onClick={() => setInputMode('plan')} className={`flex-1 py-2.5 rounded-lg text-[10px] font-black transition-all ${inputMode === 'plan' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500'}`}>Garis</button>
              <button onClick={() => setInputMode('plan_polygon')} className={`flex-1 py-2.5 rounded-lg text-[10px] font-black transition-all ${inputMode === 'plan_polygon' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500'}`}>Poligon</button>
              <button onClick={() => setInputMode('actual')} className={`flex-1 py-2.5 rounded-lg text-[10px] font-black transition-all ${inputMode === 'actual' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-500'}`}>Realisasi</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 text-left custom-scrollbar">
            {inputMode === 'plan' || inputMode === 'plan_polygon' ? (
              <div className="animate-in fade-in slide-in-from-left-2">
                <p className={`text-[11px] mb-3 p-3 rounded-xl border ${inputMode === 'plan_polygon' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-amber-700 bg-amber-50 border-amber-100'}`}>Klik di peta untuk menambah titik {inputMode === 'plan_polygon' ? 'poligon' : 'garis'}.</p>
                <div className="flex justify-end gap-3 mb-2 flex-wrap">
                  <button onClick={() => setShowSketchPoints(!showSketchPoints)} className="text-[9px] font-bold text-emerald-500 hover:text-emerald-700">{showSketchPoints ? 'Sembunyikan Titik' : 'Tampilkan Titik'}</button>
                  <button onClick={() => setShowSketchLabels(!showSketchLabels)} className="text-[9px] font-bold text-amber-500 hover:text-amber-700">{showSketchLabels ? 'Sembunyikan Label' : 'Tampilkan Label'}</button>
                  <button onClick={() => setShowDistances(!showDistances)} className="text-[9px] font-bold text-blue-500 hover:text-blue-700">{showDistances ? 'Sembunyikan Jarak' : 'Tampilkan Jarak'}</button>
                  <button onClick={() => setShowPhotos(!showPhotos)} className="text-[9px] font-bold text-rose-500 hover:text-rose-700">{showPhotos ? 'Sembunyikan Foto' : 'Tampilkan Foto'}</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto bg-slate-50 p-2 rounded-xl text-[10px] font-mono border border-slate-200 mb-3 custom-scrollbar">
                  {!plannedPath || plannedPath.length === 0 ? <div className="p-2 text-slate-500 text-center">Belum ada titik rencana...</div> : plannedPath.map((pathObj) => (
                    <div key={pathObj.id} className="mb-3 bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm relative group">
                      <div className="flex justify-between items-center mb-2">
                        <input 
                          type="text" 
                          value={pathObj.name} 
                          onChange={(e) => handleUpdatePath(pathObj.id, 'name', e.target.value)}
                          className="font-bold text-slate-800 text-xs outline-none bg-transparent w-[120px] focus:border-b border-blue-400"
                          placeholder="Nama Sketsa"
                        />
                        <button onClick={() => handleDeletePath(pathObj.id)} className="text-rose-500 bg-rose-50 p-1 rounded hover:bg-rose-100"><Trash size={12} /></button>
                      </div>
                      <div className="flex items-center gap-2 mb-2 bg-slate-50 p-1.5 rounded-md">
                         <input 
                            type="color" 
                            value={pathObj.color || (pathObj.type === 'polygon' ? '#10b981' : '#f59e0b')} 
                            onChange={(e) => handleUpdatePath(pathObj.id, 'color', e.target.value)}
                            className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0"
                            title="Warna"
                         />
                         <select 
                            value={pathObj.type || 'line'}
                            onChange={(e) => handleUpdatePath(pathObj.id, 'type', e.target.value)}
                            className="text-[9px] font-bold outline-none bg-transparent text-slate-700 w-full"
                         >
                            <option value="line">Garis</option>
                            <option value="polygon">Poligon</option>
                         </select>
                         <select 
                            value={pathObj.isDashed ? 'dashed' : 'solid'}
                            onChange={(e) => handleUpdatePath(pathObj.id, 'isDashed', e.target.value === 'dashed')}
                            className="text-[9px] font-bold outline-none bg-transparent text-slate-700 w-full"
                         >
                            <option value="dashed">Putus-putus</option>
                            <option value="solid">Lurus</option>
                         </select>
                      </div>
                      <div className="pl-1">
                        {(!pathObj.points || pathObj.points.length === 0) ? <div className="text-[9px] text-slate-400 italic">Klik peta untuk menambah titik...</div> : pathObj.points.map((p, i) => (
                          <div key={i} className="flex justify-between items-center mb-1 pl-2 border-l-2 text-slate-600 group/pt hover:bg-slate-50 rounded" style={{ borderColor: pathObj.color || (pathObj.type === 'polygon' ? '#10b981' : '#f59e0b') }}>
                             <div className="flex items-center gap-1 w-full mr-2">
                                <span className="text-[9px] font-bold w-6">{p.sta}</span>
                                <input type="number" step="any" value={p.lat} onChange={e => {
                                   setPlannedPath(prev => prev.map(path => {
                                      if (path.id === pathObj.id) {
                                         const nPts = [...path.points]; nPts[i].lat = e.target.value; return { ...path, points: nPts };
                                      }
                                      return path;
                                   }));
                                }} className="w-full p-1 text-[10px] border border-slate-200 rounded outline-none focus:border-blue-400 bg-white font-mono" placeholder="Lat" />
                                <input type="number" step="any" value={p.lng} onChange={e => {
                                   setPlannedPath(prev => prev.map(path => {
                                      if (path.id === pathObj.id) {
                                         const nPts = [...path.points]; nPts[i].lng = e.target.value; return { ...path, points: nPts };
                                      }
                                      return path;
                                   }));
                                }} className="w-full p-1 text-[10px] border border-slate-200 rounded outline-none focus:border-blue-400 bg-white font-mono" placeholder="Lng" />
                             </div>
                             <button onClick={() => handleDeletePoint(pathObj.id, i)} className="text-rose-400 opacity-0 group-hover/pt:opacity-100 p-1 shrink-0"><X size={10} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mb-3">
                  <button onClick={() => setPlannedPath(prev => [...(prev || []), { id: `path-${Date.now()}`, name: `Jalur ${(prev||[]).length + 1}`, type: 'line', color: '#3b82f6', isDashed: true, points: [] }])} className="flex-1 text-blue-600 bg-blue-50 py-2 text-[10px] font-bold rounded-xl border border-blue-100">+ Garis Baru</button>
                  <button onClick={() => setPlannedPath(prev => [...(prev || []), { id: `poly-${Date.now()}`, name: `Poligon ${(prev||[]).length + 1}`, type: 'polygon', color: '#10b981', isDashed: false, points: [] }])} className="flex-1 text-emerald-600 bg-emerald-50 py-2 text-[10px] font-bold rounded-xl border border-emerald-100">+ Poligon</button>
                </div>
                <button onClick={() => setPlannedPath([])} className="w-full text-rose-500 bg-rose-50 py-2 text-[10px] font-bold rounded-xl border border-rose-100">Reset Semua Sketsa</button>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-2 space-y-4">
                <div className="flex justify-between items-center"><p className="text-[11px] text-cyan-700 bg-cyan-50 p-3 rounded-xl border border-cyan-100 w-full">Klik di peta untuk menambah titik rute realisasi (Garis Biru).</p></div>
                <div className="flex justify-end gap-3 mb-2 flex-wrap">
                  <button onClick={() => setShowSketchPoints(!showSketchPoints)} className="text-[9px] font-bold text-emerald-500 hover:text-emerald-700">{showSketchPoints ? 'Sembunyikan Titik' : 'Tampilkan Titik'}</button>
                  <button onClick={() => setShowSketchLabels(!showSketchLabels)} className="text-[9px] font-bold text-amber-500 hover:text-amber-700">{showSketchLabels ? 'Sembunyikan Label' : 'Tampilkan Label'}</button>
                  <button onClick={() => setShowDistances(!showDistances)} className="text-[9px] font-bold text-blue-500 hover:text-blue-700">{showDistances ? 'Sembunyikan Jarak' : 'Tampilkan Jarak'}</button>
                  <button onClick={() => setShowPhotos(!showPhotos)} className="text-[9px] font-bold text-rose-500 hover:text-rose-700">{showPhotos ? 'Sembunyikan Foto' : 'Tampilkan Foto'}</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto bg-slate-50 p-2 rounded-xl text-[10px] font-mono border border-slate-200 mb-3 custom-scrollbar">
                  {!actualSegments || actualSegments.length === 0 ? <div className="p-2 text-slate-500 text-center">Belum ada rute realisasi...</div> : actualSegments.map((seg) => (
                    <div key={seg.id} className="mb-3 bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm relative group">
                       <div className="flex justify-between items-center mb-2">
                         <input
                           type="text"
                           value={seg.name}
                           onChange={(e) => handleUpdateSeg(seg.id, 'name', e.target.value)}
                           className="font-bold text-slate-800 text-xs outline-none bg-transparent w-[120px] focus:border-b border-blue-400"
                           placeholder="Nama Segmen"
                         />
                         <button onClick={() => setActualSegments(p => (p || []).filter(s => s.id !== seg.id))} className="text-rose-500 bg-rose-50 p-1 rounded hover:bg-rose-100"><Trash size={12} /></button>
                       </div>
                       <div className="pl-1">
                         {(!seg.points || seg.points.length === 0) ? <div className="text-[9px] text-slate-400 italic">Klik peta untuk menambah titik...</div> : seg.points.map((p, i) => (
                           <div key={i} className="flex justify-between items-center mb-1 pl-2 border-l-2 text-slate-600 group/pt hover:bg-slate-50 rounded border-blue-500">
                              <div className="flex items-center gap-1 w-full mr-2">
                                 <span className="text-[9px] font-bold w-6">T-{i+1}</span>
                                 <input type="number" step="any" value={p.lat} onChange={e => {
                                    setActualSegments(prev => prev.map(s => {
                                       if (s.id === seg.id) {
                                          const nPts = [...s.points]; nPts[i].lat = e.target.value; return { ...s, points: nPts };
                                       }
                                       return s;
                                    }));
                                 }} className="w-full p-1 text-[10px] border border-slate-200 rounded outline-none focus:border-blue-400 bg-white font-mono" placeholder="Lat" />
                                 <input type="number" step="any" value={p.lng} onChange={e => {
                                    setActualSegments(prev => prev.map(s => {
                                       if (s.id === seg.id) {
                                          const nPts = [...s.points]; nPts[i].lng = e.target.value; return { ...s, points: nPts };
                                       }
                                       return s;
                                    }));
                                 }} className="w-full p-1 text-[10px] border border-slate-200 rounded outline-none focus:border-blue-400 bg-white font-mono" placeholder="Lng" />
                              </div>
                              <button onClick={() => {
                                 setActualSegments(prev => prev.map(s => {
                                    if (s.id === seg.id) {
                                       const nPts = [...s.points]; nPts.splice(i, 1); return { ...s, points: nPts };
                                    }
                                    return s;
                                 }));
                              }} className="text-rose-400 opacity-0 group-hover/pt:opacity-100 p-1 shrink-0"><X size={10} /></button>
                           </div>
                         ))}
                       </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActualSegments(p => [...(p || []), { id: Date.now(), name: `Segmen ${(p || []).length + 1}`, points: [] }])} className="w-full text-blue-600 bg-blue-50 py-2 text-[10px] font-bold flex justify-center gap-1 rounded-xl border border-blue-100"><Plus size={14} /> Tambah Segmen Baru</button>
              </div>
            )}
          </div>
          <div className="p-4 md:p-5 border-t border-slate-100">
             <button onClick={() => onUpdateRoutes(plannedPath, actualSegments)} disabled={isUpdating} className="w-full bg-blue-600 text-white py-3.5 rounded-xl text-xs font-black uppercase shadow-md hover:bg-blue-700 transition-colors">
                {isUpdating ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Simpan Koordinat'}
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ContractTable = ({ title, icon, dataArray, colorClass, bgClass }) => {
  if (!dataArray || dataArray.length === 0) return null;
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4 px-1"><div className={`w-8 h-8 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center shrink-0`}>{icon}</div><h3 className="text-sm font-black text-slate-800 uppercase">{title}</h3></div>
      <div className="bg-white rounded-2xl border border-slate-300 overflow-hidden shadow-sm">
        <div className="hidden sm:flex bg-slate-200 border-b border-slate-300 py-3.5 px-6"><div className="w-1/3 text-[10px] font-black uppercase tracking-[0.15em] text-slate-800">Informasi / Entitas</div><div className="w-2/3 text-[10px] font-black uppercase text-slate-800 pl-4 border-l border-slate-300">Detail Kontrak & Keterangan</div></div>
        <div className="flex flex-col">
          {dataArray.map((item, idx) => (
            <div key={idx} className={`flex flex-col sm:flex-row py-4 px-6 border-b border-slate-200 last:border-0 ${idx % 2 !== 0 ? 'bg-slate-50/50' : 'bg-white'}`}>
              <div className="w-full sm:w-1/3 mb-1 sm:mb-0 pr-4"><span className="text-[11px] font-bold text-slate-500 uppercase">{safeRender(item.label)}</span></div>
              <div className="w-full sm:w-2/3 flex flex-col sm:pl-4 sm:border-l sm:border-slate-300">
                <span className="text-sm font-bold text-slate-800 break-words">{safeRender(item.value)}</span>
                {item.sub && <span className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">{safeRender(item.sub, '')}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- VIEW BARU: HALAMAN LOGIN ---
const LoginView = ({ onLogin, error, isProcessing }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State baru untuk toggle password

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div 
      className="flex h-screen w-full items-center justify-center font-sans relative overflow-hidden bg-white"
    >
      {/* Background Ornaments (Sedikit disesuaikan agar cocok dengan bg putih) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-blue-100 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] bg-emerald-100 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[32px] shadow-2xl relative z-10 flex flex-col items-center border border-slate-100">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl mb-6 shadow-blue-600/30">
          <Activity size={40} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Dashboard</h1>
        <p className="text-xs font-normal text-slate-500 uppercase tracking-widest mb-8 text-center">Command Center Management</p>

        {error && (
          <div className="w-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold p-4 rounded-xl mb-6 flex items-center gap-3">
             <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><User size={18} /></div>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Terdaftar" className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-normal outline-none focus:border-blue-500 focus:bg-white transition-all" required />
             </div>
          </div>
          <div>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Lock size={18} /></div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Password" 
                  className="w-full pl-11 pr-12 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-normal outline-none focus:border-blue-500 focus:bg-white transition-all" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                  title={showPassword ? "Sembunyikan Password" : "Lihat Password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
             </div>
          </div>
          <button type="submit" disabled={isProcessing} className="w-full bg-blue-600 text-white py-4 rounded-2xl text-sm font-normal uppercase tracking-widest shadow-lg hover:bg-blue-500 transition-colors mt-4 flex items-center justify-center gap-2">
            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- VIEW BARU: GERBANG PEMILIHAN MODE ---
const ModeSelectionView = ({ projects, onSelectMaster, onSelectProject, onAddProject, onLogout, onViewAbsensi, onViewRekap }) => {
  // State untuk menyimpan ID proyek yang dipilih pada dropdown
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isUIHidden, setIsUIHidden] = useState(true);

  return (
    <div className="flex flex-col h-screen w-full bg-[#151515] font-sans relative overflow-hidden">
      
      {/* ORNAMEN BACKGROUND UNTUK MEMPERKUAT EFEK GLASS (BIAS CAHAYA) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
         <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] bg-slate-400/10 rounded-full blur-[120px]"></div>
      </div>

      {/* LOGO & MENU TOGGLE (MENGAMBANG DI KIRI ATAS) */}
      <div 
        onClick={() => setIsUIHidden(!isUIHidden)}
        className="absolute top-6 left-6 md:top-10 md:left-10 z-[99999] flex items-center gap-4 group cursor-pointer pointer-events-auto"
        title={isUIHidden ? "Tampilkan Menu Akses" : "Sembunyikan Menu Akses"}
      >
        <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-600/90 backdrop-blur-md rounded-2xl md:rounded-3xl flex items-center justify-center text-white shadow-[0_8px_30px_rgba(37,99,235,0.4)] group-hover:scale-105 group-hover:bg-blue-500 transition-all border border-blue-400/50 relative overflow-hidden">
           <Menu size={24} className={`absolute transition-all duration-500 ${!isUIHidden ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
           <Activity size={24} className={`absolute transition-all duration-500 ${isUIHidden ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
        </div>
        <div className="flex flex-col opacity-90 group-hover:opacity-100 transition-opacity">
          <h1 className="text-xl md:text-2xl font-normal tracking-tight text-white leading-none drop-shadow-md">Dashboard</h1>
          <p className="text-[10px] md:text-xs font-bold text-slate-400 group-hover:text-blue-300 uppercase tracking-widest mt-1 drop-shadow-md transition-colors">
            Gerbang Utama
          </p>
        </div>
      </div>

      {/* HEADER AKSI KANAN (MUNCUL SAAT DIKLIK) */}
      <div className={`absolute top-6 right-6 md:top-10 md:right-10 flex flex-wrap justify-end items-center gap-2 md:gap-3 z-[90000] transition-all duration-500 ease-out origin-right ${isUIHidden ? 'opacity-0 scale-95 pointer-events-none translate-x-12' : 'opacity-100 scale-100 translate-x-0'}`}>
        <button onClick={onViewRekap} className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl hover:bg-amber-500/30 hover:text-amber-300 transition-all hover:scale-105 flex items-center justify-center shadow-lg backdrop-blur-md border border-amber-500/30" title="Rekap Semua Proyek">
           <FileSpreadsheet size={20} />
        </button>
        <button onClick={onSelectMaster} className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl hover:bg-blue-500/30 hover:text-blue-300 transition-all hover:scale-105 flex items-center justify-center shadow-lg backdrop-blur-md border border-blue-500/30" title="Buka Peta Induk">
           <Globe2 size={20} />
        </button>
        <button onClick={onViewAbsensi} className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl hover:bg-emerald-500/30 hover:text-emerald-300 transition-all hover:scale-105 flex items-center justify-center shadow-lg backdrop-blur-md border border-emerald-500/30" title="Data Absensi">
           <Fingerprint size={20} />
        </button>
        <button onClick={onLogout} className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl hover:bg-rose-500/30 hover:text-rose-300 transition-all hover:scale-105 flex items-center justify-center shadow-lg backdrop-blur-md border border-rose-500/30" title="Keluar dari Sistem">
           <LogOut size={20} />
        </button>
      </div>

      {/* Konten Utama */}
      <div className={`flex-1 flex flex-col items-center justify-center p-6 md:p-10 relative z-10 transition-all duration-700 ease-in-out ${isUIHidden ? 'scale-105 opacity-100 pt-6' : 'scale-100 opacity-90 pt-32'}`}>
        <div className="text-center mb-8 max-w-lg">
           <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">Pilih Akses</h2>
        </div>

        <div className="w-full max-w-md">
           {/* Opsi 2: Daftar Per Kamar (NATIVE DROPDOWN) KINI MENJADI FOKUS UTAMA */}
           <div className="bg-slate-800/95 backdrop-blur-xl rounded-[32px] p-8 border border-slate-700/50 shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-2xl hover:border-white/30 hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] -ml-10 -mt-10 transition-all group-hover:bg-white/10"></div>
              <div className="w-24 h-24 bg-slate-700/60 text-white/70 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 group-hover:text-white transition-all shadow-sm relative z-10 border border-slate-600/50">
                 <Grid size={40} />
              </div>
              <p className="text-base text-slate-200 font-medium leading-relaxed mb-8 relative z-10">Pilih Untuk Melihat Secara Detail</p>
              
              <div className="mt-auto w-full flex flex-col gap-3 relative z-10">
                 <div className="relative">
                    <select 
                       className="w-full appearance-none bg-slate-900/50 border border-slate-600 text-slate-200 py-4 pl-5 pr-10 rounded-2xl text-xs md:text-sm font-bold outline-none cursor-pointer hover:bg-slate-700/50 transition-colors focus:border-white/50 shadow-inner"
                       value={selectedProjectId}
                       onChange={(e) => setSelectedProjectId(e.target.value)}
                    >
                       <option value="" disabled className="bg-slate-800">-- Pilih Judul Pekerjaan --</option>
                       {projects && projects.map(p => (
                          <option key={p.id} value={p.id} className="bg-slate-800 text-slate-200">{p.pekerjaan}</option>
                       ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                       <ChevronDown size={18} />
                    </div>
                 </div>
                 
                 {/* Tombol masuk hanya muncul jika proyek sudah dipilih */}
                 {selectedProjectId && (
                    <button 
                       onClick={() => {
                          const p = projects.find(proj => proj.id === selectedProjectId);
                          if(p) onSelectProject(p);
                       }} 
                       className="w-full py-4 bg-white text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors shadow-md animate-in fade-in slide-in-from-bottom-2 flex items-center justify-center gap-2"
                    >
                       Buka Proyek <ChevronRight size={16} />
                    </button>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- VIEW BARU: DAFTAR PILIH KAMAR PROYEK ---
const ProjectSelectionListView = ({ projects, onSelectProject, onBack, onAddProject, onDeleteProject, onViewRekap }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua'); // State baru untuk filter tab

  // UPDATE: Filter berdasarkan pencarian nama & filter tombol status
  const filteredProjects = projects.filter(p => {
    const query = searchQuery.toLowerCase();
    const matchTitle = String(p.pekerjaan || '').toLowerCase().includes(query);
    
    const actualProg = parseFloat(p.actual_progress || 0);
    const isRunning = p.status === 'Running' || actualProg > 0;
    
    // Logika untuk pencarian teks
    const matchSearch = matchTitle;

    // Logika untuk tab filter
    let matchFilter = true;
    if (statusFilter === 'Pelaksanaan') matchFilter = isRunning;
    if (statusFilter === 'Persiapan') matchFilter = !isRunning;

    return matchSearch && matchFilter;
  });

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 md:px-10 py-6 bg-white shrink-0 z-20 shadow-sm border-b border-slate-200 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={onBack} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors shrink-0" title="Kembali ke Menu Utama">
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 leading-none">Pilih Kamar Proyek</h1>
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total {projects.length} Proyek Tersedia</p>
          </div>
        </div>
        <div className="flex w-full md:w-auto gap-2 md:gap-3 flex-wrap md:flex-nowrap">
           <div className="flex-1 md:w-64 flex items-center bg-slate-100 border border-slate-200 rounded-xl px-3 shadow-inner">
             <Search size={16} className="text-slate-400 shrink-0" />
           <input type="text" placeholder="Cari nama proyek..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full py-3 px-2 outline-none text-xs font-bold bg-transparent text-slate-700" />
         </div>
         
         {/* TOMBOL REKAP TOTAL */}
         <button onClick={onViewRekap} className="bg-amber-50 text-amber-600 border border-amber-200 px-4 py-3 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-sm hover:bg-amber-100 transition-all shrink-0">
            <FileSpreadsheet size={16} /> <span className="hidden sm:inline">Rekap Data</span>
         </button>

         <button onClick={onAddProject} className="bg-emerald-600 text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-md hover:bg-emerald-700 transition-all shrink-0">
              <Plus size={16} /> <span className="hidden sm:inline">Baru</span>
           </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
        
        {/* TAB FILTER STATUS PROYEK */}
        <div className="max-w-7xl mx-auto mb-6 flex flex-wrap gap-2 md:gap-3">
           <button onClick={() => setStatusFilter('Semua')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${statusFilter === 'Semua' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}>Semua Kamar</button>
           <button onClick={() => setStatusFilter('Pelaksanaan')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 ${statusFilter === 'Pelaksanaan' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-100'}`}><div className={`w-2 h-2 rounded-full ${statusFilter === 'Pelaksanaan' ? 'bg-blue-300' : 'bg-blue-500'}`}></div> Pelaksanaan</button>
           <button onClick={() => setStatusFilter('Persiapan')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 ${statusFilter === 'Persiapan' ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-rose-500 hover:bg-rose-50 border border-rose-100'}`}><div className={`w-2 h-2 rounded-full ${statusFilter === 'Persiapan' ? 'bg-rose-200' : 'bg-rose-500'}`}></div> Persiapan</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
           {filteredProjects.length > 0 ? (
             filteredProjects.map((p) => {
               const actualProg = parseFloat(p.actual_progress || 0);
               const isRunning = p.status === 'Running' || actualProg > 0;
               return (
                 <div key={p.id} onClick={() => onSelectProject(p)} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all group relative overflow-hidden flex flex-col cursor-pointer min-h-[220px]">
                    <div className={`absolute top-0 left-0 w-full h-1.5 transition-colors ${isRunning ? 'bg-blue-500' : 'bg-rose-500'}`}></div>
                    
                    <div className="flex justify-between items-start mb-4 mt-2">
                       <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm border ${isRunning ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                         {isRunning ? 'Pelaksanaan' : 'Persiapan'}
                       </span>
                       <button onClick={(e) => { e.stopPropagation(); onDeleteProject(p); }} className="p-2 text-slate-300 hover:text-rose-500 bg-white rounded-xl hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 border border-slate-100 hover:border-rose-200 shadow-sm" title="Hapus Kamar Proyek">
                         <Trash size={16} />
                       </button>
                    </div>

                    <h3 className="font-black text-slate-800 text-lg mb-4 line-clamp-3 leading-snug group-hover:text-blue-600 transition-colors">
                      {p.pekerjaan}
                    </h3>

                    <div className="mt-auto pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress Fisik</span>
                            <span className="text-xl font-black text-slate-800">{Number(actualProg).toFixed(0)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div className={`h-full rounded-full transition-all duration-1000 ${isRunning ? 'bg-blue-500' : 'bg-slate-300'}`} style={{ width: `${actualProg}%` }}></div>
                        </div>
                    </div>
                 </div>
               )
             })
           ) : (
             <div className="col-span-full text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-300">
                <Building2 size={64} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-black text-slate-700 mb-2">Tidak Ada Proyek</h3>
                <p className="text-sm font-medium text-slate-500">Belum ada kamar proyek atau tidak ditemukan pencarian.</p>
             </div>
           )}
        </div>
      </div>

    </div>
  );
};

// --- KOMPONEN APLIKASI UTAMA ---
export default function App() {
  // STATE BARU UNTUK LOGIKA LOGIN & PEMILIHAN
  const [appMode, setAppMode] = useState('login'); // 'login', 'selection', 'project_list', 'master', 'project', 'absensi'
  const [previousAppMode, setPreviousAppMode] = useState('selection'); // Menyimpan asal halaman sebelum masuk proyek
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState('');

  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [masterProjects, setMasterProjects] = useState([]);
  const [projectData, setProjectData] = useState(null);

  const [feeds, setFeeds] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [docCategories, setDocCategories] = useState(['Administrasi', 'Kontrak', 'Gambar', 'Laporan', 'Survei']);
  const [sCurveData, setSCurveData] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [supabaseClient, setSupabaseClient] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState(null);

  // --- Modal States ---
  const [showGlobalRekap, setShowGlobalRekap] = useState(false);
  const [globalDocuments, setGlobalDocuments] = useState([]); // STATE BARU: Menyimpan semua dokumen untuk kebutuhan rekap audit
  // STATE BARU: Pilihan Opsi Kolom Tambahan untuk Rekap
  const [rekapOptions, setRekapOptions] = useState({
    status: false,     // Status Pekerjaan
    progress: false,   // Progress Fisik
    termin: false,     // Posisi Termin
    dimensi: false,    // Panjang, Lebar, Saluran
    ppk: false,        // Nama PPK
    kontraktor: false, // Personil Kontraktor
    konsultan: false,  // Personil Konsultan
    dokumen: false     // Cek File Dokumen Tertentu
  });
  
  const [rekapDocKeyword, setRekapDocKeyword] = useState('Kontrak'); // Keyword pencarian dokumen bawaan

  // STATE BARU: Pilihan Spesifik Proyek yang akan direkap
  const [selectedRekapProjects, setSelectedRekapProjects] = useState(new Set());

  // Efek untuk menandai semua proyek saat modal rekap dibuka pertama kali & Mengambil data dokumen
  useEffect(() => {
    if (showGlobalRekap) {
      if (masterProjects) setSelectedRekapProjects(new Set(masterProjects.map(p => p.id)));
      if (supabaseClient) {
        supabaseClient.from('documents').select('project_id, name, file_url').then(({data}) => {
          if (data) setGlobalDocuments(data);
        });
      }
    }
  }, [showGlobalRekap, supabaseClient]);
  
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSCurveModal, setShowSCurveModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showAppendRouteModal, setShowAppendRouteModal] = useState(false); // STATE BARU: Modal Tambah Titik Rute

  // --- Form States ---
  const [reportTab, setReportTab] = useState('harian'); // State baru untuk Tab Modal Laporan
  const [quickReportNote, setQuickReportNote] = useState(''); // State Catatan Lapor Lapangan
  const [quickRepFiles, setQuickRepFiles] = useState([]); // State File Lapor Lapangan
  
  const [newProjectForm, setNewProjectForm] = useState({ pekerjaan: '', status: 'Preparation' });
  const [editProjectForm, setEditProjectForm] = useState({ status: 'Running', pekerjaan: '', termin_ke: '1', termin_persen: '0', panjang_rencana: '', lebar_rencana: '', jenis_model: '', item_utama_data: [], waktu_pelaksanaan: '' });
  const [sCurveForm, setSCurveForm] = useState({ plan: '', actual: '' });
  const [dailyReportForm, setDailyReportForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    lokasi: '',
    shifts: [{
      id: Date.now(),
      tanggalMulai: new Date().toISOString().split('T')[0],
      jamMulai: '08:00',
      tanggalSelesai: new Date().toISOString().split('T')[0],
      jamSelesai: '17:00'
    }],
    cuaca: { '08.00 - 09.00': 'Cerah', '09.00 - 10.00': 'Cerah', '10.00 - 11.00': 'Cerah', '11.00 - 12.00': 'Cerah', '12.00 - 13.00': 'Cerah', '13.00 - 14.00': 'Cerah', '14.00 - 15.00': 'Cerah', '15.00 - 16.00': 'Cerah', '16.00 - 17.00': 'Cerah' },
    aktivitas: JSON.parse(JSON.stringify(INITIAL_AKTIVITAS)),
    tenagaKerja: JSON.parse(JSON.stringify(INITIAL_TENAGA_KERJA)),
    catatan: ''
  });
  const [uForm, setUForm] = useState({ tanggal: new Date().toISOString().split('T')[0], namaSegmen: '', points: [{lat: '', lng: ''}, {lat: '', lng: ''}], panjang: '', lebar: '', jenis_model_awal: '', noteDesc: '' });
  const [masterForm, setMasterForm] = useState({ dinas: JSON.parse(JSON.stringify(INITIAL_DINAS_DATA)), kontraktor: { fields: initialKontraktorFields, personil: [] }, konsultan: { fields: initialKonsultanFields, personil: [] } });
  const [employeeForm, setEmployeeForm] = useState({ id: null, employee_id: '', name: '', role: 'Pelaksana', pin: '' });
  const [appendRouteForm, setAppendRouteForm] = useState({ targetType: 'actual', segmentName: 'Segmen 1', lat: '', lng: '', note: '' }); // DITAMBAHKAN targetType
  const [appendRouteFiles, setAppendRouteFiles] = useState([]); // STATE BARU: Foto Rute Realisasi
  const [renameRouteConfig, setRenameRouteConfig] = useState({ isEditing: false, newName: '' });
  const [deleteRouteConfirm, setDeleteRouteConfirm] = useState(false);

  // --- File & Upload States ---
  const [repFiles, setRepFiles] = useState([]);
  const [docFile, setDocFile] = useState(null);
  const [docUploadCategory, setDocUploadCategory] = useState('Administrasi');
  const [uMedia, setUMedia] = useState([]);
  const [uDataUkur, setUDataUkur] = useState(null);

  // --- UI/Interaction States ---
  const [selectedLog, setSelectedLog] = useState(null);
  const [activeSurveyLogId, setActiveSurveyLogId] = useState('');
  const [isDraggingDoc, setIsDraggingDoc] = useState(false);
  const [isDraggingReport, setIsDraggingReport] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState(null);
  const [moveDocConfig, setMoveDocConfig] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [docFilterCategory, setDocFilterCategory] = useState('Semua');
  const [newCatName, setNewCatName] = useState('');
  const [isEditingContract, setIsEditingContract] = useState(false);

  const latestFeedIdRef = useRef(null); // Menambahkan pelacak ID laporan/aktivitas terakhir
  const [readFeeds, setReadFeeds] = useState(new Set()); // STATE BARU: Melacak ID Log yang sudah dibaca

  // --- STATE BARU: SIDEBAR HIDE/SHOW ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- MENGUBAH JUDUL TAB BROWSER ---
  useEffect(() => {
    document.title = "SynxBuild - Command Center";
  }, []);

  // --- KUNCI KE FONT WINDOWS (SEGOE UI / ARIAL) ---
  useEffect(() => {
    let fontEl = document.getElementById('windows-font-style');
    if (!fontEl) {
      fontEl = document.createElement('style');
      fontEl.id = 'windows-font-style';
      fontEl.innerHTML = `
        html, body, .font-sans, h1, h2, h3, h4, h5, p, span, div, button, input, select, textarea, td, th {
           font-family: "Segoe UI", Arial, Tahoma, sans-serif !important;
        }
        .font-mono {
           font-family: Consolas, "Courier New", monospace !important;
        }
      `;
      document.head.appendChild(fontEl);
    }
    return () => { if (fontEl) fontEl.remove(); };
  }, []);

  // --- LOGIKA LOGIN SUPABASE AUTH (AMAN) ---
  const handleLogin = async (email, password) => {
     setIsProcessing(true);
     setAuthError('');
     try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (error) throw error;
        // Jika sukses, onAuthStateChange akan menangani perubahan state
     } catch (err) {
        setAuthError(err.message === 'Invalid login credentials' ? 'Email atau Password salah!' : err.message);
     } finally {
        setIsProcessing(false);
     }
  };

  const handleLogout = async () => {
     await supabaseClient.auth.signOut();
     // State direset oleh onAuthStateChange
  };

  // Efek untuk memantau status login dari Supabase
  useEffect(() => {
    if (!supabaseClient) return;

    // Cek sesi saat pertama kali dimuat
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        if (appMode === 'login') setAppMode('selection');
      }
    });

    // Dengarkan perubahan login/logout
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
         if (appMode === 'login') setAppMode('selection');
      } else {
         setAppMode('login');
         setProjectData(null);
         setReadFeeds(new Set());
      }
    });

    return () => subscription.unsubscribe();
  }, [supabaseClient, appMode]);

  const docInputRef = useRef(null);
  const reportFileInputRef = useRef(null);

  // --- EFFECT: LOGIKA PINTAR GENERATE JAM CUACA OTOMATIS (MULTI-SHIFT PER 30 MENIT) ---
  const shiftsJson = JSON.stringify(dailyReportForm.shifts);
  useEffect(() => {
    if (!showReportModal || !dailyReportForm.shifts) return;

    const newCuaca = {};
    const maxSlots = 96; // Limit total max slot aman (48 jam)
    let slotsCount = 0;
    const timeSlots = [];

    // Kumpulkan semua slot waktu dari semua shift
    dailyReportForm.shifts.forEach(shift => {
      const tglMulai = shift.tanggalMulai;
      const jmMulai = shift.jamMulai;
      const tglSelesai = shift.tanggalSelesai || tglMulai;
      const jmSelesai = shift.jamSelesai;

      if (!tglMulai || !jmMulai || !tglSelesai || !jmSelesai) return;

      const start = new Date(`${tglMulai}T${jmMulai}`);
      const end = new Date(`${tglSelesai}T${jmSelesai}`);

      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) return;

      let current = new Date(start);
      while (current < end && slotsCount < maxSlots) {
        let next = new Date(current);
        // UBAH KE 30 MENIT
        next.setMinutes(current.getMinutes() + 30);
        if (next > end) next = new Date(end); // Clamp ke jam selesai terakhir

        timeSlots.push({ start: new Date(current), end: new Date(next) });
        current = next;
        slotsCount++;
      }
    });

    // Urutkan waktu secara kronologis agar tabel rapi
    timeSlots.sort((a, b) => a.start.getTime() - b.start.getTime());

    // Generate keys unik untuk menghindari duplikasi jam yang tumpang tindih
    const uniqueKeys = new Set();
    timeSlots.forEach(slot => {
      const formatTime = (d) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');

      // Sesuai permintaan: Hanya menampilkan Jam saja, tanpa Tanggal meskipun lintas hari
      const key = `${formatTime(slot.start)} - ${formatTime(slot.end)}`;

      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        newCuaca[key] = dailyReportForm.cuaca[key] || 'Cerah';
      }
    });

    const oldKeys = Object.keys(dailyReportForm.cuaca).join(',');
    const newKeys = Object.keys(newCuaca).join(',');

    if (oldKeys !== newKeys && Object.keys(newCuaca).length > 0) {
      setDailyReportForm(p => ({ ...p, cuaca: newCuaca }));
    }
  }, [shiftsJson, dailyReportForm.tanggal, showReportModal]);

  // --- FUNGSI AUTO-TANGGAL LINTAS HARI PADA SHIFT ---
  const handleShiftChange = (idx, field, value) => {
    setDailyReportForm(prev => {
      const newShifts = [...prev.shifts];
      newShifts[idx] = { ...newShifts[idx], [field]: value };

      // Logika: Jika waktu selesai lebih kecil dari waktu mulai (misal 23:00 s/d 05:00), otomatis +1 hari
      if (['tanggalMulai', 'jamMulai', 'jamSelesai'].includes(field)) {
        const shift = newShifts[idx];
        if (shift.tanggalMulai && shift.jamMulai && shift.jamSelesai) {
          const startM = parseInt(shift.jamMulai.substring(0, 2)) * 60 + parseInt(shift.jamMulai.substring(3, 5));
          const endM = parseInt(shift.jamSelesai.substring(0, 2)) * 60 + parseInt(shift.jamSelesai.substring(3, 5));

          const d = new Date(shift.tanggalMulai);
          if (endM < startM) {
            d.setDate(d.getDate() + 1); // Tambah 1 hari ke depan
          }
          
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          newShifts[idx].tanggalSelesai = `${y}-${m}-${day}`;
        }
      }
      return { ...prev, shifts: newShifts };
    });
  };

  // --- EFFECTS ---
  useEffect(() => {
    const loadScript = (id, src) => {
      if (!document.getElementById(id)) {
        const script = document.createElement('script');
        script.id = id; script.src = src; script.async = false;
        document.head.appendChild(script);
      }
    };

    loadScript('supabase-js', 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
    loadScript('html2canvas-js', 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    loadScript('jspdf-js', 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    loadScript('pdfjs-lib', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js');

    const cssLink = document.createElement('link'); cssLink.rel = 'stylesheet'; cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(cssLink);
    loadScript('leaflet-js', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');

    const checkSupabase = setInterval(() => {
      if (window.supabase) {
        // Initialize Supabase Client with explicitly disabled realtime in constrained environments if needed, but we keep default config
        setSupabaseClient(window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY));
        clearInterval(checkSupabase);
      }
    }, 200);

    const checkPdfJs = setInterval(() => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        clearInterval(checkPdfJs);
      }
    }, 200);

    return () => {
       clearInterval(checkSupabase);
       clearInterval(checkPdfJs);
    };
  }, []);

  // Fetch data hanya jika sudah login atau minimal supabase siap
  useEffect(() => { 
     if (supabaseClient && isLoggedIn) {
        fetchAllProjects(); 
        fetchAttendances();
        fetchEmployees();
     }
  }, [supabaseClient, isLoggedIn]);

  // EFEK BARU: Set Nama Segmen Default untuk Modal Append Rute
  useEffect(() => {
    if (showAppendRouteModal && projectData) {
       const segs = projectData.actual_segments_data || [];
       setAppendRouteForm(p => ({ 
          ...p, 
          targetType: 'actual',
          segmentName: segs.length > 0 ? (segs[segs.length - 1].name || 'Segmen 1') : 'Segmen 1' 
       }));
    }
  }, [showAppendRouteModal, projectData]);

  // --- MENGAKTIFKAN FITUR POLLING (PENGGANTI REAL-TIME) ---
  useEffect(() => {
    if (!supabaseClient || !isLoggedIn) return;
    const pollData = async () => {
      // Refresh daftar proyek di gerbang pemilihan secara berkala
      if (appMode === 'selection' || appMode === 'project_list' || appMode === 'master') {
          fetchAllProjects();
      }

      // Refresh data absensi secara berkala jika berada di tampilan absensi
      if (appMode === 'absensi') {
          fetchAttendances();
          fetchEmployees();
      }

      // Cek otomatis laporan/aktivitas baru setiap 5 detik
      if (projectData?.id) {
        try {
          const { data: newFeeds } = await supabaseClient
            .from('field_reports')
            .select('id, title')
            .eq('project_id', projectData.id)
            .order('created_at', { ascending: false })
            .limit(1); // Cukup ambil 1 teratas untuk mengecek ID terbaru

          if (newFeeds && newFeeds.length > 0) {
            const currentLatestId = newFeeds[0].id;
            
            // Jika ada ID baru yang tidak sama dengan data terakhir yang kita lihat
            if (latestFeedIdRef.current && latestFeedIdRef.current !== currentLatestId) {
              
              // Cek apakah item ini sebenarnya sudah ada di daftar feeds lokal kita 
              // (Mencegah notifikasi palsu jika item teratas baru saja kita hapus)
              const isAlreadyExist = feeds.some(f => f.id === currentLatestId);
              
              if (!isAlreadyExist) {
                showMsg(`🔔 Notifikasi: ${newFeeds[0].title} baru saja masuk!`, "success");
                
                // Perbarui daftar aktivitas secara diam-diam
                const { data: allReports } = await supabaseClient
                  .from('field_reports')
                  .select('*')
                  .eq('project_id', projectData.id)
                  .order('created_at', { ascending: false });
                setFeeds(allReports || []);
              }
              
              latestFeedIdRef.current = currentLatestId;
            }
          }
        } catch (e) {
          // Abaikan error polling (hening di latar belakang)
        }
      }
    };

    const pollInterval = setInterval(pollData, 5000); // Polling setiap 5 detik
    return () => clearInterval(pollInterval);
  }, [supabaseClient, isLoggedIn, appMode, projectData?.id, feeds]);
  // ---------------------------------------------

  const fetchAllProjects = async () => {
    try {
      // Tambahkan instruksi .order('created_at', { ascending: false }) agar yang terbaru selalu di atas
      const { data: projs, error } = await supabaseClient
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) { showMsg("Gagal memuat daftar proyek: " + error.message, "error"); return; }
      setMasterProjects(projs || []);
    } catch (e) { showMsg("Gagal memuat daftar proyek.", "error"); }
  };

  const fetchAttendances = async () => {
     try {
        const { data: attData, error } = await supabaseClient
           .from('attendances')
           .select('*')
           .order('check_in_time', { ascending: false });
           
        if (!error && attData) {
           setAttendances(attData);
        }
     } catch (e) {
        console.error("Error fetching attendances:", e);
     }
  };

  const fetchEmployees = async () => {
     try {
        const { data, error } = await supabaseClient.from('karyawan').select('*').order('created_at', { ascending: false });
        if (!error && data) setEmployees(data);
     } catch (e) { console.error("Error fetching employees:", e); }
  };

  const handleDeleteAttendance = async (id) => {
    setIsProcessing(true);
    try {
      const { error } = await supabaseClient.from('attendances').delete().eq('id', id);
      if (error) throw error;
      showMsg("Data absensi berhasil dihapus!", "success");
      fetchAttendances(); // Refresh data otomatis setelah dihapus
    } catch (err) {
      showMsg("Gagal menghapus absensi: " + err.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchProjectDetails = async (projectId) => {
    try {
      const { data: proj } = await supabaseClient.from('projects').select('*').eq('id', projectId).single();
      if (proj) {
        setProjectData(proj);
        let tKe = '1', tPct = '0';
        if ((proj.termin_ke || '').toString().includes(',')) { [tKe, tPct] = proj.termin_ke.split(','); } else { tKe = proj.termin_ke || '1'; }

        setEditProjectForm({
          status: proj.status || 'Running', pekerjaan: proj.pekerjaan || '',
          termin_ke: tKe, termin_persen: tPct, panjang_rencana: proj.panjang_rencana || '', lebar_rencana: proj.lebar_rencana || '', jenis_model: proj.jenis_model || '',
          item_utama_data: proj.item_utama_data || [], waktu_pelaksanaan: proj.waktu_pelaksanaan || ''
        });

        let mergedDinas = Array.isArray(proj.dinas_data) ? proj.dinas_data : [];
        if (mergedDinas.length === 0) mergedDinas = JSON.parse(JSON.stringify(INITIAL_DINAS_DATA));

        setMasterForm({
          dinas: mergedDinas,
          kontraktor: { fields: buildDynamicFields(proj.kontraktor_data, initialKontraktorFields), personil: Array.isArray(proj.kontraktor_data?.personil) ? proj.kontraktor_data.personil : [] },
          konsultan: { fields: buildDynamicFields(proj.konsultan_data, initialKonsultanFields), personil: Array.isArray(proj.konsultan_data?.personil) ? proj.konsultan_data.personil : [] }
        });

        if (Array.isArray(proj.s_curve_data)) {
          setSCurveData(proj.s_curve_data);
          // Menyiapkan data Kurva S untuk form edit tergabung
          setSCurveForm({
            plan: proj.s_curve_data.map(d => d.r != null ? String(d.r).replace('.', ',') : '0').join(' - '),
            actual: proj.s_curve_data.map(d => d.a != null ? String(d.a).replace('.', ',') : '').filter(Boolean).join(' - ')
          });
        } else {
          setSCurveData([]);
          setSCurveForm({ plan: '', actual: '' });
        }

        if (proj.doc_categories && Array.isArray(proj.doc_categories) && proj.doc_categories.length > 0) setDocCategories(proj.doc_categories);
      else setDocCategories(['Administrasi', 'Kontrak', 'Gambar', 'Laporan', 'Survei']);
    }

    const { data: reports } = await supabaseClient.from('field_reports').select('*').eq('project_id', projectId).order('created_at', { ascending: false });
    
    // Simpan ID teratas saat pertama kali dimuat agar tidak dianggap sebagai laporan "baru masuk"
    if (reports && reports.length > 0) {
      latestFeedIdRef.current = reports[0].id;
    }
    setFeeds(reports || []);

    // Set semua log yang dimuat pertama kali sebagai "sudah dibaca" agar tidak ada badge baru di awal load
    setReadFeeds(prev => {
        if (prev.size === 0 && reports) return new Set(reports.map(r => r.id));
        return prev;
    });

    const { data: docs } = await supabaseClient.from('documents').select('*').eq('project_id', projectId).order('created_at', { ascending: false });
    setDocuments(docs || []);
    } catch (e) { showMsg("Gagal memuat detail proyek.", "error"); }
  };

  const showMsg = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 6000);
  };

  const handleSelectProject = async (selectedProj) => {
    setPreviousAppMode(appMode); // Simpan asal halaman kita
    setAppMode('project');
    setActiveMenu('dashboard');
    setProjectData(selectedProj);
    setReadFeeds(new Set()); // Reset notifikasi saat ganti proyek
    fetchProjectDetails(selectedProj.id);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const { error } = await supabaseClient.from('projects').insert([{ 
         name: newProjectForm.pekerjaan,
         pekerjaan: newProjectForm.pekerjaan, 
         status: newProjectForm.status,
         actual_progress: 0,
         target_progress: 0 
      }]);
      if (error) throw error;
      showMsg("Kamar Proyek Berhasil Dibuat!", "success");
      setShowNewProjectModal(false);
      setNewProjectForm({ pekerjaan: '', status: 'Preparation' });
      fetchAllProjects();
    } catch (err) {
      showMsg("Gagal membuat proyek: " + err.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Navigasi Kembali ke Gerbang Pemilihan dari Peta Induk
  const handleBackToSelection = () => {
    setAppMode('selection');
    setProjectData(null);
  };

  // Navigasi Dinamis Keluar dari Kamar Proyek
  const handleBackFromProject = () => {
    setAppMode(previousAppMode || 'selection');
    setProjectData(null);
    if (previousAppMode === 'master') fetchAllProjects();
  };

  // Fungsi Baru: Menandai Log sudah dibaca saat diklik
  const handleViewLog = (item) => {
    setSelectedLog(item);
    setReadFeeds(prev => {
        const newSet = new Set(prev);
        newSet.add(item.id);
        return newSet;
    });
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault(); setIsProcessing(true);
    try {
      // 1. Memproses Data Kurva S yang digabung
      const cleanPlan = String(sCurveForm.plan || '').replace(/\s+/g, '').replace(/,/g, '.').split('-').filter(Boolean);
      const cleanActual = String(sCurveForm.actual || '').replace(/\s+/g, '').replace(/,/g, '.').split('-').filter(Boolean);
      const parsedData = []; let lastValidA = 0;
      for (let i = 0; i < Math.max(cleanPlan.length, cleanActual.length); i++) {
        let point = { n: 'M' + (i + 1), r: isNaN(parseFloat(cleanPlan[i])) ? 0 : parseFloat(cleanPlan[i]) };
        if (i < cleanActual.length) {
          const aVal = parseFloat(cleanActual[i]);
          point.a = (aVal === 0 && lastValidA > 0) ? null : (isNaN(aVal) ? null : aVal);
        } else point.a = null;
        if (point.a !== null) lastValidA = point.a;
        parsedData.push(point);
      }
      setSCurveData(parsedData);

      // 2. Kalkulasi Progress Fisik Otomatis & Auto Status (Dari Realisasi Kurva S)
      let calculatedProgress = lastValidA || 0;
      const autoStatus = (editProjectForm.status === 'Running' || calculatedProgress > 0) ? 'Running' : editProjectForm.status;

      // 3. Menyimpan Semuanya Sekaligus
      const { error } = await supabaseClient.from('projects').update({
        name: editProjectForm.pekerjaan,
        pekerjaan: editProjectForm.pekerjaan, termin_ke: `${editProjectForm.termin_ke},${editProjectForm.termin_persen}`, 
        status: autoStatus,
        actual_progress: parseFloat(calculatedProgress.toFixed(2)),
        panjang_rencana: editProjectForm.panjang_rencana, lebar_rencana: editProjectForm.lebar_rencana, jenis_model: editProjectForm.jenis_model,
        item_utama_data: editProjectForm.item_utama_data, waktu_pelaksanaan: editProjectForm.waktu_pelaksanaan,
        s_curve_data: parsedData,
        updated_at: new Date().toISOString()
      }).eq('id', projectData.id);
      
      if (error) throw error;
      showMsg("Data Proyek Diperbarui!", "success"); setShowEditProjectModal(false); fetchProjectDetails(projectData.id);
    } catch (e) { showMsg("Gagal menyimpan: " + e.message, "error"); } finally { setIsProcessing(false); }
  };

  const handleSaveRAB = async (rabItems) => {
    if (!projectData) return; setIsProcessing(true);
    try {
      const cleanedItems = (rabItems || []).filter(item => String(item.uraian || '').trim() !== '' || item.volume || item.harga_satuan);
      const { error } = await supabaseClient.from('projects').update({ rab_data: cleanedItems, updated_at: new Date().toISOString() }).eq('id', projectData.id);
      if (error) throw error;
      setProjectData(prev => ({ ...prev, rab_data: cleanedItems })); showMsg("Data RAB Berhasil Disimpan!", "success");
    } catch (err) { showMsg("Gagal update DB RAB: " + err.message, "error"); } finally { setIsProcessing(false); }
  };

  const handleSaveSchedule = async (scheduleItems) => {
    if (!projectData) return; setIsProcessing(true);
    try {
      const { error } = await supabaseClient.from('projects').update({ schedule_data: scheduleItems, updated_at: new Date().toISOString() }).eq('id', projectData.id);
      if (error) throw error;
      setProjectData(prev => ({ ...prev, schedule_data: scheduleItems })); showMsg("Jadwal Berhasil Disimpan!", "success");
    } catch (err) { showMsg("Gagal update jadwal: " + err.message, "error"); } finally { setIsProcessing(false); }
  };

  const handleUpdateStakeholder = async (e) => {
    e.preventDefault(); setIsProcessing(true);
    try {
      const { error } = await supabaseClient.from('projects').update({ dinas_data: masterForm.dinas, kontraktor_data: masterForm.kontraktor, konsultan_data: masterForm.konsultan, updated_at: new Date().toISOString() }).eq('id', projectData.id);
      if (error) throw error;
      showMsg("Data Kontrak Disimpan!", "success"); setIsEditingContract(false); fetchProjectDetails(projectData.id);
    } catch (e) { showMsg("Gagal menyimpan kontrak: " + e.message, "error"); } finally { setIsProcessing(false); }
  };

  // --- FUNGSI BUKA MODAL LAPORAN (TEMPLATE FULL A-D) ---
  const handleOpenReportModal = () => {
    // Reset state tab dan form cepat saat dibuka
    setReportTab('harian');
    setQuickReportNote('');
    setQuickRepFiles([]);
    setRepFiles([]); // Memastikan lampiran foto Laporan Harian dikosongkan saat dibuka

    // INIT SURVEI DATA (Jika user membuka tab survei)
    let initialPoints = [{ lat: '', lng: '' }, { lat: '', lng: '' }];
    if (projectData && projectData.actual_segments_data && projectData.actual_segments_data.length > 0) {
      const segments = projectData.actual_segments_data;
      let lastValidPoint = null;
      for (let i = segments.length - 1; i >= 0; i--) {
        if (segments[i].boundary_end && segments[i].boundary_end.lat) {
           lastValidPoint = segments[i].boundary_end;
           break;
        }
        const pts = segments[i].points;
        if (pts && pts.length > 0) {
          lastValidPoint = pts[pts.length - 1];
          break;
        }
      }
      if (lastValidPoint) {
        initialPoints[0] = { lat: lastValidPoint.lat, lng: lastValidPoint.lng };
      }
    }
    setUForm({
      tanggal: new Date().toISOString().split('T')[0],
      namaSegmen: '',
      points: initialPoints,
      panjang: '',
      lebar: '',
      jenis_model_awal: '',
      noteDesc: ''
    });
    setUMedia([]);
    setUDataUkur(null);

    let baseAktivitas = JSON.parse(JSON.stringify(INITIAL_AKTIVITAS));
    let baseTenagaKerja = JSON.parse(JSON.stringify(INITIAL_TENAGA_KERJA));
    let baseLokasi = '';
    const baseDate = new Date().toISOString().split('T')[0];
    let baseShifts = [{ id: Date.now(), tanggalMulai: baseDate, jamMulai: '08:00', tanggalSelesai: baseDate, jamSelesai: '17:00' }];

    if (projectData?.report_template_data) {
      const tpl = projectData.report_template_data;
      if (Array.isArray(tpl)) {
        // Fallback untuk template lama (hanya array aktivitas)
        if (tpl.length > 0) baseAktivitas = tpl.map(item => ({ nama: item.nama || '', kemarin: '', hariIni: '', satuan: item.satuan || '' }));
      } else if (typeof tpl === 'object') {
        // Format Template Baru (A sampai D)
        if (tpl.lokasi) baseLokasi = tpl.lokasi;
        if (tpl.tenagaKerja) {
           let savedTk = [];
           if (Array.isArray(tpl.tenagaKerja)) {
              savedTk = tpl.tenagaKerja;
           } else if (typeof tpl.tenagaKerja === 'object') {
              // Konversi jika template menggunakan format objek lama
              savedTk = Object.keys(tpl.tenagaKerja).map(k => ({ posisi: k, jumlah: tpl.tenagaKerja[k] }));
           }
           
           // MEMAKSA URUTAN SESUAI DEFAULT (INITIAL_TENAGA_KERJA)
           const enforcedOrderTk = JSON.parse(JSON.stringify(INITIAL_TENAGA_KERJA)).map(defaultItem => {
               const found = savedTk.find(item => String(item.posisi).toLowerCase() === String(defaultItem.posisi).toLowerCase());
               return found ? { ...defaultItem, jumlah: found.jumlah } : defaultItem;
           });

           // Tambahkan posisi kustom yang mungkin ditambahkan manual oleh user (diletakkan paling bawah)
           savedTk.forEach(savedItem => {
               if (savedItem.posisi && savedItem.posisi.trim() !== '') {
                   const exists = enforcedOrderTk.find(item => String(item.posisi).toLowerCase() === String(savedItem.posisi).toLowerCase());
                   if (!exists) {
                       enforcedOrderTk.push(savedItem);
                   }
               }
           });

           baseTenagaKerja = enforcedOrderTk;
        }
        if (tpl.aktivitas && Array.isArray(tpl.aktivitas) && tpl.aktivitas.length > 0) {
          baseAktivitas = tpl.aktivitas.map(item => ({ nama: item.nama || '', kemarin: '', hariIni: '', satuan: item.satuan || '' }));
        }
        if (tpl.shifts && Array.isArray(tpl.shifts) && tpl.shifts.length > 0) {
          baseShifts = tpl.shifts.map((s, idx) => {
            const startM = parseInt(s.jamMulai?.substring(0, 2) || '08') * 60 + parseInt(s.jamMulai?.substring(3, 5) || '00');
            const endM = parseInt(s.jamSelesai?.substring(0, 2) || '17') * 60 + parseInt(s.jamSelesai?.substring(3, 5) || '00');
            const tglSelesaiObj = new Date(baseDate);
            if (endM < startM) tglSelesaiObj.setDate(tglSelesaiObj.getDate() + 1);
            return { id: Date.now() + idx, tanggalMulai: baseDate, jamMulai: s.jamMulai || '08:00', tanggalSelesai: tglSelesaiObj.toISOString().split('T')[0], jamSelesai: s.jamSelesai || '17:00' };
          });
        }
      }
    }
    
    setDailyReportForm(prev => ({
      ...prev,
      tanggal: baseDate,
      lokasi: baseLokasi,
      shifts: baseShifts,
      aktivitas: baseAktivitas,
      tenagaKerja: baseTenagaKerja,
      catatan: '' // Selalu kosongkan catatan untuk laporan baru
    }));
    setShowReportModal(true);
  };
  // ------------------------------------------------------------------

  // --- FUNGSI SUBMIT LAPOR LAPANGAN CEPAT ---
  const handleQuickReportSubmit = async (e) => {
    e.preventDefault();
    if (!projectData) return;
    setIsProcessing(true);

    try {
      let publicUrl = null;
      if (quickRepFiles && quickRepFiles.length > 0) {
        showMsg(`Memproses ${quickRepFiles.length} File...`, "info");
        const uploadedUrls = [];
        for (let i = 0; i < quickRepFiles.length; i++) {
          let fileToUpload = quickRepFiles[i];
          if (fileToUpload.type.startsWith('image/')) { fileToUpload = await compressImage(fileToUpload); }
          const fileName = `${Date.now()}_quick_${i}.${fileToUpload.name.split('.').pop()}`;
          await supabaseClient.storage.from('project-media').upload(`reports/${fileName}`, fileToUpload);
          const { data: urlData } = supabaseClient.storage.from('project-media').getPublicUrl(`reports/${fileName}`);
          uploadedUrls.push(urlData.publicUrl);
        }
        publicUrl = uploadedUrls.join(',');
      }

      const { error } = await supabaseClient.from('field_reports').insert([{ 
        project_id: projectData?.id, 
        title: 'Lapor Lapangan', 
        description: quickReportNote || 'Dokumentasi Lapangan', 
        media_url: publicUrl, 
        is_problem: !!quickReportNote && quickReportNote.toLowerCase().includes('kendala') 
      }]);
      
      if (error) throw error;

      showMsg("Laporan Lapangan Terkirim!", "success");
      setShowReportModal(false);
      setQuickRepFiles([]);
      setQuickReportNote('');
      fetchProjectDetails(projectData.id);
    } catch (e) { 
      showMsg("Gagal mengirim laporan: " + e.message, "error"); 
    } finally { 
      setIsProcessing(false); 
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi ketat (wajib isi aktivitas/catatan) telah dihapus sesuai permintaan
    
    setIsProcessing(true);
    try {
      let publicUrl = null;
      if (repFiles && repFiles.length > 0) {
        showMsg(`Memproses ${repFiles.length} Foto...`, "info");
        const uploadedUrls = [];
        for (let i = 0; i < repFiles.length; i++) {
          let fileToUpload = repFiles[i];
          if (fileToUpload.type.startsWith('image/')) { fileToUpload = await compressImage(fileToUpload); }
          const fileName = `${Date.now()}_report_${i}.${fileToUpload.name.split('.').pop()}`;
          await supabaseClient.storage.from('project-media').upload(`reports/${fileName}`, fileToUpload);
          const { data: urlData } = supabaseClient.storage.from('project-media').getPublicUrl(`reports/${fileName}`);
          uploadedUrls.push(urlData.publicUrl);
        }
        publicUrl = uploadedUrls.join(',');
      }

      const cuacaStr = Object.entries(dailyReportForm.cuaca).map(([jam, kondisi]) => `${jam} : ${kondisi}`).join('\n');
      
      // Filter aktivitas yang kosong dan sinkronkan string
      const aktivStr = dailyReportForm.aktivitas.filter(a => a.nama && (a.kemarin !== '' || a.hariIni !== '')).map((a, i) => {
        const tot = (parseFloat(a.kemarin) || 0) + (parseFloat(a.hariIni) || 0);
        return `- ${a.nama} : Kemarin=${a.kemarin || 0}, Hari Ini=${a.hariIni || 0}, Total=${tot} ${a.satuan}`;
      }).join('\n');

      // Tampilkan SEMUA tenaga kerja di deskripsi log, meskipun 0
      const tkStr = (Array.isArray(dailyReportForm.tenagaKerja) ? dailyReportForm.tenagaKerja : [])
        .filter(tk => tk.posisi && tk.posisi.trim() !== '')
        .map(tk => `- ${tk.posisi}: ${tk.jumlah || 0} org`)
        .join('\n');

      let waktuStr = '';
      if (dailyReportForm.shifts && dailyReportForm.shifts.length > 0) {
          waktuStr = dailyReportForm.shifts.map((s, i) => {
              const shiftTitle = dailyReportForm.shifts.length > 1 ? `Shift ${i+1}: ` : '';
              if (s.tanggalMulai === s.tanggalSelesai) {
                  return `${shiftTitle}${s.jamMulai} - ${s.jamSelesai}`;
              } else {
                  return `${shiftTitle}${s.tanggalMulai} (${s.jamMulai}) - ${s.tanggalSelesai} (${s.jamSelesai})`;
              }
          }).join('\n');
      }

      const reportContent = `📋 LAPORAN HARIAN\nTanggal: ${dailyReportForm.tanggal}\nLokasi: ${dailyReportForm.lokasi || '-'}\nWaktu:\n${waktuStr}\n\n🌤️ KONDISI CUACA:\n${cuacaStr}\n\n👷 TENAGA KERJA:\n${tkStr || '-'}\n\n🚧 AKTIVITAS PEKERJAAN:\n${aktivStr || '-'}\n\n📝 CATATAN / KENDALA / SARAN:\n${dailyReportForm.catatan || '-'}`;
      const isProblem = !!dailyReportForm.catatan && dailyReportForm.catatan.toLowerCase().includes('kendala');

      const { error } = await supabaseClient.from('field_reports').insert([{ project_id: projectData?.id, title: 'Laporan Harian', description: reportContent, media_url: publicUrl, is_problem: isProblem }]);
      if (error) throw error;

      // --- LOGIKA BARU: SINKRONISASI OTOMATIS KE ITEM UTAMA PROYEK ---
      let updatedItemUtama = [...(projectData?.item_utama_data || [])];
      let isItemUtamaChanged = false;

      dailyReportForm.aktivitas.forEach(lapAct => {
        if (!lapAct.nama) return;
        
        // Cari pencocokan nama item (case-insensitive & abaikan spasi berlebih awal/akhir)
        const targetName = String(lapAct.nama).trim().toLowerCase();
        const itemIdx = updatedItemUtama.findIndex(u => String(u.nama).trim().toLowerCase() === targetName);

        if (itemIdx !== -1) {
          const valHariIni = parseFloat(lapAct.hariIni) || 0;
          const valKemarin = parseFloat(lapAct.kemarin) || 0;
          const valTotal = valKemarin + valHariIni;

          // Update nilai (Hanya jika ada inputan angka di laporan)
          if (lapAct.hariIni !== '' || lapAct.kemarin !== '') {
            updatedItemUtama[itemIdx].bobot = valHariIni.toString(); // Update kolom Renc. Hari Ini
            updatedItemUtama[itemIdx].nilai = valTotal.toString();   // Update kolom Total
            
            // --- RUMUS OTOMATIS PROGRESS ---
            // Sesuai Instruksi: Total dikali Hari ini dibagi 100
            const progressVal = (valTotal * valHariIni) / 100;
            updatedItemUtama[itemIdx].persen = parseFloat(progressVal.toFixed(2));
            
            isItemUtamaChanged = true;
          }
        }
      });

      if (isItemUtamaChanged) {
        // Simpan pembaruan angka ke database proyek
        await supabaseClient.from('projects').update({ item_utama_data: updatedItemUtama }).eq('id', projectData.id);
      }
      // ---------------------------------------------------------------

      // --- SIMPAN TEMPLATE RUTINITAS KE DATABASE (FULL FORM A-D) ---
      const newTemplate = {
        lokasi: dailyReportForm.lokasi,
        shifts: dailyReportForm.shifts.map(s => ({ jamMulai: s.jamMulai, jamSelesai: s.jamSelesai })),
        aktivitas: dailyReportForm.aktivitas.filter(a => String(a.nama || '').trim() !== '').map(a => ({ nama: a.nama, satuan: a.satuan })),
        tenagaKerja: dailyReportForm.tenagaKerja.filter(tk => tk.posisi && tk.posisi.trim() !== '')
      };
      
      await supabaseClient.from('projects').update({ report_template_data: newTemplate }).eq('id', projectData.id);
      setProjectData(prev => ({ ...prev, report_template_data: newTemplate })); // Update local state
      // ---------------------------------------------

      showMsg("Laporan Harian Terkirim! Mengunduh bukti PDF...", "success");
      if (window.html2canvas) { await generateDailyReportReceipt(dailyReportForm, projectData); }

      setShowReportModal(false);
      setRepFiles([]);
      
      // Reset akan mengandalkan handleOpenReportModal saat dibuka lagi
      const resetDate = new Date().toISOString().split('T')[0];
      setDailyReportForm({
        tanggal: resetDate,
        lokasi: '',
        shifts: [{ id: Date.now(), tanggalMulai: resetDate, jamMulai: '08:00', tanggalSelesai: resetDate, jamSelesai: '17:00' }],
        cuaca: { '08.00 - 09.00': 'Cerah', '09.00 - 10.00': 'Cerah', '10.00 - 11.00': 'Cerah', '11.00 - 12.00': 'Cerah', '12.00 - 13.00': 'Cerah', '13.00 - 14.00': 'Cerah', '14.00 - 15.00': 'Cerah', '15.00 - 16.00': 'Cerah', '16.00 - 17.00': 'Cerah' },
        aktivitas: JSON.parse(JSON.stringify(INITIAL_AKTIVITAS)),
        tenagaKerja: JSON.parse(JSON.stringify(INITIAL_TENAGA_KERJA)),
        catatan: ''
      });
      fetchProjectDetails(projectData.id);
    } catch (e) { showMsg(e.message, "error"); } finally { setIsProcessing(false); }
  };

  // --- FUNGSI SIMPAN TEMPLATE RUTINITAS MANUAL FULL ---
  const handleSaveTemplate = async () => {
    if (!projectData) return;
    setIsProcessing(true);
    try {
      const newTemplate = {
        lokasi: dailyReportForm.lokasi,
        shifts: dailyReportForm.shifts.map(s => ({ jamMulai: s.jamMulai, jamSelesai: s.jamSelesai })),
        aktivitas: dailyReportForm.aktivitas.filter(a => String(a.nama || '').trim() !== '').map(a => ({ nama: a.nama, satuan: a.satuan })),
        tenagaKerja: dailyReportForm.tenagaKerja.filter(tk => tk.posisi && tk.posisi.trim() !== '')
      };
      
      const { error } = await supabaseClient.from('projects').update({ report_template_data: newTemplate }).eq('id', projectData.id);
      if (error) throw error;
      
      setProjectData(prev => ({ ...prev, report_template_data: newTemplate }));
      showMsg("Template Form Laporan (Lokasi, Shift, Aktivitas & Naker) Berhasil Disimpan!", "success");
    } catch (e) {
      showMsg("Gagal menyimpan template: " + e.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- FUNGSI UPDATE RUTE REALISASI (GROWING PATH) ---
  const handleAppendRouteSubmit = async (e) => {
    e.preventDefault(); if (!projectData) return; setIsProcessing(true);
    try {
       const parseCoord = (val) => {
          if (!val) return null; let str = String(val).replace(/\s+/g, '');
          if (str.includes(',') && str.split(',').length === 2) { const parts = str.split(','); const lat = parseFloat(parts[0]); if (!isNaN(lat)) return lat; }
          const num = parseFloat(str.replace(',', '.')); return isNaN(num) ? null : num;
       };

       const lat = parseCoord(appendRouteForm.lat);
       const lng = parseCoord(appendRouteForm.lng);
       if (lat === null || lng === null) throw new Error("Format kordinat tidak valid");

       const isActual = appendRouteForm.targetType === 'actual';
       let dbUpdatePayload = {};
       const segName = appendRouteForm.segmentName || (isActual ? 'Segmen 1' : 'Jalur 1');

       // UPDATE REALISASI (AKTUAL) ATAU SKETSA (RENCANA)
       if (isActual) {
           let newSegments = Array.isArray(projectData.actual_segments_data) ? [...projectData.actual_segments_data] : [];
           let existingSegIdx = newSegments.findIndex(s => String(s.name).toLowerCase() === segName.toLowerCase());

           if (existingSegIdx >= 0) {
              const existingPoints = newSegments[existingSegIdx].points || [];
              newSegments[existingSegIdx] = { ...newSegments[existingSegIdx], points: [...existingPoints, { lat, lng }] };
           } else {
              newSegments.push({ id: Date.now(), name: segName, points: [{ lat, lng }] });
           }
           dbUpdatePayload.actual_segments_data = newSegments;
       } else {
           let newPlans = Array.isArray(projectData.planned_path) ? [...projectData.planned_path] : [];
           let existingIdx = newPlans.findIndex(s => String(s.name).toLowerCase() === segName.toLowerCase());

           if (existingIdx >= 0) {
              const extPts = newPlans[existingIdx].points || [];
              newPlans[existingIdx] = { ...newPlans[existingIdx], points: [...extPts, { lat, lng, sta: `T-${extPts.length + 1}` }] };
           } else {
              newPlans.push({ id: `path-${Date.now()}`, name: segName, type: 'line', color: '#f59e0b', isDashed: true, points: [{ lat, lng, sta: 'T-1' }] });
           }
           dbUpdatePayload.planned_path = newPlans;
       }
       
       dbUpdatePayload.updated_at = new Date().toISOString();

       const { error } = await supabaseClient.from('projects').update(dbUpdatePayload).eq('id', projectData.id);
       if (error) throw error;

       // UPLOAD MEDIA JIKA ADA
       let publicUrl = null;
       if (appendRouteFiles && appendRouteFiles.length > 0) {
          showMsg(`Mengompresi & mengunggah ${appendRouteFiles.length} foto...`, "info");
          const uploadedUrls = [];
          for (let i = 0; i < appendRouteFiles.length; i++) {
             let fileToUpload = appendRouteFiles[i];
             if (fileToUpload.type.startsWith('image/')) { fileToUpload = await compressImage(fileToUpload); }
             const fileName = `${Date.now()}_route_${i}.${fileToUpload.name.split('.').pop()}`;
             await supabaseClient.storage.from('project-media').upload(`reports/${fileName}`, fileToUpload);
             const { data: urlData } = supabaseClient.storage.from('project-media').getPublicUrl(`reports/${fileName}`);
             uploadedUrls.push(urlData.publicUrl);
          }
          publicUrl = uploadedUrls.join(',');
       }

       const reportTypeStr = isActual ? 'Rute Realisasi' : 'Sketsa Rencana';

       await supabaseClient.from('field_reports').insert([{
          project_id: projectData.id,
          title: `Update Progress ${reportTypeStr}`,
          description: `Penambahan titik ${reportTypeStr.toLowerCase()} baru pada ${segName}.\nKordinat Baru: Lat ${lat}, Lng ${lng}\nCatatan: ${appendRouteForm.note || '-'}`,
          media_url: publicUrl,
          is_problem: false
       }]);

       // UPDATE STATE LOKAL
       setProjectData(prev => ({ ...prev, ...dbUpdatePayload }));
       showMsg(`Titik ${reportTypeStr.toLowerCase()} berhasil ditambahkan!`, "success");
       setShowAppendRouteModal(false);
       setAppendRouteForm(p => ({ ...p, segmentName: segName, lat: '', lng: '', note: '' }));
       setAppendRouteFiles([]);
       fetchProjectDetails(projectData.id);

    } catch (err) { showMsg("Error: " + err.message, "error"); } finally { setIsProcessing(false); }
  };

  const handleRenameRouteTarget = async () => {
       if (!renameRouteConfig.newName || !projectData) return;
       setIsProcessing(true);
       try {
           const isActual = appendRouteForm.targetType === 'actual';
           const oldName = appendRouteForm.segmentName;
           let dbUpdatePayload = {};

           if (isActual) {
               let newSegments = [...(projectData.actual_segments_data || [])];
               let idx = newSegments.findIndex(s => s.name === oldName);
               if (idx >= 0) newSegments[idx].name = renameRouteConfig.newName;
               dbUpdatePayload.actual_segments_data = newSegments;
           } else {
               let newPlans = [...(projectData.planned_path || [])];
               let idx = newPlans.findIndex(s => s.name === oldName);
               if (idx >= 0) newPlans[idx].name = renameRouteConfig.newName;
               dbUpdatePayload.planned_path = newPlans;
           }

           dbUpdatePayload.updated_at = new Date().toISOString();
           const { error } = await supabaseClient.from('projects').update(dbUpdatePayload).eq('id', projectData.id);
           if (error) throw error;

           setProjectData(prev => ({ ...prev, ...dbUpdatePayload }));
           setAppendRouteForm(p => ({ ...p, segmentName: renameRouteConfig.newName }));
           setRenameRouteConfig({ isEditing: false, newName: '' });
           showMsg("Nama berhasil diubah", "success");
       } catch(e) {
           showMsg("Gagal mengubah nama: " + e.message, "error");
       } finally {
           setIsProcessing(false);
       }
  };

  const handleDeleteRouteTarget = async () => {
       if (!projectData) return;
       setIsProcessing(true);
       try {
           const isActual = appendRouteForm.targetType === 'actual';
           const oldName = appendRouteForm.segmentName;
           let dbUpdatePayload = {};
           let nextName = '';

           if (isActual) {
               let newSegments = (projectData.actual_segments_data || []).filter(s => s.name !== oldName);
               dbUpdatePayload.actual_segments_data = newSegments;
               if(newSegments.length > 0) nextName = newSegments[0].name;
           } else {
               let newPlans = (projectData.planned_path || []).filter(s => s.name !== oldName);
               dbUpdatePayload.planned_path = newPlans;
               if(newPlans.length > 0) nextName = newPlans[0].name;
           }

           dbUpdatePayload.updated_at = new Date().toISOString();
           const { error } = await supabaseClient.from('projects').update(dbUpdatePayload).eq('id', projectData.id);
           if (error) throw error;

           setProjectData(prev => ({ ...prev, ...dbUpdatePayload }));
           setAppendRouteForm(p => ({ ...p, segmentName: nextName || (isActual ? 'Segmen 1' : 'Jalur 1') }));
           setDeleteRouteConfirm(false);
           showMsg("Jalur/Segmen berhasil dihapus", "success");
       } catch(e) {
           showMsg("Gagal menghapus: " + e.message, "error");
       } finally {
           setIsProcessing(false);
       }
  };

  const getAppendGPS = () => {
    if (!navigator.geolocation) { showMsg("GPS tidak didukung oleh perangkat", "error"); return; }
    showMsg("Mencari sinyal GPS...", "info");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAppendRouteForm(p => ({ ...p, lat: pos.coords.latitude, lng: pos.coords.longitude }));
        showMsg("Sinyal GPS Terkunci!", "success");
      },
      (err) => { showMsg("Gagal ambil GPS: " + err.message, "error"); },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleUnifiedSubmit = async (e) => {
    e.preventDefault(); if (!projectData) return; setIsProcessing(true);

    try {
      const parseCoord = (val) => {
        if (!val) return null; let str = String(val).replace(/\s+/g, '');
        if (str.includes(',') && str.split(',').length === 2) { const parts = str.split(','); const lat = parseFloat(parts[0]); if (!isNaN(lat)) return lat; }
        const num = parseFloat(str.replace(',', '.')); return isNaN(num) ? null : num;
      };

      const validPoints = (uForm.points || []).map(p => {
          const lat = parseCoord(p.lat);
          const lng = parseCoord(p.lng);
          if (lat !== null && lng !== null) return { lat, lng };
          return null;
      }).filter(Boolean);

      const startPt = validPoints.length > 0 ? validPoints[0] : null;
      const endPt = validPoints.length > 1 ? validPoints[1] : null;

      const updatePayload = { panjang_rencana: uForm.panjang, lebar_rencana: uForm.lebar, jenis_model: uForm.jenis_model_awal, updated_at: new Date().toISOString() };

      let newSegments = Array.isArray(projectData.actual_segments_data) ? [...projectData.actual_segments_data] : [];
      let inputSegName = String(uForm.namaSegmen || '').trim();
      let segName = inputSegName;
      let existingSegIdx = -1;

      if (segName) { existingSegIdx = newSegments.findIndex(s => String(s.name).toLowerCase() === segName.toLowerCase()); }
      else { let count = 1; while (newSegments.find(s => String(s.name).toLowerCase() === `segmen ${count}`)) { count++; } segName = `Segmen ${count}`; }

      if (startPt) {
        if (existingSegIdx >= 0) { 
            newSegments[existingSegIdx].points = [startPt]; 
            newSegments[existingSegIdx].boundary_end = endPt;
        } else { 
            newSegments.push({ id: Date.now(), name: segName, points: [startPt], boundary_end: endPt }); 
        }
        updatePayload.actual_segments_data = newSegments;
        
        const isMasterCoordEmpty = !projectData.start_lat || projectData.start_lat === '-';
        if (isMasterCoordEmpty || newSegments.length === 1) {
          updatePayload.start_lat = startPt.lat;
          updatePayload.start_lng = startPt.lng;
          if (endPt) {
             updatePayload.end_lat = endPt.lat;
             updatePayload.end_lng = endPt.lng;
          }
        }
      }

      const { error: updateErr } = await supabaseClient.from('projects').update(updatePayload).eq('id', projectData.id);
      if (updateErr) throw updateErr;

      // Upload Media
      if (uMedia && uMedia.length > 0) {
        showMsg("Mengompresi dan Mengunggah Foto...", "info");
        const uploadPromises = uMedia.map(async (file, index) => {
          let fileToUpload = file;
          if (file.type.startsWith('image/')) { fileToUpload = await compressImage(file); }
          const fileName = `${Date.now()}_${index}_gallery.${fileToUpload.name.split('.').pop()}`;
          await supabaseClient.storage.from('project-media').upload(`reports/${fileName}`, fileToUpload);
          const { data: urlData } = supabaseClient.storage.from('project-media').getPublicUrl(`reports/${fileName}`);
          return { project_id: projectData.id, title: `Dokumentasi Survei 0% (Part ${index + 1})`, description: uForm.noteDesc || 'Dokumentasi awal', media_url: urlData.publicUrl, is_problem: false };
        });
        const reportEntries = await Promise.all(uploadPromises);
        await supabaseClient.from('field_reports').insert(reportEntries);
      }

      if (uForm.noteDesc) {
        await supabaseClient.from('field_reports').insert([{ project_id: projectData.id, title: 'Catatan Survei', description: `Tanggal Survei: ${uForm.tanggal}\n\n${uForm.noteDesc}`, media_url: null, is_problem: false }]);
      }

      if (uDataUkur) {
        const fileName = `${Date.now()}_data_ukur.${uDataUkur.name.split('.').pop()}`;
        await supabaseClient.storage.from('project-media').upload(`documents/${fileName}`, uDataUkur);
        const { data: urlData } = supabaseClient.storage.from('project-media').getPublicUrl(`documents/${fileName}`);
        await supabaseClient.from('documents').insert([{ project_id: projectData.id, name: uDataUkur.name, category: 'Survei', size: (uDataUkur.size / 1024 / 1024).toFixed(2) + ' MB', file_url: urlData.publicUrl, status: 'Verified' }]);
      }

      let coordMsg = '-';
      if(validPoints.length > 0) {
          coordMsg = `Awal(${validPoints[0].lat}, ${validPoints[0].lng})`;
          if(validPoints.length > 1) {
              coordMsg += ` ... Akhir(${validPoints[validPoints.length-1].lat}, ${validPoints[validPoints.length-1].lng})`;
          }
      }

      await supabaseClient.from('field_reports').insert([{
        project_id: projectData.id, title: 'Pengiriman Data Survei',
        description: `Tim lapangan telah mengirimkan data hasil survei untuk ${segName}.\nPanjang Eks.: ${uForm.panjang || '-'}m | Lebar Eks.: ${uForm.lebar || '-'}m | Model Eks.: ${uForm.jenis_model_awal || '-'}\nKoordinat: ${coordMsg}`
      }]);

      setProjectData(prev => ({ ...prev, ...updatePayload }));

      showMsg("Data Survei Tersimpan!", "success"); setShowReportModal(false); setUMedia([]); setUDataUkur(null);
      setUForm({ tanggal: new Date().toISOString().split('T')[0], namaSegmen: '', points: [{lat: '', lng: ''}, {lat: '', lng: ''}], panjang: '', lebar: '', jenis_model_awal: '', noteDesc: '' });
      fetchProjectDetails(projectData.id);
    } catch (err) { showMsg("Error menyimpan survei: " + err.message, "error"); } finally { setIsProcessing(false); }
  };

  const getUnifiedGPS = (index) => {
    if (!navigator.geolocation) { showMsg("GPS tidak didukung browser ini.", "error"); return; }
    showMsg("Mencari sinyal GPS...", "info");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUForm(prev => {
            const newPoints = [...prev.points];
            newPoints[index] = { ...newPoints[index], lat: pos.coords.latitude, lng: pos.coords.longitude };
            return { ...prev, points: newPoints };
        });
        showMsg(`GPS Titik ${index === 0 ? 'Awal' : (index === uForm.points.length - 1 ? 'Akhir' : `T-${index+1}`)} Ditemukan!`, "success");
      },
      (err) => { showMsg("Gagal mengambil GPS: " + err.message, "error"); }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleRoutesUpdate = async (planned, actualSegs) => {
    if (!projectData) return; setIsProcessing(true);
    try {
      const payload = { planned_path: planned, actual_segments_data: actualSegs, updated_at: new Date().toISOString() };
      if (actualSegs && actualSegs.length > 0) {
        const fSeg = actualSegs[0];
        if (fSeg.points && fSeg.points.length > 0) {
           payload.start_lat = parseFloat(fSeg.points[0].lat);
           payload.start_lng = parseFloat(fSeg.points[0].lng);
           if (fSeg.points.length > 1) {
              const lastPt = fSeg.points[fSeg.points.length - 1];
              payload.end_lat = parseFloat(lastPt.lat);
              payload.end_lng = parseFloat(lastPt.lng);
           }
        }
      }
      const { error } = await supabaseClient.from('projects').update(payload).eq('id', projectData.id);
      if (error) throw error;
      showMsg("Data Rute Disinkronkan!", "success"); fetchProjectDetails(projectData.id);
    } catch (e) { showMsg("Gagal sinkronisasi rute: " + e.message, "error"); } finally { setIsProcessing(false); }
  };

  const handleDragOverDoc = (e) => { e.preventDefault(); setIsDraggingDoc(true); };
  const handleDragLeaveDoc = (e) => { e.preventDefault(); setIsDraggingDoc(false); };
  const handleDropDoc = (e) => { e.preventDefault(); setIsDraggingDoc(false); if (e.dataTransfer.files && e.dataTransfer.files.length > 0) setDocFile(e.dataTransfer.files[0]); };

  const handleDocUpload = async (e) => {
    e.preventDefault(); if (!docFile) { showMsg("Pilih file terlebih dahulu", "error"); return; }
    if (!supabaseClient || !projectData) return; setIsProcessing(true);
    try {
      const fileName = `${Date.now()}_${docFile.name}`;
      await supabaseClient.storage.from('project-media').upload(`documents/${fileName}`, docFile);
      const { data: urlData } = supabaseClient.storage.from('project-media').getPublicUrl(`documents/${fileName}`);
      const { error } = await supabaseClient.from('documents').insert([{ project_id: projectData?.id, name: docFile.name, category: docUploadCategory, size: (docFile.size / 1024 / 1024).toFixed(2) + ' MB', file_url: urlData.publicUrl, status: 'Verified' }]);
      if (error) throw error;
      showMsg("Dokumen Tersimpan!", "success"); setShowDocModal(false); setDocFile(null); fetchProjectDetails(projectData.id);
    } catch (e) { showMsg("Gagal upload dokumen: " + e.message, "error"); } finally { setIsProcessing(false); }
  };

  const handleDropReportUpload = async (e) => {
    e.preventDefault(); setIsDraggingReport(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) { handleDirectReportUpload({ target: { files: [file] } }); }
      else { showMsg("Hanya menerima file berformat PDF!", "error"); }
    }
  };

  const handleDirectReportUpload = async (e) => {
    const file = e.target.files[0]; if (!file || !supabaseClient || !projectData) return; setIsProcessing(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      await supabaseClient.storage.from('project-media').upload(`documents/${fileName}`, file);
      const { data: urlData } = supabaseClient.storage.from('project-media').getPublicUrl(`documents/${fileName}`);
      
      // Hapus dokumen laporan lama agar selalu hanya ada 1 file laporan PDF (Replace)
      await supabaseClient.from('documents').delete().eq('project_id', projectData.id).eq('category', 'Laporan');

      const { error } = await supabaseClient.from('documents').insert([{ project_id: projectData?.id, name: file.name, category: 'Laporan', size: (file.size / 1024 / 1024).toFixed(2) + ' MB', file_url: urlData.publicUrl, status: 'Verified' }]);
      if (error) throw error;
      showMsg("Laporan Mingguan PDF Tersimpan!", "success"); fetchProjectDetails(projectData.id);
    } catch (err) { showMsg("Gagal upload PDF: " + err.message, "error"); } finally { setIsProcessing(false); if (reportFileInputRef.current) reportFileInputRef.current.value = null; }
  };

  const confirmDeleteData = async () => {
    if (!deleteConfig) return; setIsProcessing(true);
    try {
      let tableName = 'documents';
      if (deleteConfig.type === 'media') tableName = 'field_reports';
      else if (deleteConfig.type === 'project') tableName = 'projects';
      else if (deleteConfig.type === 'employee') tableName = 'karyawan';

      const { error } = await supabaseClient.from(tableName).delete().eq('id', deleteConfig.id);
      if (error) throw error;
      
      // Simpan tipe & ID ke variabel lokal agar tidak hilang saat state di-reset
      const deletedType = deleteConfig.type;
      const deletedId = deleteConfig.id;

      // UPDATE OPTIMISTIS: Langsung hilangkan dari layar tanpa harus menunggu loading database
      if (deletedType === 'media') setFeeds(prev => prev.filter(f => f.id !== deletedId));
      else if (deletedType === 'doc') setDocuments(prev => prev.filter(d => d.id !== deletedId));
      else if (deletedType === 'project') {
          setMasterProjects(prev => prev.filter(p => p.id !== deletedId));
          // Jika proyek yang dihapus adalah proyek yang sedang aktif dibuka
          if (projectData && projectData.id === deletedId) {
              setAppMode(previousAppMode || 'selection');
              setProjectData(null);
          }
      }

      showMsg("Data berhasil dihapus!", "success"); 
      setDeleteConfig(null); 
      
      // Re-fetch untuk mensinkronkan ulang data total di belakang layar
      if (deletedType === 'project') fetchAllProjects();
      else if (deletedType === 'employee') fetchEmployees();
      else if (projectData && projectData.id !== deletedId) fetchProjectDetails(projectData.id);
      
    } catch (err) { showMsg(err.message, "error"); } finally { setIsProcessing(false); }
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault(); setIsProcessing(true);
    try {
      const payload = { employee_id: employeeForm.employee_id, name: employeeForm.name, role: employeeForm.role, pin: employeeForm.pin };
      if (employeeForm.id) {
        const { error } = await supabaseClient.from('karyawan').update(payload).eq('id', employeeForm.id);
        if (error) throw error;
        showMsg("Data Karyawan Diperbarui!", "success");
      } else {
        const { error } = await supabaseClient.from('karyawan').insert([payload]);
        if (error) throw error;
        showMsg("Karyawan Baru Ditambahkan!", "success");
      }
      setShowEmployeeModal(false); fetchEmployees();
    } catch (err) { showMsg("Gagal menyimpan karyawan: " + err.message, "error"); } finally { setIsProcessing(false); }
  };

  const handleMoveDocument = async () => {
    if (!moveDocConfig) return; setIsProcessing(true);
    try {
      const newCat = moveDocConfig.newCategory || moveDocConfig.category;
      if (newCat === moveDocConfig.category) { setMoveDocConfig(null); setIsProcessing(false); return; }
      const { error } = await supabaseClient.from('documents').update({ category: newCat }).eq('id', moveDocConfig.id);
      if (error) throw error;
      showMsg("Kategori diubah!", "success"); setMoveDocConfig(null); fetchProjectDetails(projectData.id);
    } catch (err) { showMsg(err.message, "error"); } finally { setIsProcessing(false); }
  };

  const handleOpenSCurveModal = () => {
    if (sCurveData && sCurveData.length > 0) {
      setSCurveForm({
        plan: sCurveData.map(d => d.r != null ? String(d.r).replace('.', ',') : '0').join(' - '),
        actual: sCurveData.map(d => d.a != null ? String(d.a).replace('.', ',') : '').filter(Boolean).join(' - ')
      });
    } else setSCurveForm({ plan: '', actual: '' });
    setShowSCurveModal(true);
  };

  const handleSCurveTextSubmit = async (e) => {
    e.preventDefault(); setIsProcessing(true);
    try {
      const cleanPlan = String(sCurveForm.plan || '').replace(/\s+/g, '').replace(/,/g, '.').split('-').filter(Boolean);
      const cleanActual = String(sCurveForm.actual || '').replace(/\s+/g, '').replace(/,/g, '.').split('-').filter(Boolean);
      const parsedData = []; let lastValidA = 0;
      for (let i = 0; i < Math.max(cleanPlan.length, cleanActual.length); i++) {
        let point = { n: 'M' + (i + 1), r: isNaN(parseFloat(cleanPlan[i])) ? 0 : parseFloat(cleanPlan[i]) };
        if (i < cleanActual.length) {
          const aVal = parseFloat(cleanActual[i]);
          point.a = (aVal === 0 && lastValidA > 0) ? null : (isNaN(aVal) ? null : aVal);
        } else point.a = null;
        if (point.a !== null) lastValidA = point.a;
        parsedData.push(point);
      }
      setSCurveData(parsedData); setShowSCurveModal(false);
      if (projectData) {
        // PERBAIKAN: Kalkulasi nilai realisasi terakhir dan simpan juga ke kolom actual_progress
        const calculatedProgress = lastValidA || 0;
        const { error } = await supabaseClient.from('projects').update({ 
            s_curve_data: parsedData, 
            actual_progress: parseFloat(calculatedProgress.toFixed(2)),
            updated_at: new Date().toISOString() 
        }).eq('id', projectData.id);
        if (error) throw error;
        
        // Update state lokal agar UI langsung berubah tanpa perlu refresh
        setProjectData(prev => ({ 
            ...prev, 
            s_curve_data: parsedData, 
            actual_progress: parseFloat(calculatedProgress.toFixed(2)) 
        }));
      }
      showMsg("Grafik Berhasil Disinkronkan!", "success");
    } catch (err) { showMsg("Error menyimpan Kurva S: " + err.message, "error"); } finally { setIsProcessing(false); }
  };

  const handleDragStart = (e, index) => { setDraggedIdx(index); e.dataTransfer.setData('text/plain', index); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e, index) => {
    e.preventDefault(); if (draggedIdx === null || draggedIdx === index) return;
    const newCats = [...docCategories]; const draggedCat = newCats[draggedIdx];
    newCats.splice(draggedIdx, 1); newCats.splice(index, 0, draggedCat);
    setDraggedIdx(index); setDocCategories(newCats);
  };
  const handleDragEnd = () => {
    setDraggedIdx(null);
    if (projectData && supabaseClient) { supabaseClient.from('projects').update({ doc_categories: docCategories }).eq('id', projectData.id).then(); }
  };

  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea"); textArea.value = text; textArea.style.position = "fixed"; textArea.style.left = "-9999px"; textArea.style.top = "0"; document.body.appendChild(textArea); textArea.select();
    try { document.execCommand('copy'); } catch (err) { } document.body.removeChild(textArea);
    showMsg("SQL disalin ke clipboard", "success");
  };

  const renderMediaContent = (url) => {
    if (!url) return null;
    const urls = String(url).split(',');
    return (
      <div className={`grid gap-3 ${urls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {urls.map((u, i) => {
          const ext = String(u).split('.').pop().toLowerCase().split('?')[0];
          if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) { return <video key={i} src={u} controls className="w-full h-auto max-h-[60vh] object-contain rounded-2xl bg-black" />; }
          else if (ext === 'pdf') { return <iframe key={i} src={u} className="w-full h-[60vh] rounded-2xl border border-slate-200" title="PDF Lampiran" />; }
          else { return <img key={i} src={u} alt={`Lampiran Media ${i+1}`} className="w-full h-auto max-h-[60vh] object-contain rounded-2xl bg-slate-100" />; }
        })}
      </div>
    );
  };

  // --- MEMOIZED DATA BLOCKS ---
  const safeFeeds = useMemo(() => Array.isArray(feeds) ? feeds : [], [feeds]);
  const safeDocuments = useMemo(() => Array.isArray(documents) ? documents : [], [documents]);

  const surveyLogs = useMemo(() => safeFeeds.filter(f => f.title === 'Pengiriman Data Survei').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), [safeFeeds]);

  useEffect(() => {
    if (surveyLogs.length > 0) { if (!activeSurveyLogId || !surveyLogs.find(l => l.id === activeSurveyLogId)) { setActiveSurveyLogId(surveyLogs[0].id); } }
    else { setActiveSurveyLogId(''); }
  }, [surveyLogs, activeSurveyLogId, projectData?.id]);

  const { actualProg, lastUpdatedWeek, deviasi, isDeviasiPositive, processedSCurveData } = useMemo(() => {
    let act = null, tgt = 0, pA = 0, week = '-';
    const proc = (sCurveData || []).map((d) => { let a = parseFloat(d.a); if (isNaN(a) || (a === 0 && pA > 0)) a = null; if (a !== null) pA = a; return { ...d, a }; });
    if (proc.length > 0) {
      const aVals = proc.map(d => d.a); let lastIdx = -1;
      for (let i = aVals.length - 1; i >= 0; i--) { if (aVals[i] !== null) { lastIdx = i; break; } }
      if (lastIdx !== -1) { act = proc[lastIdx].a; tgt = proc[lastIdx].r || 0; week = proc[lastIdx].n || '-'; }
      else { tgt = proc[0].r || 0; week = proc[0].n || '-'; }
    }
    const currentActual = act !== null ? act : 0; const dev = (currentActual - tgt).toFixed(2); const isDevPos = currentActual >= tgt;
    return { actualProg: act, lastUpdatedWeek: week, deviasi: dev, isDeviasiPositive: isDevPos, processedSCurveData: proc };
  }, [sCurveData]);

  const { terminNum, terminPct } = useMemo(() => {
    let tN = '1', tP = '0';
    if ((projectData?.termin_ke || '').includes(',')) [tN, tP] = projectData.termin_ke.split(',');
    return { terminNum: tN, terminPct: tP };
  }, [projectData]);

  const sisaWaktuInfo = useMemo(() => {
    const spmk = findDynamicValue(projectData?.kontraktor_data, ['tanggal spmk', 'tgl spmk'], ['tanggal_spmk', 'tgl_spmk']) || projectData?.tanggal_spmk;
    const waktu = projectData?.waktu_pelaksanaan || findDynamicValue(projectData?.kontraktor_data, ['waktu pelaksanaan'], ['waktu_pelaksanaan']);

    if (!spmk && !waktu) return { value: '-', sub: 'Data belum lengkap', status: 'neutral' };

    let durationDays = 0;
    if (waktu) { durationDays = parseInt(String(waktu).replace(/[^0-9]/g, ''), 10); }

    if (!spmk && waktu) {
      if (isNaN(durationDays) || durationDays === 0) return { value: '-', sub: 'Format waktu salah', status: 'neutral' };
      return { value: `${durationDays}\nHari`, sub: `Total Waktu Pelaksanaan: ${durationDays} Hari\nSPMK Awal: Belum diatur\nSPMK Akhir: Belum diatur`, status: 'neutral' };
    }
    if (spmk && !waktu) return { value: '-', sub: 'Waktu Pelaksanaan belum diatur', status: 'neutral' };

    const spmkDate = new Date(spmk);
    if (isNaN(durationDays) || isNaN(spmkDate.getTime())) return { value: '-', sub: 'Format waktu salah', status: 'neutral' };

    const endDate = new Date(spmkDate); endDate.setDate(spmkDate.getDate() + (durationDays - 1));
    const diffDays = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));

    const subText = `Total Waktu Pelaksanaan: ${durationDays} Hari\nSPMK Awal: ${spmkDate.toLocaleDateString('id-ID')}\nSPMK Akhir: ${endDate.toLocaleDateString('id-ID')}`;

    if (diffDays > 0) return { value: `${diffDays}\nHari`, sub: subText, status: 'good' };
    else if (diffDays === 0) return { value: `Hari\nIni`, sub: subText, status: 'warning' };
    return { value: `${Math.abs(diffDays)}\nHari Lewat`, sub: subText, status: 'warning' };
  }, [projectData]);

  const filteredDocs = useMemo(() => safeDocuments.filter(d => (docFilterCategory === 'Semua' || d.category === docFilterCategory) && String(d.name || '').toLowerCase().includes(docSearchQuery.toLowerCase())), [safeDocuments, docFilterCategory, docSearchQuery]);
  const photos = useMemo(() => {
    let allPhotos = [];
    safeFeeds.filter(f => f.media_url).forEach(f => {
      String(f.media_url).split(',').forEach((u, idx) => {
         allPhotos.push({ ...f, media_url: u, original_id: f.id, display_id: `${f.id}-${idx}` });
      });
    });
    return allPhotos;
  }, [safeFeeds]);
  const weeklyReports = useMemo(() => safeDocuments.filter(d => d.category === 'Laporan' && String(d.name || '').toLowerCase().endsWith('.pdf')), [safeDocuments]);
  const persiapanSidebarFeeds = useMemo(() => safeFeeds.filter(f => !String(f.title || '').includes('Dokumentasi Survei 0%') && f.title !== 'Catatan Survei'), [safeFeeds]);

  const dashboardData = useMemo(() => {
    let displayPanjang = '-', displayLebar = '-', displayModel = '-', displaySegName = '-', tglStr = '-', sLat = '-', sLng = '-', eLat = '-', eLng = '-';
    let displayNote = null, displayCsv = null; let displayPhotos = [];

    const activeLog = surveyLogs.find(l => l.id === activeSurveyLogId);

    if (activeLog) {
      tglStr = new Date(activeLog.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) + ' ' + new Date(activeLog.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

      const matchSeg = String(activeLog.description || '').match(/data hasil survei untuk (.*?)\.\n/);
      const matchPanjang = String(activeLog.description || '').match(/(?:Panjang|Panjang Eks\.)\s*:\s*(.*?)m\s*\|/);
      const matchLebar = String(activeLog.description || '').match(/(?:Lebar|Lebar Eks\.)\s*:\s*(.*?)m\s*\|/);
      const matchModel = String(activeLog.description || '').match(/(?:Model|Model Eks\.)\s*:\s*(.*?)(?:\n|$)/);

      if (matchSeg && matchSeg[1]) displaySegName = matchSeg[1].trim();
      if (matchPanjang && matchPanjang[1]) displayPanjang = matchPanjang[1].trim();
      if (matchLebar && matchLebar[1]) displayLebar = matchLebar[1].trim();
      if (matchModel && matchModel[1]) displayModel = matchModel[1].trim();

      const matchCoordLog = String(activeLog.description || '').match(/Koordinat:\s*Awal\(([^,]+),\s*([^)]+)\)(?:.*Akhir\(([^,]+),\s*([^)]+)\))?/);
      if (matchCoordLog) {
        sLat = matchCoordLog[1].trim(); sLng = matchCoordLog[2].trim();
        if(matchCoordLog[3] && matchCoordLog[4]) {
           eLat = matchCoordLog[3].trim(); eLng = matchCoordLog[4].trim();
        }
      }

      const T = new Date(activeLog.created_at).getTime(); const timeWindow = 15000;

      let rawPhotos = safeFeeds.filter(f => String(f.title || '').includes('Dokumentasi Survei') && Math.abs(new Date(f.created_at).getTime() - T) <= timeWindow);
      let flatDisplayPhotos = [];
      rawPhotos.forEach(f => {
        String(f.media_url).split(',').forEach((u, idx) => {
          flatDisplayPhotos.push({ ...f, media_url: u, original_id: f.id, display_id: `${f.id}-${idx}` });
        });
      });
      displayPhotos = flatDisplayPhotos;
      displayNote = safeFeeds.find(n => String(n.title || '').includes('Catatan Survei') && Math.abs(new Date(n.created_at).getTime() - T) <= timeWindow);
      displayCsv = safeDocuments.find(d => String(d.name || '').toLowerCase().endsWith('.csv') && Math.abs(new Date(d.created_at).getTime() - T) <= timeWindow);
    }

    let noteText = displayNote ? String(displayNote.description || '') : '-';
    noteText = noteText.replace(/^Tanggal Survei:.*?\n\n/, '');

    return { displayPanjang, displayLebar, displayModel, displaySegName, displayPhotos, displayCsv, tglStr, noteText, sLat, sLng, eLat, eLng };
  }, [safeFeeds, safeDocuments, surveyLogs, activeSurveyLogId]);

  const { displayPanjang, displayLebar, displayModel, displaySegName, displayPhotos, displayCsv, tglStr, noteText, sLat, sLng, eLat, eLng } = dashboardData;

  const contractDataArrays = useMemo(() => {
    let dData = Array.isArray(projectData?.dinas_data) && projectData.dinas_data.length > 0
      ? projectData.dinas_data.map(d => ({ label: String(d.role || 'Instansi'), value: String(d.name || ''), sub: d.nip ? `NIP: ${String(d.nip)}` : '' }))
      : INITIAL_DINAS_DATA.map(d => ({ label: String(d.role || 'Instansi'), value: String(d.name || ''), sub: d.nip ? `NIP: ${String(d.nip)}` : '' }));

    const kData = (projectData?.kontraktor_data?.fields || buildDynamicFields(projectData?.kontraktor_data, initialKontraktorFields)).map(f => ({ label: String(f.label || ''), value: String(f.value || '') }));
    (Array.isArray(projectData?.kontraktor_data?.personil) ? projectData.kontraktor_data.personil : []).forEach((p, i) => { kData.push({ label: `${String(p.name || `Nama Personil ${i + 1}`)}`, value: String(p.position || 'Jabatan') }); });

    const cData = (projectData?.konsultan_data?.fields || buildDynamicFields(projectData?.konsultan_data, initialKonsultanFields)).map(f => ({ label: String(f.label || ''), value: String(f.value || '') }));
    (Array.isArray(projectData?.konsultan_data?.personil) ? projectData.konsultan_data.personil : []).forEach((p, i) => { cData.push({ label: `${String(p.name || `Nama Personil ${i + 1}`)}`, value: String(p.position || 'Jabatan') }); });

    return { dinasData: dData, kontraktorData: kData, konsultanData: cData };
  }, [projectData]);

  const { dinasData, kontraktorData, konsultanData } = contractDataArrays;

  // --- ROUTING TINGKAT ATAS ---

  const renderGlobalRekapModal = () => {
    if (!showGlobalRekap) return null;

    // Helper Functions untuk Ekstraksi Data Spesifik dari JSON
    const getPPKName = (dinasData) => {
      if (!Array.isArray(dinasData)) return '-';
      const ppk = dinasData.find(d => String(d.role || '').toLowerCase().includes('ppk') || String(d.role || '').toLowerCase().includes('pembuat komitmen'));
      return ppk && ppk.name ? ppk.name : '-';
    };

    const getPersonilNames = (dataObj) => {
      if (!dataObj) return '-';
      let names = [];
      // Coba ambil dari array personil (beserta jabatan)
      if (Array.isArray(dataObj.personil) && dataObj.personil.length > 0) {
        names = dataObj.personil.map(p => {
           if (p.name && p.position) return `${p.name} (${p.position})`;
           if (p.name) return p.name;
           return null;
        }).filter(Boolean);
      }
      // Jika personil kosong, coba cari dari fields (misal: Direktur)
      if (names.length === 0 && Array.isArray(dataObj.fields)) {
        const direktur = dataObj.fields.find(f => String(f.label || '').toLowerCase().includes('direktur'));
        if (direktur && direktur.value) names.push(`${direktur.value} (Direktur)`);
      }
      return names.length > 0 ? names.join(', ') : '-';
    };

    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center z-[9999] p-4 pt-24 md:p-8 md:pt-32">
        <div className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[32px] p-6 md:p-8 w-full max-w-7xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative flex flex-col max-h-[calc(100vh-7rem)] md:max-h-[calc(100vh-10rem)]">
          <button onClick={() => setShowGlobalRekap(false)} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-rose-500 transition-colors bg-white/60 hover:bg-white/90 backdrop-blur-md border border-white shadow-sm rounded-full"><X size={20} /></button>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pr-12 border-b border-slate-300/40 pb-4 shrink-0">
             <div>
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><FileSpreadsheet className="text-amber-500" /> Rekapitulasi & Laporan Proyek</h3>
                <p className="text-xs text-slate-500 font-bold mt-1">Pilih pekerjaan dan kolom data yang ingin Anda unduh</p>
             </div>
             <button onClick={() => {
                if (selectedRekapProjects.size === 0) {
                   showMsg("Pilih minimal satu proyek untuk diunduh", "warning");
                   return;
                }
                
                let csvContent = "data:text/csv;charset=utf-8,";
                
                // BUAT HEADER DINAMIS
                let header = "No,Nama Pekerjaan";
                if (rekapOptions.status) header += ",Status";
                if (rekapOptions.progress) header += ",Progress Fisik (%)";
                if (rekapOptions.termin) header += ",Posisi Termin";
                if (rekapOptions.dimensi) header += ",Panjang Rencana,Lebar Rencana,Jenis Saluran";
                if (rekapOptions.ppk) header += ",Nama PPK";
                if (rekapOptions.kontraktor) header += ",Personil Kontraktor";
                if (rekapOptions.konsultan) header += ",Personil Konsultan";
                if (rekapOptions.dokumen) header += `,Cek Dokumen (${rekapDocKeyword})`;
                header += ",Update Terakhir";
                csvContent += header + "\n";

                // ISI BARIS DATA DINAMIS HANYA UNTUK PROYEK YANG DICENTANG
                const projectsToExport = masterProjects.filter(p => selectedRekapProjects.has(p.id));
                projectsToExport.forEach((p, index) => {
                  const prog = parseFloat(p.actual_progress || 0).toFixed(2);
                  let termin = '1'; let tPct = '0';
                  if ((p.termin_ke || '').toString().includes(',')) { [termin, tPct] = p.termin_ke.split(','); } else { termin = p.termin_ke || '1'; }
                  const tglUpdate = p.updated_at ? new Date(p.updated_at).toLocaleDateString('id-ID') : (p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID') : '-');
                  const safeName = String(p.pekerjaan || '').replace(/"/g, '""'); // Escape quotes for CSV
                  
                  let row = `"${index + 1}","${safeName}"`;
                  if (rekapOptions.status) row += `,"${p.status}"`;
                  if (rekapOptions.progress) row += `,"${prog}"`;
                  if (rekapOptions.termin) row += `,"Termin ${termin} (${tPct}%)"`;
                  if (rekapOptions.dimensi) row += `,"${p.panjang_rencana || '-'}","${p.lebar_rencana || '-'}","${p.jenis_model || '-'}"`;
                  if (rekapOptions.ppk) row += `,"${getPPKName(p.dinas_data)}"`;
                  if (rekapOptions.kontraktor) row += `,"${getPersonilNames(p.kontraktor_data)}"`;
                  if (rekapOptions.konsultan) row += `,"${getPersonilNames(p.konsultan_data)}"`;
                  
                  if (rekapOptions.dokumen) {
                    const docs = globalDocuments.filter(d => d.project_id === p.id && String(d.name).toLowerCase().includes(rekapDocKeyword.toLowerCase()));
                    if (docs.length > 0) {
                        row += `,"Ada (${docs.length} File)"`;
                    } else {
                        row += `,"Tidak Ada"`;
                    }
                  }

                  row += `,"${tglUpdate}"`;
                  
                  csvContent += row + "\n";
                });

                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `Rekap_Semua_Proyek_${new Date().toLocaleDateString('id-ID').replace(/\//g,'-')}.csv`);
                document.body.appendChild(link);
                link.click(); document.body.removeChild(link);
             }} className="bg-amber-500 text-white px-4 py-3 rounded-xl text-xs font-black uppercase shadow-sm hover:bg-amber-600 transition-all flex items-center gap-2 shrink-0 border border-amber-600">
                <Download size={16} /> Unduh CSV (Excel)
             </button>
          </div>

          {/* OPSI FILTER KOLOM TAMBAHAN */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-4 p-4 bg-white/50 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm shrink-0">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 w-full sm:w-auto">Sertakan Kolom:</span>
             <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
               <input type="checkbox" checked={rekapOptions.status} onChange={e => setRekapOptions({...rekapOptions, status: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" /> 
               Status Proyek
             </label>
             <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
               <input type="checkbox" checked={rekapOptions.progress} onChange={e => setRekapOptions({...rekapOptions, progress: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" /> 
               Progress Fisik
             </label>
             <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
               <input type="checkbox" checked={rekapOptions.termin} onChange={e => setRekapOptions({...rekapOptions, termin: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" /> 
               Posisi Termin
             </label>
             <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
               <input type="checkbox" checked={rekapOptions.dimensi} onChange={e => setRekapOptions({...rekapOptions, dimensi: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" /> 
               Panjang, Lebar & Saluran
             </label>
             <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
               <input type="checkbox" checked={rekapOptions.ppk} onChange={e => setRekapOptions({...rekapOptions, ppk: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" /> 
               Nama PPK
             </label>
             <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
               <input type="checkbox" checked={rekapOptions.kontraktor} onChange={e => setRekapOptions({...rekapOptions, kontraktor: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" /> 
               Personil Kontraktor
             </label>
             <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
               <input type="checkbox" checked={rekapOptions.konsultan} onChange={e => setRekapOptions({...rekapOptions, konsultan: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" /> 
               Personil Konsultan
             </label>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-700 transition-colors">
               <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                 <input type="checkbox" checked={rekapOptions.dokumen} onChange={e => setRekapOptions({...rekapOptions, dokumen: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" /> 
                 Cek File Dokumen:
               </label>
               {rekapOptions.dokumen && (
                 <input type="text" value={rekapDocKeyword} onChange={e => setRekapDocKeyword(e.target.value)} placeholder="Ketik kata kunci..." className="ml-1 border border-slate-300 rounded-lg px-2.5 py-1.5 text-[10px] w-32 outline-none focus:border-blue-500 font-black text-blue-600 shadow-inner" title="Ketik nama file yang ingin di cek (misal: Kontrak, MC, PHO)" />
               )}
             </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar border border-white/60 bg-white/30 backdrop-blur-sm rounded-2xl shadow-inner">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-white/60 backdrop-blur-xl sticky top-0 shadow-sm z-10 border-b border-white/50">
                <tr className="text-[10px] font-black uppercase text-slate-600 tracking-wider">
                  <th className="p-4 border-b border-slate-200 w-12 text-center">
                    <input 
                       type="checkbox" 
                       className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                       checked={masterProjects.length > 0 && selectedRekapProjects.size === masterProjects.length}
                       ref={input => { if (input) input.indeterminate = selectedRekapProjects.size > 0 && selectedRekapProjects.size < masterProjects.length; }}
                       onChange={(e) => {
                         if (e.target.checked) setSelectedRekapProjects(new Set(masterProjects.map(p => p.id)));
                         else setSelectedRekapProjects(new Set());
                       }}
                       title="Pilih Semua Pekerjaan"
                    />
                  </th>
                  <th className="p-4 border-b border-slate-200 w-12 text-center">No</th>
                  <th className="p-4 border-b border-slate-200 min-w-[200px]">Nama Pekerjaan</th>
                  
                  {/* HEADER KOLOM TAMBAHAN DINAMIS */}
                  {rekapOptions.status && <th className="p-4 border-b border-slate-200 border-l border-slate-200 text-center w-32 bg-slate-50/50">Status</th>}
                  {rekapOptions.progress && <th className="p-4 border-b border-slate-200 border-l border-slate-200 text-center w-32 bg-slate-50/50">Progress Fisik</th>}
                  {rekapOptions.termin && <th className="p-4 border-b border-slate-200 border-l border-slate-200 text-center w-32 bg-slate-50/50">Posisi Termin</th>}
                  
                  {rekapOptions.dimensi && <th className="p-4 border-b border-slate-200 border-l border-slate-200 bg-blue-50/50 w-48">Dimensi & Saluran</th>}
                  {rekapOptions.ppk && <th className="p-4 border-b border-slate-200 border-l border-slate-200 bg-amber-50/50 w-48">Pejabat (PPK)</th>}
                  {rekapOptions.kontraktor && <th className="p-4 border-b border-slate-200 border-l border-slate-200 bg-emerald-50/50 w-48">Kontraktor</th>}
                  {rekapOptions.konsultan && <th className="p-4 border-b border-slate-200 border-l border-slate-200 bg-rose-50/50 w-48">Konsultan</th>}
                  {rekapOptions.dokumen && <th className="p-4 border-b border-slate-200 border-l border-slate-200 bg-indigo-50/50 w-48">Audit File: {rekapDocKeyword || '-'}</th>}
                  
                  <th className="p-4 border-b border-slate-200 border-l border-slate-200 text-center w-36">Update Terakhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {masterProjects.length === 0 ? (
                  <tr><td colSpan="13" className="p-10 text-center text-slate-500 font-bold text-xs">Belum ada proyek terdaftar.</td></tr>
                ) : (
                  masterProjects.map((p, idx) => {
                    let termin = '1'; let tPct = '0';
                    if ((p.termin_ke || '').toString().includes(',')) { [termin, tPct] = p.termin_ke.split(','); } else { termin = p.termin_ke || '1'; }
                    const actualProg = parseFloat(p.actual_progress || 0);
                    const isRunning = p.status === 'Running' || actualProg > 0;

                    return (
                      <tr key={p.id} className={`transition-colors group ${selectedRekapProjects.has(p.id) ? 'bg-white/40 hover:bg-white/70' : 'bg-white/10 opacity-60'}`}>
                        <td className="p-4 text-center">
                           <input 
                             type="checkbox" 
                             className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                             checked={selectedRekapProjects.has(p.id)}
                             onChange={(e) => {
                               const newSet = new Set(selectedRekapProjects);
                               if (e.target.checked) newSet.add(p.id);
                               else newSet.delete(p.id);
                               setSelectedRekapProjects(newSet);
                             }}
                           />
                        </td>
                        <td className="p-4 text-center text-slate-600 text-xs">{idx + 1}</td>
                        <td className="p-4">
                          <div className="text-slate-800 text-xs line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors" title={p.pekerjaan}>{p.pekerjaan}</div>
                        </td>
                        
                        {/* KONTEN KOLOM TAMBAHAN DINAMIS */}
                        {rekapOptions.status && (
                          <td className="p-4 border-l border-slate-100 text-center">
                            <span className={`px-2 py-1 text-[9px] uppercase tracking-widest rounded shadow-sm border ${isRunning ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                              {isRunning ? 'Pelaksanaan' : 'Persiapan'}
                            </span>
                          </td>
                        )}
                        
                        {rekapOptions.progress && (
                          <td className="p-4 border-l border-slate-100 text-center">
                            <div className="flex flex-col items-center w-24 mx-auto">
                              <span className="text-slate-800 text-sm">{actualProg.toFixed(1)}%</span>
                              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden shadow-inner">
                                <div className={`h-full rounded-full ${isRunning ? 'bg-blue-500' : 'bg-slate-400'}`} style={{ width: `${actualProg}%` }}></div>
                              </div>
                            </div>
                          </td>
                        )}

                        {rekapOptions.termin && (
                          <td className="p-4 border-l border-slate-100 text-center">
                             <div className="flex flex-col items-center">
                                <span className="text-slate-800 text-xs">Termin {toRoman(termin)}</span>
                                <span className="text-[9px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded mt-0.5 border border-slate-200">{tPct}%</span>
                             </div>
                          </td>
                        )}

                        {rekapOptions.dimensi && (
                          <td className="p-4 border-l border-slate-100 bg-blue-50/20 text-xs text-slate-700">
                             <div className="flex flex-col gap-1">
                               <span>P: {p.panjang_rencana || '-'}m | L: {p.lebar_rencana || '-'}m</span>
                               <span className="text-[10px] text-blue-600 truncate">{p.jenis_model || '-'}</span>
                             </div>
                          </td>
                        )}
                        {rekapOptions.ppk && (
                          <td className="p-4 border-l border-slate-100 bg-amber-50/20 text-xs text-amber-800 line-clamp-2">
                             {getPPKName(p.dinas_data)}
                          </td>
                        )}
                        {rekapOptions.kontraktor && (
                          <td className="p-4 border-l border-slate-100 bg-emerald-50/20 text-[11px] text-emerald-800 leading-snug">
                             {getPersonilNames(p.kontraktor_data)}
                          </td>
                        )}
                        {rekapOptions.konsultan && (
                          <td className="p-4 border-l border-slate-100 bg-rose-50/20 text-[11px] text-rose-800 leading-snug">
                             {getPersonilNames(p.konsultan_data)}
                          </td>
                        )}

                        {rekapOptions.dokumen && (
                          <td className="p-4 border-l border-slate-100 bg-indigo-50/20 text-xs">
                             {(() => {
                                if (!rekapDocKeyword) return <span className="text-slate-400 text-[10px] italic">Ketik kata kunci...</span>;
                                const docs = globalDocuments.filter(d => d.project_id === p.id && String(d.name).toLowerCase().includes(rekapDocKeyword.toLowerCase()));
                                if (docs.length > 0) {
                                   return (
                                     <div className="flex flex-col gap-1.5">
                                       <span className="text-emerald-600 flex items-center gap-1 font-medium text-[10px] uppercase"><CheckCircle2 size={12}/> Ada ({docs.length} File)</span>
                                       {docs.slice(0,2).map((d, i) => (
                                         <a key={i} href={d.file_url} target="_blank" rel="noopener noreferrer" className="text-[9px] text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[160px] block" title={d.name}>{d.name}</a>
                                       ))}
                                       {docs.length > 2 && <span className="text-[9px] text-slate-600 bg-slate-100 w-max px-1.5 py-0.5 rounded border border-slate-200">+{docs.length - 2} file lain</span>}
                                     </div>
                                   )
                                } else {
                                   return <span className="text-rose-500 flex items-center gap-1 font-medium text-[10px] uppercase"><X size={12} strokeWidth={3}/> Tidak Ada</span>;
                                }
                             })()}
                          </td>
                        )}

                        <td className="p-4 border-l border-slate-100 text-center">
                           <span className="text-[10px] text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 whitespace-nowrap">
                             {p.updated_at ? new Date(p.updated_at).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'}) : (p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'}) : '-')}
                           </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (appMode === 'login') {
     return <LoginView onLogin={handleLogin} error={authError} isProcessing={isProcessing} />;
  }

  if (appMode === 'selection') {
     return (
       <>
         {notification && (
          <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[6000] px-6 py-4 rounded-2xl shadow-xl border backdrop-blur-xl animate-in slide-in-from-top-5 flex items-center gap-3 ${notification.type === 'error' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
            <span className="text-xs font-bold uppercase tracking-tight">{String(notification.msg || '')}</span>
          </div>
         )}
         <ModeSelectionView 
            projects={masterProjects || []}
            onSelectMaster={() => setAppMode('master')} 
            onSelectProject={handleSelectProject}
            onLogout={handleLogout}
            onViewAbsensi={() => setAppMode('absensi')}
            onAddProject={() => setShowNewProjectModal(true)}
            onViewRekap={() => setShowGlobalRekap(true)}
         />
         {showNewProjectModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[5000] p-4">
            <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setShowNewProjectModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 transition-colors"><X size={20} /></button>
              <h3 className="text-lg font-black mb-6">Buat Kamar Proyek Baru</h3>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-500">Nama Pekerjaan <span className="text-rose-500">*</span></label>
                  <input type="text" className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all" value={newProjectForm.pekerjaan} onChange={e => setNewProjectForm({ ...newProjectForm, pekerjaan: e.target.value })} placeholder="Misal: Peningkatan Jalan Baru..." required />
                </div>
                <div>
                  <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-500">Fase Awal Proyek</label>
                  <select className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all" value={newProjectForm.status} onChange={e => setNewProjectForm({ ...newProjectForm, status: e.target.value })}>
                    <option value="Preparation">Tahap Persiapan</option>
                    <option value="Running">Tahap Pelaksanaan</option>
                  </select>
                </div>
                <button type="submit" disabled={isProcessing} className="w-full bg-blue-600 text-white py-4 rounded-2xl text-xs font-bold uppercase mt-4 hover:bg-blue-700 transition-colors shadow-md">
                  {isProcessing ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Buat Proyek Sekarang'}
                </button>
              </form>
            </div>
          </div>
         )}
         {renderGlobalRekapModal()}
       </>
     );
  }

  if (appMode === 'project_list') {
     return (
       <>
         {notification && (
          <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[6000] px-6 py-4 rounded-2xl shadow-xl border backdrop-blur-xl animate-in slide-in-from-top-5 flex items-center gap-3 ${notification.type === 'error' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
            <span className="text-xs font-bold uppercase tracking-tight">{String(notification.msg || '')}</span>
          </div>
         )}
         <ProjectSelectionListView 
            projects={masterProjects || []} 
            onSelectProject={handleSelectProject} 
            onBack={() => setAppMode('selection')}
            onAddProject={() => setShowNewProjectModal(true)}
            onDeleteProject={(proj) => setDeleteConfig({ id: proj.id, type: 'project', name: proj.pekerjaan })}
            onViewRekap={() => setShowGlobalRekap(true)}
         />
         {/* Modals for new/delete project (reused from master) */}
         {showNewProjectModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[5000] p-4">
            <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setShowNewProjectModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 transition-colors"><X size={20} /></button>
              <h3 className="text-lg font-black mb-6">Buat Kamar Proyek Baru</h3>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-500">Nama Pekerjaan <span className="text-rose-500">*</span></label>
                  <input type="text" className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all" value={newProjectForm.pekerjaan} onChange={e => setNewProjectForm({ ...newProjectForm, pekerjaan: e.target.value })} placeholder="Misal: Peningkatan Jalan Baru..." required />
                </div>
                <div>
                  <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-500">Fase Awal Proyek</label>
                  <select className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all" value={newProjectForm.status} onChange={e => setNewProjectForm({ ...newProjectForm, status: e.target.value })}>
                    <option value="Preparation">Tahap Persiapan</option>
                    <option value="Running">Tahap Pelaksanaan</option>
                  </select>
                </div>
                <button type="submit" disabled={isProcessing} className="w-full bg-blue-600 text-white py-4 rounded-2xl text-xs font-bold uppercase mt-4 hover:bg-blue-700 transition-colors shadow-md">
                  {isProcessing ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Buat Proyek Sekarang'}
                </button>
              </form>
            </div>
          </div>
         )}
         {deleteConfig && deleteConfig.type === 'project' && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[6000] p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative text-center">
              <div className="mx-auto w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-5"><AlertCircle size={28} /></div>
              <h3 className="text-xl font-black mb-2 text-slate-800">Hapus Proyek?</h3>
              <p className="text-xs text-rose-600 mb-8 font-medium leading-relaxed bg-rose-50 p-3 rounded-xl border border-rose-100">Kamar proyek <b>{deleteConfig.name}</b> dan seluruh data didalamnya akan dihapus permanen!</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfig(null)} className="flex-1 py-3.5 bg-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">Batal</button>
                <button onClick={confirmDeleteData} disabled={isProcessing} className="flex-1 py-3.5 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors shadow-md">{isProcessing ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Ya, Hapus'}</button>
              </div>
            </div>
          </div>
         )}
         {renderGlobalRekapModal()}
       </>
     );
  }

  if (appMode === 'absensi') {
     return (
       <>
         {notification && (
            <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[8000] px-6 py-4 rounded-2xl shadow-xl border backdrop-blur-xl animate-in slide-in-from-top-5 pointer-events-none flex items-center gap-3 ${notification.type === 'error' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
              <span className="text-xs font-bold uppercase tracking-tight">{String(notification.msg || '')}</span>
            </div>
         )}
         
         <AbsensiView 
            attendances={attendances} 
            onBack={() => setAppMode('selection')} 
            onDelete={handleDeleteAttendance} 
            isProcessing={isProcessing} 
            onRefresh={() => { fetchAttendances(); fetchEmployees(); }} 
            employees={employees}
            setEmployeeForm={setEmployeeForm}
            setShowEmployeeModal={setShowEmployeeModal}
            setDeleteConfig={setDeleteConfig}
         />

         {showEmployeeModal && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[9000] p-4">
               <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl relative">
                  <button onClick={() => setShowEmployeeModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 transition-colors"><X size={20} /></button>
                  <h3 className="text-lg font-black mb-6 uppercase text-slate-800 tracking-tight">{employeeForm.id ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}</h3>
                  <form onSubmit={handleSaveEmployee} className="space-y-4">
                     <div>
                        <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-500">ID Karyawan (Unik) <span className="text-rose-500">*</span></label>
                        <input type="text" className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all" value={employeeForm.employee_id} onChange={e => setEmployeeForm({ ...employeeForm, employee_id: e.target.value })} placeholder="Misal: KRY-001" required />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-500">Nama Lengkap <span className="text-rose-500">*</span></label>
                        <input type="text" className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all" value={employeeForm.name} onChange={e => setEmployeeForm({ ...employeeForm, name: e.target.value })} placeholder="Nama Lengkap Karyawan" required />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-500">Jabatan / Role <span className="text-rose-500">*</span></label>
                        <select className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all" value={employeeForm.role} onChange={e => setEmployeeForm({ ...employeeForm, role: e.target.value })} required>
                           <option value="Pelaksana">Pelaksana</option>
                           <option value="Pengawas">Pengawas</option>
                           <option value="Petugas K3">Petugas K3</option>
                           <option value="Mandor">Mandor</option>
                           <option value="Site Engineer">Site Engineer</option>
                           <option value="Inspector">Inspector</option>
                           <option value="Operator Alat">Operator Alat</option>
                           <option value="Kantor">Kantor</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-500">PIN / Password (Angka) <span className="text-rose-500">*</span></label>
                        <input type="text" inputMode="numeric" pattern="[0-9]*" className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono font-bold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all" value={employeeForm.pin} onChange={e => setEmployeeForm({ ...employeeForm, pin: e.target.value.replace(/\D/g, '') })} placeholder="Misal: 123456" required title="Hanya gunakan karakter Angka" />
                     </div>
                     <button type="submit" disabled={isProcessing} className="w-full bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4 hover:bg-blue-700 transition-colors shadow-md">
                        {isProcessing ? <Loader2 size={16} className="animate-spin mx-auto" /> : (employeeForm.id ? 'Simpan Perubahan' : 'Tambah Karyawan')}
                     </button>
                  </form>
               </div>
            </div>
         )}

         {deleteConfig && deleteConfig.type === 'employee' && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[9000] p-4">
              <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative text-center">
                <div className="mx-auto w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-5"><AlertCircle size={28} /></div>
                <h3 className="text-xl font-black mb-2 text-slate-800">Apakah Anda Yakin?</h3>
                <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed">
                   Data karyawan atas nama <b>{deleteConfig.name}</b> akan dihapus secara permanen.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteConfig(null)} className="flex-1 py-3.5 bg-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">Batal</button>
                  <button onClick={confirmDeleteData} disabled={isProcessing} className="flex-1 py-3.5 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors shadow-md">{isProcessing ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Ya, Hapus'}</button>
                </div>
              </div>
            </div>
         )}
       </>
     );
  }

  if (appMode === 'master') {
    return (
      <>
        {notification && (
          <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[6000] px-6 py-4 rounded-2xl shadow-xl border backdrop-blur-xl animate-in slide-in-from-top-5 flex items-center gap-3 ${notification.type === 'error' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
            <span className="text-xs font-bold uppercase tracking-tight">{String(notification.msg || '')}</span>
          </div>
        )}
        
        <MasterDashboardView 
            allProjects={masterProjects || []} 
            onSelectProject={handleSelectProject} 
            onAddProject={() => setShowNewProjectModal(true)} 
            onBackToSelection={handleBackToSelection}
            onViewRekap={() => setShowGlobalRekap(true)}
        />

        {showNewProjectModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[5000] p-4">
            <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setShowNewProjectModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 transition-colors"><X size={20} /></button>
              <h3 className="text-lg font-black mb-6">Buat Kamar Proyek Baru</h3>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-500">Nama Pekerjaan <span className="text-rose-500">*</span></label>
                  <input type="text" className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all" value={newProjectForm.pekerjaan} onChange={e => setNewProjectForm({ ...newProjectForm, pekerjaan: e.target.value })} placeholder="Misal: Peningkatan Jalan Baru..." required />
                </div>
                <div>
                  <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-500">Fase Awal Proyek</label>
                  <select className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all" value={newProjectForm.status} onChange={e => setNewProjectForm({ ...newProjectForm, status: e.target.value })}>
                    <option value="Preparation">Tahap Persiapan</option>
                    <option value="Running">Tahap Pelaksanaan</option>
                  </select>
                </div>
                <button type="submit" disabled={isProcessing} className="w-full bg-blue-600 text-white py-4 rounded-2xl text-xs font-bold uppercase mt-4 hover:bg-blue-700 transition-colors shadow-md">
                  {isProcessing ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Buat Proyek Sekarang'}
                </button>
              </form>
            </div>
          </div>
        )}
        {deleteConfig && deleteConfig.type === 'project' && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[6000] p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative text-center">
              <div className="mx-auto w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-5"><AlertCircle size={28} /></div>
              <h3 className="text-xl font-black mb-2 text-slate-800">Hapus Proyek?</h3>
              <p className="text-xs text-rose-600 mb-8 font-medium leading-relaxed bg-rose-50 p-3 rounded-xl border border-rose-100">Kamar proyek <b>{deleteConfig.name}</b> dan seluruh data didalamnya akan dihapus permanen!</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfig(null)} className="flex-1 py-3.5 bg-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">Batal</button>
                <button onClick={confirmDeleteData} disabled={isProcessing} className="flex-1 py-3.5 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors shadow-md">{isProcessing ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Ya, Hapus'}</button>
              </div>
            </div>
          </div>
        )}
        {renderGlobalRekapModal()}
      </>
    );
  }

  if (activeMenu === 'presentation') {
    return (
      <PresentationView 
        projectData={projectData} 
        processedSCurveData={processedSCurveData} 
        photos={photos} 
        actualProg={actualProg} 
        onExit={() => setActiveMenu('dashboard')} 
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f4f7fe] text-slate-800 overflow-hidden font-sans">

      {/* NOTIFIKASI */}
      {notification && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[8000] px-6 py-4 rounded-2xl shadow-xl border backdrop-blur-xl animate-in slide-in-from-top-5 pointer-events-none flex items-center gap-3 ${notification.type === 'error' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
          <span className="text-xs font-bold uppercase tracking-tight">{String(notification.msg || '')}</span>
        </div>
      )}

      <aside className={`hidden md:flex border-r border-slate-200 flex-col bg-white shrink-0 shadow-sm relative z-[100] pointer-events-auto transition-all duration-300 ${isSidebarOpen ? 'w-56' : 'w-[88px]'}`}>
        
        {/* TOMBOL TOGGLE SIDEBAR PADA GARIS PEMBATAS */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3.5 top-[152px] p-1 bg-white border border-slate-200 rounded-full shadow-sm text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:scale-110 transition-all z-[200] cursor-pointer"
          title={isSidebarOpen ? "Perkecil Menu" : "Perbesar Menu"}
        >
          {isSidebarOpen ? <ChevronLeft size={16} strokeWidth={2.5} /> : <ChevronRight size={16} strokeWidth={2.5} />}
        </button>

        <div className={`flex flex-col h-full ${isSidebarOpen ? 'p-5' : 'p-4 items-center'}`}>
          {/* LOGO DI ATAS */}
          <div className={`flex items-center ${isSidebarOpen ? 'gap-2.5 px-1 mb-8' : 'justify-center mb-8'} transition-all`}>
            <Activity size={24} className="text-blue-600 shrink-0" />
            {isSidebarOpen && <h1 className="text-lg font-black tracking-tight text-slate-800 animate-in fade-in duration-300">Dashboard</h1>}
          </div>

          {/* TOMBOL KEMBALI */}
          <button type="button" onClick={handleBackFromProject} className={`flex items-center ${isSidebarOpen ? 'gap-2 px-4 justify-start' : 'justify-center px-0'} mb-6 text-[10px] uppercase tracking-widest font-black text-slate-500 hover:text-blue-600 transition-colors bg-white hover:bg-slate-50 py-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer relative z-50 pointer-events-auto w-full`} title={previousAppMode === 'master' ? 'Kembali ke Peta' : 'Ke Menu Utama'}>
            <ArrowLeft size={16} className="shrink-0" />
            {isSidebarOpen && <span className="truncate">{previousAppMode === 'master' ? 'Kembali ke Peta' : 'Ke Menu Utama'}</span>}
          </button>

          <nav className="space-y-1.5 w-full">
            <button onClick={() => setActiveMenu('dashboard')} className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-3.5 justify-start' : 'justify-center'} py-3.5 rounded-xl text-xs font-bold transition-all ${activeMenu === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`} title="Overview"><LayoutDashboard size={18} className="shrink-0" /> {isSidebarOpen && <span className="truncate">Overview</span>}</button>
            <button onClick={() => setActiveMenu('map')} className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-3.5 justify-start' : 'justify-center'} py-3.5 rounded-xl text-xs font-bold transition-all ${activeMenu === 'map' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`} title="Geo-Map"><MapIcon size={18} className="shrink-0" /> {isSidebarOpen && <span className="truncate">Geo-Map</span>}</button>
            <button onClick={() => setActiveMenu('schedule')} className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-3.5 justify-start' : 'justify-center'} py-3.5 rounded-xl text-xs font-bold transition-all ${activeMenu === 'schedule' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`} title="Jadwal"><CalendarDays size={18} className="shrink-0" /> {isSidebarOpen && <span className="truncate">Jadwal</span>}</button>
            <button onClick={() => setActiveMenu('contract')} className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-3.5 justify-start' : 'justify-center'} py-3.5 rounded-xl text-xs font-bold transition-all ${activeMenu === 'contract' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`} title="Data Kontrak"><Briefcase size={18} className="shrink-0" /> {isSidebarOpen && <span className="truncate">Data Kontrak</span>}</button>
            <button onClick={() => setActiveMenu('dokumentasi')} className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-3.5 justify-start' : 'justify-center'} py-3.5 rounded-xl text-xs font-bold transition-all ${activeMenu === 'dokumentasi' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`} title="Dokumentasi"><ImageIcon size={18} className="shrink-0" /> {isSidebarOpen && <span className="truncate">Dokumentasi</span>}</button>
            <button onClick={() => setActiveMenu('3d-twin')} className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-3.5 justify-start' : 'justify-center'} py-3.5 rounded-xl text-xs font-bold transition-all ${activeMenu === '3d-twin' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`} title="3D Digital Twin"><Globe2 size={18} className="shrink-0" /> {isSidebarOpen && <span className="truncate">3D Digital Twin</span>}</button>
            <button onClick={() => setActiveMenu('admin')} className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-3.5 justify-start' : 'justify-center'} py-3.5 rounded-xl text-xs font-bold transition-all ${activeMenu === 'admin' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`} title="Arsip Dokumen"><FolderEdit size={18} className="shrink-0" /> {isSidebarOpen && <span className="truncate">Arsip Dokumen</span>}</button>
            <button onClick={() => setActiveMenu('rab')} className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-3.5 justify-start' : 'justify-center'} py-3.5 rounded-xl text-xs font-bold transition-all ${activeMenu === 'rab' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`} title="RAB / BOQ"><Calculator size={18} className="shrink-0" /> {isSidebarOpen && <span className="truncate">RAB / BOQ</span>}</button>
            <button onClick={() => setActiveMenu('presentation')} className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-3.5 justify-start' : 'justify-center'} py-3.5 rounded-xl text-xs font-bold transition-all ${activeMenu === 'presentation' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`} title="Presentasi"><MonitorPlay size={18} className="shrink-0" /> {isSidebarOpen && <span className="truncate">Presentasi</span>}</button>
          </nav>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 flex justify-around items-center p-2 z-[200] pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
        <button onClick={() => setActiveMenu('dashboard')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeMenu === 'dashboard' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}><LayoutDashboard size={20} /><span className="text-[8px] font-black uppercase tracking-widest">Overview</span></button>
        <button onClick={() => setActiveMenu('map')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeMenu === 'map' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}><MapIcon size={20} /><span className="text-[8px] font-black uppercase tracking-widest">Peta</span></button>
        <button onClick={() => setActiveMenu('3d-twin')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeMenu === '3d-twin' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}><Globe2 size={20} /><span className="text-[8px] font-black uppercase tracking-widest">3D BIM</span></button>
        <button onClick={() => setActiveMenu('dokumentasi')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeMenu === 'dokumentasi' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}><ImageIcon size={20} /><span className="text-[8px] font-black uppercase tracking-widest">Galeri</span></button>
        <button onClick={() => setActiveMenu('admin')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeMenu === 'admin' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}><FolderEdit size={20} /><span className="text-[8px] font-black uppercase tracking-widest">Arsip</span></button>
      </nav>

      <main className="flex-1 overflow-hidden flex flex-col relative bg-[#f4f7fe] pb-20 md:pb-0 h-full">
        {activeMenu === 'dashboard' && (
          <div className="h-full flex flex-col">

            <header className="px-4 py-3 md:px-6 md:py-4 flex flex-col gap-3 border-b border-slate-200 bg-white/50 backdrop-blur-md relative z-[100] shadow-sm shrink-0 pointer-events-auto">
              
              {/* BARIS 1: KEMBALI, JUDUL & TOMBOL AKSI */}
              <div className="flex justify-between items-center gap-2 md:gap-3 w-full">
                
                {/* TOMBOL KEMBALI MOBILE */}
                <div className="md:hidden shrink-0">
                  <button type="button" onClick={handleBackFromProject} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer block relative z-[99999] pointer-events-auto" title="Kembali ke Menu Utama">
                    <ArrowLeft size={18} />
                  </button>
                </div>
                
                {/* JUDUL PEKERJAAN (Akan mengalah dan truncate jika sempit) */}
                <div className="min-w-0 flex-1 pr-2">
                  <h2 className="text-[11px] md:text-xs lg:text-sm font-normal uppercase tracking-tight text-slate-800 leading-snug truncate w-full pointer-events-auto" title={String(projectData?.pekerjaan || 'JUDUL PEKERJAAN KONTRAK')}>
                    {String(projectData?.pekerjaan || 'JUDUL PEKERJAAN KONTRAK')}
                  </h2>
                </div>

                {/* AKSI KANAN: Bell, Settings, Main Action (Dipindah ke baris atas) */}
                <div className="flex items-center gap-1.5 md:gap-2 shrink-0 relative z-[99999]">
                  <button type="button" onClick={() => setReadFeeds(new Set(safeFeeds.map(f => f.id)))} className="relative z-50 p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white hover:bg-blue-50 rounded-xl shadow-sm border border-slate-200 cursor-pointer pointer-events-auto" title="Tandai semua log sudah dibaca">
                    <Bell size={16} />
                    {safeFeeds.filter(f => !readFeeds.has(f.id)).length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-rose-500 text-white text-[8px] font-black border border-white shadow-sm animate-pulse pointer-events-none">
                        {safeFeeds.filter(f => !readFeeds.has(f.id)).length > 99 ? '99+' : safeFeeds.filter(f => !readFeeds.has(f.id)).length}
                      </span>
                    )}
                  </button>

                  <button type="button" onClick={() => setShowEditProjectModal(true)} className="relative z-50 p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white hover:bg-blue-50 rounded-xl shadow-sm border border-slate-200 cursor-pointer pointer-events-auto" title="Pengaturan Proyek"><Settings size={16} /></button>

                  {/* TOMBOL UPDATE RUTE */}
                  <button type="button" onClick={() => setShowAppendRouteModal(true)} className="bg-emerald-600 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-[10px] font-bold uppercase flex items-center justify-center gap-1.5 md:gap-2 hover:bg-emerald-700 transition-colors shadow-md cursor-pointer relative z-50 pointer-events-auto" title="Tambah Progress Rute Realisasi">
                    <MapPin size={14} className="md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Update Rute</span>
                    <span className="sm:hidden">Rute</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenReportModal()}
                    className="bg-blue-600 text-white px-3 py-2 md:px-5 md:py-2.5 rounded-xl text-[10px] font-bold uppercase flex items-center justify-center gap-1.5 md:gap-2 hover:bg-blue-700 transition-colors shadow-md cursor-pointer relative z-50 pointer-events-auto"
                  >
                    <Camera size={14} className="md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Lapor Lapangan</span>
                    <span className="sm:hidden">Lapor</span>
                  </button>
                </div>
              </div>

              {/* BARIS 2: INFO TEKNIS */}
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3 w-full">
                
                {/* INFO TEKNIS */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                     <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <Ruler size={14} className="text-blue-500" /> Panjang: <span className="text-slate-800 font-black">{projectData?.panjang_rencana ? `${projectData.panjang_rencana} m` : '-'}</span>
                     </div>
                     <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <Ruler size={14} className="rotate-90 text-amber-500" /> Lebar: <span className="text-slate-800 font-black">{projectData?.lebar_rencana ? `${projectData.lebar_rencana} m` : '-'}</span>
                     </div>
                     <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <HardHat size={14} className="text-emerald-500 shrink-0" /> <span className="shrink-0">Saluran:</span> <span className="text-slate-800 font-black truncate max-w-[120px]" title={projectData?.jenis_model || '-'}>{projectData?.jenis_model || '-'}</span>
                     </div>
                  </div>
                </div>
              </div>

            </header>

            <div className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto no-scrollbar relative z-10">

              <div className="animate-in fade-in zoom-in-95 duration-500 w-full flex flex-col pb-10">

                {/* MAIN GRID LAYOUT - RESTRUCTURED UNTUK SEJAJAR */}
                <div className="flex flex-col gap-6 mb-8">

                  {/* BARIS 1: STATISTIK & LOG AKTIVITAS */}
                  <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-6 lg:h-[300px]">
                      
                      {/* STATISTIK (KIRI 8 KOLOM) */}
                      <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 lg:h-full">
                        <CircularStatCard label="Progress Fisik" icon={Activity} percentage={actualProg !== null ? actualProg : (projectData?.actual_progress || 0)} trend={true} isPositive={isDeviasiPositive} dropShadowColor="emerald" subContent={<div className="flex flex-col items-center mt-1"><span className="text-[12px] md:text-sm font-bold uppercase tracking-wider text-slate-800">{String(lastUpdatedWeek).replace('M', 'Minggu Ke-').replace('W', 'Minggu Ke-')}</span><div className="text-[10px] font-medium flex items-center gap-1.5 mt-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"><span className="text-slate-400 uppercase tracking-wider">Deviasi:</span><span className={isDeviasiPositive ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>{isDeviasiPositive ? '+' : ''}{deviasi}%</span></div></div>} />
                        <CircularStatCard label="TAGIHAN" icon={Banknote} percentage={terminPct ? parseFloat(terminPct) : 0} dropShadowColor="blue" subContent={<div className="flex flex-col items-center mt-1"><span className="text-[12px] md:text-sm font-bold uppercase tracking-wider text-slate-800">Termin {toRoman(String(terminNum))}</span><span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">{projectData?.updated_at ? `TGL: ${new Date(projectData.updated_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}` : (projectData?.created_at ? `TGL: ${new Date(projectData.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}` : 'Belum diupdate')}</span></div>} />
                        <StatCard icon={Clock} label="Sisa Waktu" value={sisaWaktuInfo.value} sub={sisaWaktuInfo.sub} status={sisaWaktuInfo.status} />
                      </div>

                      {/* LOG AKTIVITAS (KANAN 4 KOLOM) */}
                      <div className="lg:col-span-4 flex flex-col h-[380px] lg:h-full min-h-0">
                        <div className="bg-white rounded-[24px] p-4 md:p-5 border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
                          <h3 className="text-[10px] font-bold text-slate-500 mb-2 tracking-wider uppercase flex justify-between items-center shrink-0">Log Aktivitas <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" /></h3>
                          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col divide-y divide-slate-100 min-h-0">
                            {persiapanSidebarFeeds.length > 0 ? (
                              persiapanSidebarFeeds.slice(0, 10).map(f => <FeedItem key={f.id} item={f} onView={handleViewLog} onDelete={() => setDeleteConfig({ id: f.id, type: 'media' })} isUnread={!readFeeds.has(f.id)} />)
                            ) : (
                              <div className="text-center text-slate-400 text-xs font-bold py-10 opacity-50 m-auto">Belum ada aktivitas</div>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* BARIS 2: KURVA S & ITEM PEKERJAAN */}
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:h-[550px]">
                      
                      {/* KURVA S (KIRI 7 KOLOM) */}
                      <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col h-[450px] lg:h-full min-h-0 overflow-hidden">
                        <div className="flex justify-between items-center mb-6 shrink-0"><h3 className="text-lg font-bold text-slate-800">Kurva S Pekerjaan</h3><button onClick={() => setShowEditProjectModal(true)} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-2"><TrendingUp size={14} /> Input Kurva</button></div>
                        <div className="flex-1 w-full -ml-4 min-h-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={processedSCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                              <defs>
                                <linearGradient id="colorRencanaDash" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorRealisasiDash" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                              <XAxis dataKey="n" stroke="#475569" fontSize={12} fontWeight="normal" axisLine={false} tickLine={false} />
                              <YAxis domain={[0, 100]} stroke="#475569" fontSize={12} fontWeight="normal" axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                              <Tooltip content={(props) => <SChartTooltip {...props} />} />
                              <Legend verticalAlign="bottom" align="center" content={(p) => (
                                <div className="flex flex-col items-center pt-6">
                                  <div className="flex gap-6 mb-2">{(p.payload || []).map((entry, index) => (<div key={index} className="flex items-center gap-2"><span className="block w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span><span className="text-xs uppercase font-bold text-slate-700">{safeRender(entry.value)}</span></div>))}</div>
                                  <p className="text-xs text-slate-500 mt-2 font-normal uppercase">Update terakhir: {projectData?.updated_at ? new Date(projectData.updated_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                                </div>
                              )} />
                              <Area type="monotone" dataKey="r" stroke="#06b6d4" strokeWidth={2} fill="url(#colorRencanaDash)" name="Rencana (M=Mingguan)" dot={{ r: 3, strokeWidth: 2, fill: '#ffffff' }} />
                              <Area type="monotone" dataKey="a" stroke="#3b82f6" strokeWidth={3} fill="url(#colorRealisasiDash)" name="Progres Fisik (M=Mingguan)" dot={{ r: 3.5, strokeWidth: 2, fill: '#ffffff' }} />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* ITEM PEKERJAAN (KANAN 5 KOLOM) */}
                      <div className="lg:col-span-5 bg-white/80 backdrop-blur-xl p-5 md:p-6 lg:p-8 rounded-[32px] border border-slate-200/60 shadow-lg text-left flex flex-col relative group overflow-hidden h-[450px] lg:h-full">
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-10 transition-opacity duration-700 group-hover:opacity-20 -mr-20 -mt-20 pointer-events-none bg-blue-500"></div>
                        <div className="flex justify-between items-center mb-5 border-b border-slate-200/60 pb-4 shrink-0 relative z-10">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50/80 text-blue-600 rounded-xl shadow-sm border border-blue-100/50"><Ruler size={16} strokeWidth={2.5} /></div>
                            <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Progress Item Pekerjaan</h3>
                          </div>
                        </div>

                        <div className="relative z-10 flex-1 overflow-hidden flex flex-col">
                          {(!projectData?.item_utama_data || projectData.item_utama_data.length === 0) ? (
                            <div className="text-center py-10 bg-slate-50/30 rounded-2xl border border-dashed border-slate-200 m-auto w-full">
                              <Ruler size={24} className="mx-auto text-slate-300 mb-2" />
                              <p className="text-xs font-bold text-slate-400">Belum ada item utama yang diatur.</p>
                            </div>
                          ) : (
                            <div className="overflow-y-auto custom-scrollbar w-full flex-1 pr-1">
                              <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-white/40 backdrop-blur-md z-20">
                                  <tr className="border-b border-slate-200/60">
                                    <th className="pb-3 pr-2 text-xs font-black text-slate-500 uppercase tracking-widest w-full">Item Pekerjaan</th>
                                    <th className="pb-3 px-2 text-xs font-black text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">Hari Ini</th>
                                    <th className="pb-3 px-2 text-xs font-black text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">Total</th>
                                    <th className="pb-3 px-2 text-xs font-black text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">Sat.</th>
                                    <th className="pb-3 pl-2 text-xs font-black text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">Progress</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/50">
                                  {projectData.item_utama_data.map((item, idx) => (
                                    <tr key={item.id || idx} className="hover:bg-blue-50/40 transition-colors group border-b border-slate-50 last:border-0">
                                      <td className="py-4 pr-2">
                                        <span className="text-sm font-normal text-slate-800 leading-tight block truncate uppercase" title={item.nama}>
                                          {item.nama}
                                        </span>
                                      </td>
                                      <td className="py-4 px-2 text-right text-sm font-normal text-slate-600">
                                        {item.bobot || '-'}
                                      </td>
                                      <td className="py-4 px-2 text-right text-sm font-normal text-slate-600">
                                        {item.nilai || '-'}
                                      </td>
                                      <td className="py-4 px-2 text-right text-sm font-normal text-slate-600 uppercase">
                                        {item.satuan || '-'}
                                      </td>
                                      <td className="py-4 pl-2 text-right">
                                        <span className="text-base font-black text-blue-600 drop-shadow-sm">{item.persen}%</span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* BARIS 3: LAPORAN & DOKUMENTASI */}
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:h-[360px]">
                      
                      {/* LAPORAN (KIRI 5 KOLOM) */}
                      <div
                        className={`lg:col-span-5 bg-white p-5 md:p-6 rounded-[32px] border flex flex-col h-[350px] lg:h-full relative transition-all duration-300 min-h-0 overflow-hidden ${isDraggingReport ? 'border-rose-400 shadow-xl scale-[1.02] bg-rose-50/30' : 'border-slate-100 shadow-sm'}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDraggingReport(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setIsDraggingReport(false); }}
                        onDrop={handleDropReportUpload}
                      >
                        {isDraggingReport && (
                          <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm rounded-[32px] flex flex-col items-center justify-center border-2 border-dashed border-rose-400 m-2 pointer-events-none">
                            <div className="bg-rose-100 p-4 rounded-full shadow-sm text-rose-600 mb-3 animate-bounce"><FileText size={32} /></div>
                            <h3 className="text-sm font-black text-slate-800">Lepaskan file PDF di sini</h3>
                          </div>
                        )}
                        <div className="flex justify-between items-center mb-5 shrink-0 border-b border-slate-100 pb-4">
                          <h3 className="text-[11px] font-black text-slate-800 uppercase flex items-center gap-2 tracking-wider"><FileText size={16} className="text-rose-500" /> Laporan</h3>
                          <button onClick={() => reportFileInputRef.current?.click()} className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase flex items-center gap-1.5 hover:bg-rose-100 transition-colors shadow-sm">
                            {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />} <span className="hidden xl:inline">Upload</span>
                          </button>
                          <input type="file" accept=".pdf" className="hidden" ref={reportFileInputRef} onChange={handleDirectReportUpload} />
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col min-h-0">
                          {weeklyReports.length > 0 ? (
                            <div className="flex-1 flex flex-col gap-4 pb-2">
                              {weeklyReports.slice(0, 1).map(doc => (
                                <div key={doc.id} onClick={() => window.open(doc.file_url, '_blank')} className="group border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer bg-white relative flex flex-col flex-1 min-h-[220px]">
                                  <div className="absolute inset-0 bg-slate-100 flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-full group-hover:scale-105 transition-transform duration-700">
                                      <PdfThumbnailReal fileUrl={doc.file_url} />
                                    </div>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); setDeleteConfig({ id: doc.id, type: 'doc' }); }} className="absolute top-3 right-3 p-2 bg-white/90 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-rose-50 shadow-md backdrop-blur-sm"><Trash size={14} /></button>
                                  <div className="absolute inset-x-0 bottom-0 pt-24 pb-4 px-5 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent flex flex-col justify-end z-10 pointer-events-none">
                                    <div className="flex justify-between items-end gap-3">
                                      <div className="flex flex-col">
                                        <h4 className="text-[11px] font-bold text-white line-clamp-2 leading-snug mb-1 break-all group-hover:text-blue-300 transition-colors" title={doc.name}>{String(doc.name || '')}</h4>
                                        <p className="text-[9px] font-medium text-slate-300">{new Date(doc.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                      </div>
                                      <div className="bg-rose-500/90 backdrop-blur-sm border border-rose-400 text-white text-[8px] font-black tracking-widest px-2 py-1.5 rounded-lg shadow-sm shrink-0 uppercase">PDF</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div
                              onClick={() => reportFileInputRef.current?.click()}
                              className="flex flex-col items-center justify-center flex-1 h-full text-center border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-rose-50/50 hover:border-rose-300 transition-all group m-1"
                            >
                              <div className="p-4 bg-rose-50 text-rose-500 rounded-full mb-3 group-hover:scale-110 group-hover:bg-rose-100 transition-all shadow-sm">
                                <Upload size={28} />
                              </div>
                              <p className="text-xs font-black text-slate-700 mb-1 uppercase tracking-widest">Upload Laporan</p>
                              <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed text-slate-400">Tarik & Lepas File PDF<br />atau Klik di Sini</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* DOKUMENTASI LAPANGAN (KANAN 7 KOLOM) */}
                      <div className="lg:col-span-7 bg-white p-5 md:p-6 lg:p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col text-left h-[350px] lg:h-full relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[50px] opacity-10 transition-opacity duration-700 group-hover:opacity-30 -mr-10 -mt-10 pointer-events-none bg-blue-500"></div>
                        <div className="flex justify-between items-center w-full mb-5 border-b border-slate-100 pb-4 relative z-10 shrink-0">
                          <span className="text-slate-800 text-[11px] uppercase font-black tracking-wider leading-tight flex items-center gap-2"><ImageIcon size={16} className="text-blue-500" /> Dokumentasi Lapangan</span>
                          <button onClick={() => setActiveMenu('dokumentasi')} className="px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-transform duration-500 shadow-sm bg-blue-50 text-blue-600 border border-blue-100/80 hover:bg-blue-100 cursor-pointer pointer-events-auto" title="Lihat Galeri">
                            Lihat Semua
                          </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 relative z-10 flex flex-col gap-4">
                          {photos.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {photos.slice(0, 3).map((item, idx) => (
                                <div key={item.display_id || item.id || idx} className="w-full flex flex-col gap-2 group/item cursor-pointer" onClick={() => setSelectedLog(item)}>
                                  <div className="h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative shrink-0">
                                    {isVideo(item.media_url) ? (
                                      <video src={item.media_url} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500" />
                                    ) : (
                                      <img src={item.media_url} alt={item.title} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500" />
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors duration-300 rounded-2xl" />
                                    {item.is_problem && (
                                      <div className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-lg shadow-md"><AlertCircle size={12} /></div>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="text-[10px] font-bold text-slate-800 line-clamp-1 group-hover/item:text-blue-600 transition-colors">{String(item.title || '')}</h4>
                                    <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex-1 flex flex-col justify-center w-full">
                              <ImageIcon size={32} className="mx-auto text-slate-300 mb-3" />
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Belum ada foto dokumentasi</p>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
            </div>
          </div>
        )}

        {activeMenu === 'dokumentasi' && (<DokumentasiView feeds={safeFeeds} onView={setSelectedLog} onDelete={setDeleteConfig} />)}
        {activeMenu === 'map' && (<div className="h-full p-4 md:p-8"><SiteMapView projectData={projectData} feeds={safeFeeds} onUpdateRoutes={handleRoutesUpdate} isUpdating={isProcessing} showMsg={showMsg} /></div>)}
        {activeMenu === '3d-twin' && (<TwinViewer />)}
        {activeMenu === 'schedule' && (<GanttChartView projectData={projectData} onSaveSchedule={handleSaveSchedule} isProcessing={isProcessing} />)}
        {activeMenu === 'rab' && (<RABView />)}

        {activeMenu === 'contract' && (
          <div className="h-full flex flex-col overflow-hidden">
            <div className="px-6 py-6 md:px-10 flex justify-between items-center border-b border-slate-200 bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-4"><div className="p-3 bg-white shadow-sm border border-slate-100 rounded-2xl hidden sm:block"><Briefcase className="text-blue-500" /></div><div><h3 className="text-xl font-bold">DATA KONTRAK (DATA INFORMASI)</h3><p className="text-[10px] text-slate-500 uppercase mt-1">Detail Informasi</p></div></div>
              {!isEditingContract ? (<button onClick={() => setIsEditingContract(true)} className="bg-white px-6 py-3 rounded-2xl text-xs font-bold uppercase shadow-sm border border-slate-200 flex gap-2"><Edit3 size={16} className="text-blue-500" /> EDIT DATA</button>) : (<div className="flex gap-3"><button onClick={() => setIsEditingContract(false)} className="bg-white px-6 py-3 rounded-2xl text-xs font-bold uppercase border border-slate-200">BATAL</button><button onClick={handleUpdateStakeholder} className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase shadow-md flex gap-2"><Save size={16} /> SIMPAN</button></div>)}
            </div>
            <div className="p-6 md:p-10 flex-1 overflow-y-auto custom-scrollbar">
              {!isEditingContract ? (
                <div className="flex flex-col gap-12 w-full mx-auto">
                  <ContractTable title="OWNER ( PERANGKAT DAERAH )" icon={<Building2 size={16} />} dataArray={dinasData} colorClass="text-blue-600" bgClass="bg-blue-100" />
                  <ContractTable title="DATA INFORMASI KONTRAKTOR / PELAKSANA" icon={<HardHat size={16} />} dataArray={kontraktorData} colorClass="text-amber-600" bgClass="bg-amber-100" />
                  <ContractTable title="DATA INFORMASI KONSULTAN SUPERVISI/PENGAWAS" icon={<ShieldCheck size={16} />} dataArray={konsultanData} colorClass="text-emerald-600" bgClass="bg-emerald-100" />
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10 w-full mx-auto space-y-12">

                  <div className="space-y-4">
                    <div className="mb-2 border-b border-slate-200 pb-4">
                      <h3 className="text-base font-black uppercase text-blue-600">1. INPUT DATA OWNER (DINAS)</h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <div className="hidden sm:flex bg-slate-200 border-b border-slate-300 py-3.5 px-6 justify-between items-center">
                        <div className="text-xs font-black uppercase tracking-wider text-slate-800">Daftar Perangkat Daerah</div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setMasterForm({ ...masterForm, dinas: [...masterForm.dinas, { type: 'keterangan', role: 'Instansi', name: '', nip: '' }] })} className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-50"><Plus size={12} /> Keterangan</button>
                          <button type="button" onClick={() => setMasterForm({ ...masterForm, dinas: [...masterForm.dinas, { type: 'personil', role: '', name: '', nip: '' }] })} className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 shadow-sm px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-100"><Plus size={12} /> Personil</button>
                        </div>
                      </div>
                      <div className="p-4 sm:p-6 space-y-3">
                        {(masterForm.dinas || []).map((d, i) => {
                          const isPersonil = d.type === 'personil' || (d.type === undefined && String(d.role || '').toLowerCase() !== 'instansi' && String(d.role || '').toLowerCase() !== '');
                          return (
                            <div key={i} className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl group items-start">
                              <div className="w-full md:w-1/3">
                                {isPersonil ? (
                                  <input type="text" placeholder="Nama Lengkap" className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-bold bg-white focus:outline-blue-400" value={d.name} onChange={e => { const newD = [...masterForm.dinas]; newD[i].name = e.target.value; setMasterForm({ ...masterForm, dinas: newD }); }} />
                                ) : (
                                  <input type="text" placeholder="Label (Misal: Instansi)" className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-bold bg-white focus:outline-blue-400" value={d.role} onChange={e => { const newD = [...masterForm.dinas]; newD[i].role = e.target.value; setMasterForm({ ...masterForm, dinas: newD }); }} />
                                )}
                              </div>
                              <div className="flex-1 w-full flex flex-col gap-2">
                                {isPersonil ? (
                                  <>
                                    <input type="text" placeholder="Jabatan (Tampil di Kiri Tabel)" className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-bold bg-white focus:outline-blue-400" value={d.role} onChange={e => { const newD = [...masterForm.dinas]; newD[i].role = e.target.value; setMasterForm({ ...masterForm, dinas: newD }); }} />
                                    <input type="text" placeholder="NIP (Opsional)" className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-bold bg-white focus:outline-blue-400" value={d.nip || ''} onChange={e => { const newD = [...masterForm.dinas]; newD[i].nip = e.target.value; setMasterForm({ ...masterForm, dinas: newD }); }} />
                                  </>
                                ) : (
                                  <>
                                    <input type="text" placeholder="Nama Instansi/Perangkat Daerah" className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-bold bg-white focus:outline-blue-400" value={d.name} onChange={e => { const newD = [...masterForm.dinas]; newD[i].name = e.target.value; setMasterForm({ ...masterForm, dinas: newD }); }} />
                                  </>
                                )}
                              </div>
                              {masterForm.dinas.length > 1 && (
                                <button type="button" onClick={() => { const newD = [...masterForm.dinas]; newD.splice(i, 1); setMasterForm({ ...masterForm, dinas: newD }); }} className="p-2.5 text-rose-400 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors shrink-0"><Trash size={16} /></button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="mb-2 border-b border-slate-200 pb-4">
                      <h3 className="text-base font-black uppercase text-amber-600">2. INPUT DATA KONTRAKTOR / PELAKSANA</h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <div className="hidden sm:flex bg-slate-200 border-b border-slate-300 py-3.5 px-6">
                        <div className="w-1/3 text-xs font-black uppercase tracking-wider text-slate-800">Informasi / Entitas</div>
                        <div className="w-2/3 text-xs font-black uppercase tracking-wider text-slate-800 pl-4 border-l border-slate-300/60">Form Input & Keterangan</div>
                      </div>
                      <div className="flex flex-col">
                        {masterForm.kontraktor.fields.map((f, i) => (
                          <div key={f.id} className="flex flex-col sm:flex-row py-3 px-6 border-b border-slate-100 last:border-0 bg-white hover:bg-slate-50/50 transition-colors gap-3 sm:gap-4 items-start sm:items-center">
                            <div className="w-full sm:w-1/3 flex gap-2">
                              <select className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[10px] font-bold outline-none focus:border-blue-400 shrink-0" value={f.type} onChange={e => {
                                const newF = [...masterForm.kontraktor.fields];
                                newF[i].type = e.target.value;
                                if (e.target.value === 'date') newF[i].value = '';
                                setMasterForm({ ...masterForm, kontraktor: { ...masterForm.kontraktor, fields: newF } });
                              }}>
                                <option value="text">Teks</option>
                                <option value="date">Tanggal</option>
                              </select>
                              <input type="text" placeholder="Nama Field" className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-600 outline-none focus:border-blue-400" value={f.label} onChange={e => {
                                const newF = [...masterForm.kontraktor.fields];
                                newF[i].label = e.target.value;
                                setMasterForm({ ...masterForm, kontraktor: { ...masterForm.kontraktor, fields: newF } });
                              }} />
                            </div>
                            <div className="w-full sm:w-2/3 flex gap-2 items-center">
                              {f.type === 'date' ? (
                                <input type="date" className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-400 focus:outline-none transition-all" value={f.value} onChange={e => {
                                  const newF = [...masterForm.kontraktor.fields];
                                  newF[i].value = e.target.value;
                                  setMasterForm({ ...masterForm, kontraktor: { ...masterForm.kontraktor, fields: newF } });
                                }} />
                              ) : (
                                <AutoResizeTextarea value={f.value} onChange={e => {
                                  const newF = [...masterForm.kontraktor.fields];
                                  newF[i].value = e.target.value;
                                  setMasterForm({ ...masterForm, kontraktor: { ...masterForm.kontraktor, fields: newF } });
                                }} placeholder="Isi detail keterangan..." className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-400 focus:outline-none transition-all leading-relaxed" />
                              )}
                              <div className="flex gap-1 shrink-0">
                                <button type="button" onClick={() => {
                                  const newF = [...masterForm.kontraktor.fields];
                                  if (i > 0) { const temp = newF[i]; newF[i] = newF[i-1]; newF[i-1] = temp; setMasterForm({ ...masterForm, kontraktor: { ...masterForm.kontraktor, fields: newF } }); }
                                }} disabled={i === 0} className="p-2 text-slate-400 bg-slate-100 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-30" title="Geser ke Atas"><ArrowUp size={14} /></button>
                                <button type="button" onClick={() => {
                                  const newF = [...masterForm.kontraktor.fields];
                                  if (i < newF.length - 1) { const temp = newF[i]; newF[i] = newF[i+1]; newF[i+1] = temp; setMasterForm({ ...masterForm, kontraktor: { ...masterForm.kontraktor, fields: newF } }); }
                                }} disabled={i === masterForm.kontraktor.fields.length - 1} className="p-2 text-slate-400 bg-slate-100 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-30" title="Geser ke Bawah"><ArrowDown size={14} /></button>
                                <button type="button" onClick={() => {
                                  const newF = [...masterForm.kontraktor.fields];
                                  newF.splice(i, 1);
                                  setMasterForm({ ...masterForm, kontraktor: { ...masterForm.kontraktor, fields: newF } });
                                }} className="p-2 text-rose-400 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors ml-1" title="Hapus Field"><Trash size={14} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 sm:px-6 bg-[#f8fafc] border-t border-slate-200 flex justify-end">
                        <button type="button" onClick={() => {
                          setMasterForm({ ...masterForm, kontraktor: { ...masterForm.kontraktor, fields: [...masterForm.kontraktor.fields, { id: Date.now(), label: 'Field Baru', value: '', type: 'text' }] } });
                        }} className="text-[10px] font-bold text-blue-600 bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-50 w-max"><Plus size={12} /> Tambah Field</button>
                      </div>
                      <div className="p-4 sm:p-6 bg-[#f8fafc] border-t border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xs font-bold uppercase text-slate-600">Personil Kontraktor</h4>
                          <button type="button" onClick={() => setMasterForm({ ...masterForm, kontraktor: { ...masterForm.kontraktor, personil: [...(masterForm.kontraktor.personil || []), { name: '', position: '' }] } })} className="text-[10px] font-bold bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-50"><Plus size={12} />Tambah Personil</button>
                        </div>
                        {(masterForm.kontraktor.personil || []).map((p, i) => (
                          <div key={i} className="flex flex-col md:flex-row gap-2 mb-2 items-center">
                            <input type="text" placeholder="Nama Lengkap" className="flex-1 w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-blue-400" value={p.name} onChange={e => { const newP = [...masterForm.kontraktor.personil]; newP[i].name = e.target.value; setMasterForm({ ...masterForm, kontraktor: { ...masterForm.kontraktor, personil: newP } }); }} />
                            <input type="text" placeholder="Jabatan" className="w-full md:w-1/3 p-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-blue-400" value={p.position} onChange={e => { const newP = [...masterForm.kontraktor.personil]; newP[i].position = e.target.value; setMasterForm({ ...masterForm, kontraktor: { ...masterForm.kontraktor, personil: newP } }); }} />
                            <button type="button" onClick={() => { const newP = [...masterForm.kontraktor.personil]; newP.splice(i, 1); setMasterForm({ ...masterForm, kontraktor: { ...masterForm.kontraktor, personil: newP } }); }} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors w-full md:w-auto flex justify-center"><Trash size={16} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="mb-2 border-b border-slate-200 pb-4">
                      <h3 className="text-base font-black uppercase text-emerald-600">3. INPUT DATA KONSULTAN SUPERVISI</h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <div className="hidden sm:flex bg-slate-200 border-b border-slate-300 py-3.5 px-6">
                        <div className="w-1/3 text-xs font-black uppercase tracking-wider text-slate-800">Informasi / Entitas</div>
                        <div className="w-2/3 text-xs font-black uppercase tracking-wider text-slate-800 pl-4 border-l border-slate-300/60">Form Input & Keterangan</div>
                      </div>
                      <div className="flex flex-col">
                        {masterForm.konsultan.fields.map((f, i) => (
                          <div key={f.id} className="flex flex-col sm:flex-row py-3 px-6 border-b border-slate-100 last:border-0 bg-white hover:bg-slate-50/50 transition-colors gap-3 sm:gap-4 items-start sm:items-center">
                            <div className="w-full sm:w-1/3 flex gap-2">
                              <select className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[10px] font-bold outline-none focus:border-blue-400 shrink-0" value={f.type} onChange={e => {
                                const newF = [...masterForm.konsultan.fields];
                                newF[i].type = e.target.value;
                                if (e.target.value === 'date') newF[i].value = '';
                                setMasterForm({ ...masterForm, konsultan: { ...masterForm.konsultan, fields: newF } });
                              }}>
                                <option value="text">Teks</option>
                                <option value="date">Tanggal</option>
                              </select>
                              <input type="text" placeholder="Nama Field" className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-600 outline-none focus:border-blue-400" value={f.label} onChange={e => {
                                const newF = [...masterForm.konsultan.fields];
                                newF[i].label = e.target.value;
                                setMasterForm({ ...masterForm, konsultan: { ...masterForm.konsultan, fields: newF } });
                              }} />
                            </div>
                            <div className="w-full sm:w-2/3 flex gap-2 items-center">
                              {f.type === 'date' ? (
                                <input type="date" className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-400 focus:outline-none transition-all" value={f.value} onChange={e => {
                                  const newF = [...masterForm.konsultan.fields];
                                  newF[i].value = e.target.value;
                                  setMasterForm({ ...masterForm, konsultan: { ...masterForm.konsultan, fields: newF } });
                                }} />
                              ) : (
                                <AutoResizeTextarea value={f.value} onChange={e => {
                                  const newF = [...masterForm.konsultan.fields];
                                  newF[i].value = e.target.value;
                                  setMasterForm({ ...masterForm, konsultan: { ...masterForm.konsultan, fields: newF } });
                                }} placeholder="Isi detail keterangan..." className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-400 focus:outline-none transition-all leading-relaxed" />
                              )}
                              <div className="flex gap-1 shrink-0">
                                <button type="button" onClick={() => {
                                  const newF = [...masterForm.konsultan.fields];
                                  if (i > 0) { const temp = newF[i]; newF[i] = newF[i-1]; newF[i-1] = temp; setMasterForm({ ...masterForm, konsultan: { ...masterForm.konsultan, fields: newF } }); }
                                }} disabled={i === 0} className="p-2 text-slate-400 bg-slate-100 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-30" title="Geser ke Atas"><ArrowUp size={14} /></button>
                                <button type="button" onClick={() => {
                                  const newF = [...masterForm.konsultan.fields];
                                  if (i < newF.length - 1) { const temp = newF[i]; newF[i] = newF[i+1]; newF[i+1] = temp; setMasterForm({ ...masterForm, konsultan: { ...masterForm.konsultan, fields: newF } }); }
                                }} disabled={i === masterForm.konsultan.fields.length - 1} className="p-2 text-slate-400 bg-slate-100 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-30" title="Geser ke Bawah"><ArrowDown size={14} /></button>
                                <button type="button" onClick={() => {
                                  const newF = [...masterForm.konsultan.fields];
                                  newF.splice(i, 1);
                                  setMasterForm({ ...masterForm, konsultan: { ...masterForm.konsultan, fields: newF } });
                                }} className="p-2 text-rose-400 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors ml-1" title="Hapus Field"><Trash size={14} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 sm:px-6 bg-[#f8fafc] border-t border-slate-200 flex justify-end">
                        <button type="button" onClick={() => {
                          setMasterForm({ ...masterForm, konsultan: { ...masterForm.konsultan, fields: [...masterForm.konsultan.fields, { id: Date.now(), label: 'Field Baru', value: '', type: 'text' }] } });
                        }} className="text-[10px] font-bold text-blue-600 bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-50 w-max"><Plus size={12} /> Tambah Field</button>
                      </div>
                      <div className="p-4 sm:p-6 bg-[#f8fafc] border-t border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xs font-bold uppercase text-slate-600">Personil Konsultan</h4>
                          <button type="button" onClick={() => setMasterForm({ ...masterForm, konsultan: { ...masterForm.konsultan, personil: [...(masterForm.konsultan.personil || []), { name: '', position: '' }] } })} className="text-[10px] font-bold bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-50"><Plus size={12} />Tambah Personil</button>
                        </div>
                        {(masterForm.konsultan.personil || []).map((p, i) => (
                          <div key={i} className="flex flex-col md:flex-row gap-2 mb-2 items-center">
                            <input type="text" placeholder="Nama Lengkap" className="flex-1 w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-blue-400" value={p.name} onChange={e => { const newP = [...masterForm.konsultan.personil]; newP[i].name = e.target.value; setMasterForm({ ...masterForm, konsultan: { ...masterForm.konsultan, personil: newP } }); }} />
                            <input type="text" placeholder="Jabatan" className="w-full md:w-1/3 p-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-blue-400" value={p.position} onChange={e => { const newP = [...masterForm.konsultan.personil]; newP[i].position = e.target.value; setMasterForm({ ...masterForm, konsultan: { ...masterForm.konsultan, personil: newP } }); }} />
                            <button type="button" onClick={() => { const newP = [...masterForm.konsultan.personil]; newP.splice(i, 1); setMasterForm({ ...masterForm, konsultan: { ...masterForm.konsultan, personil: newP } }); }} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors w-full md:w-auto flex justify-center"><Trash size={16} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: ARSIP (ADMIN) */}
        {activeMenu === 'admin' && (
          <div className="h-full flex flex-col">
            <header className="px-6 py-6 md:px-10 flex justify-between items-center border-b border-slate-200">
              <div className="flex items-center gap-3"><div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl"><FolderEdit size={24} /></div><div><h2 className="text-xl font-bold">Arsip Dokumen Proyek</h2></div></div>
              <div className="flex gap-2"><button onClick={() => setShowCategoryManager(true)} className="bg-white border px-4 py-3 rounded-2xl flex items-center gap-2"><Settings size={16} /> Kategori</button><button onClick={() => setShowDocModal(true)} className="bg-blue-600 text-white px-4 py-3 rounded-2xl flex items-center gap-2"><Upload size={16} /> Upload</button></div>
            </header>
            <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">

              <div className="mb-6 space-y-4">
                <div className="bg-white p-2 flex items-center rounded-2xl border border-slate-200 shadow-sm focus-within:border-blue-400 focus-within:shadow-md transition-all">
                  <div className="pl-4 pr-2 text-slate-400"><Search size={20} /></div>
                  <input type="text" placeholder="Cari nama dokumen atau arsip..." value={docSearchQuery} onChange={e => setDocSearchQuery(e.target.value)} className="w-full py-3 px-2 bg-transparent outline-none text-sm font-bold text-slate-700" />
                  {docSearchQuery && (
                    <button onClick={() => setDocSearchQuery('')} className="pr-4 pl-2 text-rose-400 hover:text-rose-600 transition-colors">
                      <X size={20} />
                    </button>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 pt-1">
                  <button onClick={() => setDocFilterCategory('Semua')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${docFilterCategory === 'Semua' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}>Semua</button>
                  {docCategories.map(c => (
                    <button key={c} onClick={() => setDocFilterCategory(c)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${docFilterCategory === c ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}>{c}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredDocs.length > 0 ? (
                  filteredDocs.map(doc => {
                    const info = getFileIconInfo(doc.name);
                    return (
                      <div key={doc.id} className="bg-white border p-4 rounded-2xl flex items-center justify-between group hover:border-blue-300 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4"><div className={`p-3 rounded-xl ${info.bg} ${info.color}`}><info.icon size={20} /></div><div className="min-w-0"><h4 className="text-sm font-bold truncate" title={doc.name}>{String(doc.name || '')}</h4><div className="text-[10px] text-slate-500 uppercase">{doc.category} - {doc.size}</div></div></div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => setMoveDocConfig({ id: doc.id, category: doc.category, newCategory: doc.category })} className="p-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-50 rounded-lg hover:bg-blue-100" title="Pindah Kategori"><Edit3 size={16} /></button>
                          <button onClick={() => setDeleteConfig({ id: doc.id, type: 'doc' })} className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity bg-rose-50 rounded-lg hover:bg-rose-100" title="Hapus Dokumen"><Trash size={16} /></button>
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"><ExternalLink size={14} /> <span className="hidden sm:inline">Buka Dokumen</span></a>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    <FolderEdit size={48} className="text-slate-300 mb-4" />
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Dokumen Tidak Ditemukan</h3>
                    <p className="text-xs text-slate-500 font-medium mt-2">Tidak ada dokumen yang sesuai dengan filter atau kata kunci pencarian Anda.</p>
                    {(docSearchQuery || docFilterCategory !== 'Semua') && (
                      <button onClick={() => { setDocSearchQuery(''); setDocFilterCategory('Semua'); }} className="mt-4 text-[10px] font-bold bg-white border border-slate-200 text-blue-600 px-4 py-2 rounded-xl shadow-sm hover:bg-blue-50 transition-colors">
                        Reset Pencarian & Filter
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- SEMUA MODAL POP-UP --- */}
      {showEditProjectModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setShowEditProjectModal(false)} className="absolute top-6 right-6 p-2"><X size={20} /></button>
            <h3 className="text-lg font-black mb-6">Pengaturan Proyek</h3>
            <form onSubmit={handleUpdateProject} className="space-y-4">
              <div><label className="text-[10px] font-bold block mb-1">Nama Pekerjaan</label><input type="text" className="w-full p-3 rounded-xl border bg-slate-50" value={editProjectForm.pekerjaan} onChange={e => setEditProjectForm({ ...editProjectForm, pekerjaan: e.target.value })} required /></div>
              
              <div><label className="text-[10px] font-bold block mb-1">Posisi Termin (Ke)</label><input type="text" className="w-full p-3 rounded-xl border bg-slate-50 outline-none focus:border-blue-400" value={editProjectForm.termin_ke} onChange={e => setEditProjectForm({ ...editProjectForm, termin_ke: e.target.value })} /></div>
              
              <div><label className="text-[10px] font-bold block mb-1">Persentase (%)</label><input type="number" step="0.01" className="w-full p-3 rounded-xl border bg-slate-50 outline-none focus:border-blue-400" value={editProjectForm.termin_persen} onChange={e => setEditProjectForm({ ...editProjectForm, termin_persen: e.target.value })} /></div>
              
              <div><label className="text-[10px] font-bold block mb-1">Progress Fisik (%) - Dari Kurva S</label><input type="text" className="w-full p-3 rounded-xl border border-transparent bg-slate-200 text-slate-500 font-bold outline-none cursor-not-allowed shadow-inner" value={(() => {
                const cleanActual = String(sCurveForm.actual || '').replace(/\s+/g, '').replace(/,/g, '.').split('-').filter(Boolean);
                return cleanActual.length > 0 ? (parseFloat(cleanActual[cleanActual.length - 1]) || 0) : 0;
              })()} readOnly title="Otomatis diambil dari Realisasi Kurva S di bagian bawah form" /></div>
              
              <div><label className="text-[10px] font-bold block mb-1">Waktu Pelaksanaan (Hari)</label><input type="number" className="w-full p-3 rounded-xl border bg-slate-50 outline-none focus:border-blue-400" value={editProjectForm.waktu_pelaksanaan} onChange={e => setEditProjectForm({ ...editProjectForm, waktu_pelaksanaan: e.target.value })} placeholder="0" /></div>
              
              <div><label className="text-[10px] font-bold block mb-1">Panjang (m)</label><input type="text" className="w-full p-3 rounded-xl border bg-slate-50 outline-none focus:border-blue-400" value={editProjectForm.panjang_rencana} onChange={e => setEditProjectForm({ ...editProjectForm, panjang_rencana: e.target.value })} /></div>
              
              <div><label className="text-[10px] font-bold block mb-1">Lebar (m)</label><input type="text" className="w-full p-3 rounded-xl border bg-slate-50 outline-none focus:border-blue-400" value={editProjectForm.lebar_rencana} onChange={e => setEditProjectForm({ ...editProjectForm, lebar_rencana: e.target.value })} /></div>

              <div><label className="text-[10px] font-bold block mb-1">Jenis / Model Saluran</label><input type="text" className="w-full p-3 rounded-xl border bg-slate-50 outline-none focus:border-blue-400" value={editProjectForm.jenis_model} onChange={e => setEditProjectForm({ ...editProjectForm, jenis_model: e.target.value })} placeholder="Misal: U-Ditch, Batu Kali..." /></div>

              <div className="border-t border-slate-200 pt-5 mt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[11px] font-black uppercase text-blue-600 tracking-widest">Item Utama Proyek</label>
                  <button type="button" onClick={() => setEditProjectForm(p => ({ ...p, item_utama_data: [...(p.item_utama_data || []), { id: Date.now(), nama: '', bobot: '', nilai: '', satuan: '', persen: 0 }] }))} className="text-[9px] font-bold bg-blue-50 border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"><Plus size={10} /> Tambah Item</button>
                </div>
                <div className="space-y-3">
                  {(editProjectForm.item_utama_data || []).map((item, idx) => (
                    <div key={item.id || idx} className="flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm w-full">
                      <div className="flex gap-2 items-center">
                        <input type="text" placeholder="Misal: Pekerjaan Galian" className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold outline-none focus:border-blue-400" value={item.nama} onChange={e => { const n = [...editProjectForm.item_utama_data]; n[idx].nama = e.target.value; setEditProjectForm({ ...editProjectForm, item_utama_data: n }) }} />
                        <button type="button" onClick={() => { const n = [...editProjectForm.item_utama_data]; n.splice(idx, 1); setEditProjectForm({ ...editProjectForm, item_utama_data: n }) }} className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors shrink-0"><Trash size={14} /></button>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <input type="text" placeholder="Renc. Hari Ini" className="w-full p-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-blue-400 text-center" value={item.bobot || ''} onChange={e => { 
                          const n = [...editProjectForm.item_utama_data]; 
                          n[idx].bobot = e.target.value; 
                          const valH = parseFloat(e.target.value) || 0;
                          const valT = parseFloat(n[idx].nilai) || 0;
                          n[idx].persen = parseFloat(((valT * valH) / 100).toFixed(2));
                          setEditProjectForm({ ...editProjectForm, item_utama_data: n }) 
                        }} title="Rencana Hari Ini" />
                        <input type="text" placeholder="Total" className="w-full p-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-blue-400 text-center" value={item.nilai || ''} onChange={e => { 
                          const n = [...editProjectForm.item_utama_data]; 
                          n[idx].nilai = e.target.value; 
                          const valT = parseFloat(e.target.value) || 0;
                          const valH = parseFloat(n[idx].bobot) || 0;
                          n[idx].persen = parseFloat(((valT * valH) / 100).toFixed(2));
                          setEditProjectForm({ ...editProjectForm, item_utama_data: n }) 
                        }} title="Total Volume" />
                        <input type="text" placeholder="Satuan" className="w-full p-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-blue-400 text-center" value={item.satuan || ''} onChange={e => { const n = [...editProjectForm.item_utama_data]; n[idx].satuan = e.target.value; setEditProjectForm({ ...editProjectForm, item_utama_data: n }) }} title="Satuan" />
                        <input type="number" placeholder="Progres %" className="w-full p-2 rounded-lg border border-transparent bg-slate-100 text-blue-600 text-xs outline-none font-black text-center cursor-not-allowed shadow-inner" value={item.persen} readOnly title="Progress Otomatis: (Total x Hari Ini) / 100" />
                      </div>
                    </div>
                  ))}
                  {(!editProjectForm.item_utama_data || editProjectForm.item_utama_data.length === 0) && <p className="text-[10px] text-slate-400 text-center italic py-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">Klik 'Tambah Item' untuk memasukkan data progres item utama.</p>}
                </div>
              </div>

              {/* TAMBAHAN BARU: INPUT KURVA S DIGABUNG KE SINI */}
              <div className="border-t border-slate-200 pt-5 mt-4">
                <div className="mb-3">
                  <label className="text-[11px] font-black uppercase text-blue-600 tracking-widest">Data Kurva S Pekerjaan</label>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold block mb-1">Rencana (%) - pisah dengan strip (-)</label>
                    <textarea className="w-full p-4 rounded-xl border font-mono bg-slate-50 outline-none focus:border-blue-400 text-sm" rows="3" value={sCurveForm.plan} onChange={e => setSCurveForm({ ...sCurveForm, plan: e.target.value })} placeholder="Contoh: 0 - 5.5 - 12 - 25"></textarea>
                    {/* Live Preview Label M1, M2 */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {String(sCurveForm.plan || '').split('-').map((val, idx) => val.trim() !== '' ? (
                        <div key={idx} className="text-[9px] font-bold px-2 py-1 rounded-md border bg-blue-50 text-blue-600 border-blue-200">M{idx + 1} <span className="opacity-40 mx-0.5">|</span> {val.trim()}%</div>
                      ) : null)}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold block mb-1">Realisasi (%) - pisah dengan strip (-)</label>
                    <textarea className="w-full p-4 rounded-xl border font-mono bg-slate-50 outline-none focus:border-blue-400 text-sm" rows="3" value={sCurveForm.actual} onChange={e => setSCurveForm({ ...sCurveForm, actual: e.target.value })} placeholder="Contoh: 0 - 6 - 15"></textarea>
                    {/* Live Preview Label M1, M2 */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {String(sCurveForm.actual || '').split('-').map((val, idx) => val.trim() !== '' ? (
                        <div key={idx} className="text-[9px] font-bold px-2 py-1 rounded-md border bg-emerald-50 text-emerald-600 border-emerald-200">M{idx + 1} <span className="opacity-40 mx-0.5">|</span> {val.trim()}%</div>
                      ) : null)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 border-t border-slate-200 pt-6">
                <button type="button" onClick={() => { setShowEditProjectModal(false); setDeleteConfig({ id: projectData.id, type: 'project', name: projectData.pekerjaan }); }} className="w-1/3 bg-rose-50 text-rose-600 py-4 rounded-2xl text-xs font-bold uppercase shadow-sm hover:bg-rose-100 transition-colors flex justify-center items-center gap-2">
                  <Trash size={16} /> <span className="hidden sm:inline">Hapus Proyek</span>
                </button>
                <button type="submit" disabled={isProcessing} className="w-2/3 bg-blue-600 text-white py-4 rounded-2xl text-xs font-bold uppercase shadow-md flex justify-center items-center gap-2">
                  {isProcessing ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center z-[1000] p-4 md:p-8 overflow-y-auto">
          <div className="bg-white rounded-[32px] p-6 md:p-10 w-full max-w-5xl shadow-2xl relative my-auto">
            <button onClick={() => setShowReportModal(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-10"><X size={20} /></button>
            <h3 className="text-2xl font-black mb-6 pr-10 border-b border-slate-200 pb-4 text-slate-800">
              {reportTab === 'harian' ? 'Input Laporan Harian' : reportTab === 'lapangan' ? 'Input Lapor Lapangan' : 'Input Data Survei (Awal)'}
            </h3>

            {/* TAB SWITCHER */}
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border text-center mb-6 overflow-x-auto custom-scrollbar">
              <button onClick={() => setReportTab('harian')} className={`flex-1 min-w-[160px] py-3 rounded-lg text-[11px] md:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${reportTab === 'harian' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
                <FileText size={16} /> Laporan Harian
              </button>
              <button onClick={() => setReportTab('lapangan')} className={`flex-1 min-w-[160px] py-3 rounded-lg text-[11px] md:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${reportTab === 'lapangan' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
                <Camera size={16} /> Lapor Lapangan
              </button>
              <button onClick={() => setReportTab('survei')} className={`flex-1 min-w-[160px] py-3 rounded-lg text-[11px] md:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${reportTab === 'survei' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
                <Ruler size={16} /> Data Survei
              </button>
            </div>

            {reportTab === 'harian' && (
              <form onSubmit={handleReportSubmit} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">

                {/* A. JAM KERJA & LOKASI */}
                <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 space-y-5 w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200/50 pb-2 gap-2">
                    <h4 className="text-sm font-black uppercase text-slate-500 tracking-widest">A. Jam Kerja & Lokasi</h4>
                    <span className="text-[9px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200 flex items-center gap-1.5"><Save size={10} className="text-blue-500" /> Waktu Kerja & Lokasi otomatis tersimpan ke template rutinitas</span>
                  </div>

                  <div className="space-y-4">
                    <SurveyInputRow label="Lokasi Pekerjaan">
                      <input type="text" value={dailyReportForm.lokasi} onChange={e => setDailyReportForm(p => ({ ...p, lokasi: e.target.value }))} placeholder="Nama Jalan, Titik Lokasi, atau STA (Opsional)" className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-sm font-normal text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm" />
                    </SurveyInputRow>

                    <SurveyInputRow label="Tanggal Laporan">
                      <input type="date" value={dailyReportForm.tanggal} onChange={e => setDailyReportForm(p => ({ ...p, tanggal: e.target.value }))} className="w-full sm:w-1/3 p-3.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm" required />
                    </SurveyInputRow>
                  </div>

                  {dailyReportForm.shifts.map((shift, idx) => (
                    <div key={shift.id} className="relative bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      {dailyReportForm.shifts.length > 1 && (
                        <button type="button" onClick={() => setDailyReportForm(p => ({ ...p, shifts: p.shifts.filter((_, i) => i !== idx) }))} className="absolute top-4 right-4 text-rose-400 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 p-1.5 rounded-lg transition-colors" title="Hapus Shift">
                          <Trash size={14} />
                        </button>
                      )}
                      <h5 className="text-[10px] font-black text-blue-600 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={12}/> Waktu Kerja / Shift {idx + 1}
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SurveyInputRow label="Waktu Mulai">
                          <div className="flex gap-2">
                            <input type="date" value={shift.tanggalMulai} onChange={e => handleShiftChange(idx, 'tanggalMulai', e.target.value)} className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-400 text-xs font-bold transition-colors" />
                            <input type="time" value={shift.jamMulai} onChange={e => handleShiftChange(idx, 'jamMulai', e.target.value)} className="w-28 p-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-400 text-xs font-bold shrink-0 transition-colors" />
                          </div>
                        </SurveyInputRow>

                        <SurveyInputRow label="Waktu Selesai (Auto)">
                          <div className="flex gap-2">
                            <input type="date" value={shift.tanggalSelesai} onChange={e => handleShiftChange(idx, 'tanggalSelesai', e.target.value)} className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-400 text-xs font-bold transition-colors" title="Otomatis menyesuaikan jika lintas jam malam" />
                            <input type="time" value={shift.jamSelesai} onChange={e => handleShiftChange(idx, 'jamSelesai', e.target.value)} className="w-28 p-3 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-400 text-xs font-bold shrink-0 transition-colors" />
                          </div>
                        </SurveyInputRow>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    type="button" 
                    onClick={() => setDailyReportForm(p => ({ ...p, shifts: [...p.shifts, { id: Date.now(), tanggalMulai: p.tanggal, jamMulai: '19:00', tanggalSelesai: p.tanggal, jamSelesai: '23:00' }] }))}
                    className="w-full py-3.5 border-2 border-dashed border-blue-200 text-blue-600 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 rounded-xl text-xs font-black uppercase tracking-widest flex justify-center items-center gap-2 transition-all"
                  >
                    <Plus size={16} /> Tambah Waktu Kerja / Shift Lembur
                  </button>
                </div>

              {/* B. CUACA */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 space-y-3 w-full">
                <div className="flex justify-between items-end border-b border-slate-200/50 pb-2 mb-1">
                  <h4 className="text-sm font-black uppercase text-slate-500 tracking-widest">B. Kondisi Cuaca</h4>
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-md font-bold uppercase">Auto-Generated</span>
                </div>
                <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm w-full">
                  <div className="hidden md:flex bg-[#f8fafc] border-b border-slate-200 px-4 py-3 items-center text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    <div className="w-1/2 md:w-2/3 text-left">Waktu Rentang Kerja</div>
                    <div className="flex-1 text-left px-4">Kondisi Cuaca</div>
                  </div>
                  {Object.keys(dailyReportForm.cuaca).map(jam => (
                    <div key={jam} className="flex border-b border-slate-100 last:border-b-0 items-center hover:bg-slate-50/50 transition-colors w-full">
                      <label className="w-1/2 md:w-2/3 p-4 bg-slate-50/80 border-r border-slate-100 text-xs font-bold text-slate-600">{jam}</label>
                      <div className="flex-1 p-2 px-4 shrink-0">
                        <select
                          value={dailyReportForm.cuaca[jam]}
                          onChange={e => setDailyReportForm(p => ({ ...p, cuaca: { ...p.cuaca, [jam]: e.target.value } }))}
                          className="w-full p-2 rounded-lg border border-slate-200 bg-white outline-none text-sm font-bold text-slate-800 focus:bg-blue-50 focus:border-blue-400 transition-all cursor-pointer"
                        >
                          <option value="Cerah">Cerah</option>
                          <option value="Gerimis">Gerimis</option>
                          <option value="Hujan">Hujan</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* C. AKTIVITAS */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 space-y-3 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200/50 pb-2 gap-2">
                   <h4 className="text-sm font-black uppercase text-slate-500 tracking-widest">C. Aktivitas Pekerjaan</h4>
                   <span className="text-[9px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200 flex items-center gap-1.5"><Save size={10} className="text-blue-500" /> Item otomatis tersimpan sebagai template rutinitas</span>
                </div>
                <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm w-full">
                  <div className="hidden md:flex bg-[#f8fafc] border-b border-slate-200 pl-4 pr-12 py-3 items-center text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    <div className="flex-1 min-w-[200px] text-left">Item Pekerjaan</div><div className="w-[18%]">Kemaren</div><div className="w-[18%]">Hari Ini</div><div className="w-[18%]">Total</div><div className="w-[18%]">Satuan</div>
                  </div>
                  {dailyReportForm.aktivitas.map((akt, i) => {
                    const total = (parseFloat(akt.kemarin) || 0) + (parseFloat(akt.hariIni) || 0);
                    return (
                      <div key={i} className="flex flex-col md:flex-row items-center border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors w-full p-2 pr-12 md:py-0 md:pl-0 md:pr-12 relative group/akt">
                        <div className="w-full md:flex-1 min-w-[200px] p-2 md:px-4">
                            <input type="text" className="w-full p-2 text-xs font-bold text-slate-700 border-none bg-transparent outline-none focus:bg-slate-50 rounded" value={akt.nama} onChange={e => { const n = [...dailyReportForm.aktivitas]; n[i].nama = e.target.value; setDailyReportForm({ ...dailyReportForm, aktivitas: n }); }} placeholder="Ketik Nama Item Pekerjaan..." />
                        </div>
                        <div className="flex w-full md:w-[72%] gap-2 md:gap-0 mt-2 md:mt-0 divide-x divide-slate-100">
                          <div className="flex-1 p-1 md:p-2"><input type="number" placeholder="0" className="w-full p-2 rounded-lg border bg-white text-xs font-black text-center outline-none focus:border-blue-400" value={akt.kemarin} onChange={e => { const n = [...dailyReportForm.aktivitas]; n[i].kemarin = e.target.value; setDailyReportForm({ ...dailyReportForm, aktivitas: n }); }} /></div>
                          <div className="flex-1 p-1 md:p-2"><input type="number" placeholder="0" className="w-full p-2 rounded-lg border bg-white text-xs font-black text-center outline-none focus:border-blue-400" value={akt.hariIni} onChange={e => { const n = [...dailyReportForm.aktivitas]; n[i].hariIni = e.target.value; setDailyReportForm({ ...dailyReportForm, aktivitas: n }); }} /></div>
                          <div className="flex-1 p-1 md:p-2"><input type="number" className="w-full p-2 rounded-lg border border-transparent bg-slate-50 text-blue-600 font-black text-xs text-center cursor-not-allowed" value={total > 0 ? total : ''} readOnly /></div>
                          <div className="flex-1 p-1 md:p-2"><input type="text" className="w-full p-2 rounded-lg border bg-white text-xs font-bold text-center outline-none focus:border-blue-400" value={akt.satuan} onChange={e => { const n = [...dailyReportForm.aktivitas]; n[i].satuan = e.target.value; setDailyReportForm({ ...dailyReportForm, aktivitas: n }); }} placeholder="m/unit" /></div>
                        </div>

                        {/* Tombol Hapus */}
                        <button 
                          type="button" 
                          onClick={() => setDailyReportForm(p => ({ ...p, aktivitas: p.aktivitas.filter((_, idx) => idx !== i) }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-rose-400 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all opacity-0 group-hover/akt:opacity-100 shadow-sm z-10"
                          title="Hapus Item"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    )
                  })}
                  <div className="p-4 bg-[#f8fafc] border-t border-slate-200 flex justify-end items-center">
                    <button type="button" onClick={() => setDailyReportForm(p => ({ ...p, aktivitas: [...p.aktivitas, { nama: '', kemarin: '', hariIni: '', satuan: '' }] }))} className="text-[10px] font-bold text-blue-600 bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-50 w-max"><Plus size={12} /> Tambah Item Lainnya</button>
                  </div>
                </div>
              </div>

              {/* D. TENAGA KERJA */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 space-y-3 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200/50 pb-2 gap-2">
                   <h4 className="text-sm font-black uppercase text-slate-500 tracking-widest">D. Jumlah Tenaga Kerja</h4>
                   <span className="text-[9px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200 flex items-center gap-1.5"><Save size={10} className="text-blue-500" /> Tersimpan di template rutinitas</span>
                </div>
                <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm w-full">
                  <div className="hidden md:flex bg-[#f8fafc] border-b border-slate-200 px-4 py-3 items-center text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    <div className="w-1/2 md:w-2/3 text-left">Posisi / Jabatan</div>
                    <div className="flex-1">Jumlah (Orang)</div>
                  </div>
                  {(Array.isArray(dailyReportForm.tenagaKerja) ? dailyReportForm.tenagaKerja : []).map((tk, i) => (
                    <div key={i} className="flex flex-col md:flex-row border-b border-slate-100 last:border-b-0 items-center hover:bg-slate-50/50 transition-colors w-full p-2 pr-12 md:p-0 md:pr-12 relative group/tk">
                      <div className="w-full md:w-2/3 p-2 md:p-4 md:border-r border-slate-100">
                         <input type="text" className="w-full text-xs font-bold text-slate-700 bg-transparent outline-none focus:bg-slate-50 p-2 rounded" value={tk.posisi} onChange={e => { const n = [...dailyReportForm.tenagaKerja]; n[i].posisi = e.target.value; setDailyReportForm(p => ({...p, tenagaKerja: n})); }} placeholder="Ketik Posisi..." />
                      </div>
                      <div className="w-full md:flex-1 p-2 md:px-4 shrink-0">
                        <input type="number" min="0" placeholder="0" className="w-full p-2 text-center rounded-lg border border-slate-200 bg-white outline-none text-sm font-bold text-slate-800 focus:bg-blue-50 focus:border-blue-400 transition-all" value={tk.jumlah} onChange={e => { const n = [...dailyReportForm.tenagaKerja]; n[i].jumlah = e.target.value; setDailyReportForm(p => ({...p, tenagaKerja: n})); }} />
                      </div>
                      
                      {/* Tombol Hapus */}
                      <button 
                        type="button" 
                        onClick={() => setDailyReportForm(p => ({ ...p, tenagaKerja: p.tenagaKerja.filter((_, idx) => idx !== i) }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-rose-400 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all opacity-0 group-hover/tk:opacity-100 shadow-sm z-10"
                        title="Hapus"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="p-4 bg-[#f8fafc] border-t border-slate-200 flex justify-end items-center">
                    <button type="button" onClick={() => setDailyReportForm(p => ({ ...p, tenagaKerja: [...p.tenagaKerja, { posisi: '', jumlah: '' }] }))} className="text-[10px] font-bold text-blue-600 bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-50 w-max"><Plus size={12} /> Tambah Posisi Lainnya</button>
                  </div>
                </div>
              </div>

              {/* CATATAN & KENDALA */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 space-y-3 w-full">
                <h4 className="text-sm font-black uppercase text-slate-500 tracking-widest border-b border-slate-200/50 pb-2 mb-2">E. Catatan & Kendala Lapangan</h4>
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
                  <textarea 
                    rows="4" 
                    value={dailyReportForm.catatan} 
                    onChange={e => setDailyReportForm(p => ({ ...p, catatan: e.target.value }))} 
                    placeholder="Tuliskan catatan, instruksi, kendala atau permasalahan (Opsional)... &#10;Note: Jika ada kata 'kendala' sistem akan otomatis menandai log dengan warna merah." 
                    className="w-full p-2 outline-none text-sm font-normal text-slate-700 bg-transparent resize-y"
                  ></textarea>
                </div>
              </div>

              {/* F. DOKUMENTASI FOTO (OPSIONAL) */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 space-y-4 w-full">
                <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                  <h4 className="text-sm font-black uppercase text-slate-500 tracking-widest">F. Dokumentasi Lapangan (Opsional)</h4>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                  {/* Preview Foto */}
                  {repFiles && repFiles.map((file, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl border border-blue-200 overflow-hidden group bg-white flex items-center justify-center shadow-sm">
                       {file.type.startsWith('video/') ? (
                           <MonitorPlay className="text-blue-500" />
                       ) : (
                           <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt={`preview-${idx}`} />
                       )}
                       <button type="button" onClick={() => setRepFiles(p => p.filter((_, i) => i !== idx))} className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg shadow-md hover:bg-rose-600 transition-all z-10" title="Hapus Foto">
                           <Trash size={12}/>
                       </button>
                       <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-1.5 truncate text-[8px] text-white text-center font-bold">
                           {file.name}
                       </div>
                    </div>
                  ))}
                  
                  {/* Tombol Tambah */}
                  <label className="aspect-square rounded-xl border-2 border-dashed border-blue-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all text-blue-600 bg-white group shadow-sm">
                     <div className="p-2 bg-blue-100 text-blue-600 rounded-full mb-1 group-hover:scale-110 transition-transform">
                         <Plus size={24} />
                     </div>
                     <span className="text-[10px] font-black uppercase mt-1">Tambah Foto</span>
                     <input
                       type="file"
                       multiple
                       accept="image/*,video/*"
                       className="hidden"
                       onChange={(e) => {
                         const files = Array.from(e.target.files);
                         setRepFiles(prev => [...prev, ...files]);
                         e.target.value = null;
                       }}
                     />
                  </label>
                </div>
              </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-4 border-t border-slate-200">
                   <button type="button" onClick={handleSaveTemplate} disabled={isProcessing} className="w-full sm:w-1/3 bg-emerald-50 text-emerald-600 border border-emerald-200 py-4 md:text-sm rounded-2xl font-black uppercase tracking-widest shadow-sm hover:bg-emerald-100 transition-all flex items-center justify-center gap-2">
                     {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                     SIMPAN TEMPLATE FORM
                   </button>
                   <button type="submit" disabled={isProcessing} className="w-full sm:w-2/3 bg-blue-600 text-white py-4 md:text-lg rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                     {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <CheckCircle2 size={24} />}
                     {isProcessing ? 'MEMPROSES...' : 'KIRIM LAPORAN'}
                   </button>
                </div>
              </form>
            )}

            {reportTab === 'lapangan' && (
              <form onSubmit={handleQuickReportSubmit} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-emerald-50/50 p-6 md:p-8 rounded-2xl border border-emerald-100 space-y-6 w-full">
                  
                  <SurveyInputRow label="Dokumentasi Foto / Video Lapangan">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                      {/* Preview Foto */}
                      {quickRepFiles && quickRepFiles.map((file, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl border border-emerald-200 overflow-hidden group bg-white flex items-center justify-center shadow-sm">
                           {file.type.startsWith('video/') ? (
                               <MonitorPlay className="text-emerald-500" />
                           ) : (
                               <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt={`preview-${idx}`} />
                           )}
                           <button type="button" onClick={() => setQuickRepFiles(p => p.filter((_, i) => i !== idx))} className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg shadow-md hover:bg-rose-600 transition-all z-10" title="Hapus Foto">
                               <Trash size={12}/>
                           </button>
                           <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-1.5 truncate text-[8px] text-white text-center font-bold">
                               {file.name}
                           </div>
                        </div>
                      ))}
                      
                      {/* Tombol Tambah */}
                      <label className="aspect-square rounded-xl border-2 border-dashed border-emerald-300 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all text-emerald-600 bg-white group shadow-sm">
                         <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full mb-1 group-hover:scale-110 transition-transform">
                             <Plus size={24} />
                         </div>
                         <span className="text-[10px] font-black uppercase mt-1">Tambah Media</span>
                         <input
                           type="file"
                           multiple
                           accept="image/*,video/*"
                           className="hidden"
                           onChange={(e) => {
                             const files = Array.from(e.target.files);
                             setQuickRepFiles(prev => [...prev, ...files]);
                             e.target.value = null;
                           }}
                         />
                      </label>
                    </div>
                  </SurveyInputRow>

                  <SurveyInputRow label="Keterangan / Catatan Lapangan">
                    <textarea 
                      rows="5" 
                      value={quickReportNote} 
                      onChange={e => setQuickReportNote(e.target.value)} 
                      placeholder="Ketik keterangan mengenai foto di atas, kondisi di lapangan, temuan, atau instruksi..." 
                      className="w-full p-4 rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-500 text-sm font-normal shadow-sm"
                      required
                    ></textarea>
                  </SurveyInputRow>

                </div>

                <div className="pt-4 border-t border-slate-200">
                   <button type="submit" disabled={isProcessing} className="w-full bg-emerald-600 text-white py-4 md:text-lg rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">
                     {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <CheckCircle2 size={24} />}
                     {isProcessing ? 'MEMPROSES...' : 'KIRIM LAPORAN LAPANGAN'}
                   </button>
                </div>
              </form>
            )}

            {reportTab === 'survei' && (
              <form onSubmit={handleUnifiedSubmit} className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <SurveyInputRow label="Tanggal"><input type="date" value={uForm.tanggal} onChange={e => setUForm(p => ({ ...p, tanggal: e.target.value }))} className="w-full p-3 rounded-xl border bg-slate-50" /></SurveyInputRow>
                <SurveyInputRow label="Nama Jln/Gg./Blok"><input type="text" value={uForm.namaSegmen} onChange={e => setUForm(p => ({ ...p, namaSegmen: e.target.value }))} placeholder="Misal: Jl. Mawar / Segmen 1" className="w-full p-3 rounded-xl border bg-slate-50" /></SurveyInputRow>
                
                <SurveyInputRow label="Titik Koordinat Batas Pekerjaan (Awal & Akhir)">
                  <div className="space-y-3">
                     {/* Titik Awal */}
                     <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-500 w-10 text-center shrink-0 uppercase tracking-widest">Awal</span>
                        <input type="text" placeholder="Lat" value={uForm.points[0]?.lat || ''} onChange={e => {
                           const n = [...uForm.points]; n[0].lat = e.target.value; setUForm(p => ({...p, points: n}));
                        }} className="flex-1 p-2 text-xs rounded-lg border bg-white focus:outline-blue-400" />
                        <input type="text" placeholder="Lng" value={uForm.points[0]?.lng || ''} onChange={e => {
                           const n = [...uForm.points]; n[0].lng = e.target.value; setUForm(p => ({...p, points: n}));
                        }} className="flex-1 p-2 text-xs rounded-lg border bg-white focus:outline-blue-400" />
                        <button type="button" onClick={() => getUnifiedGPS(0)} className="px-3 py-2 bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors font-bold rounded-lg text-[10px] shadow-sm">GPS</button>
                     </div>
                     
                     {/* Titik Akhir */}
                     <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-500 w-10 text-center shrink-0 uppercase tracking-widest">Akhir</span>
                        <input type="text" placeholder="Lat" value={uForm.points[1]?.lat || ''} onChange={e => {
                           const n = [...uForm.points]; n[1].lat = e.target.value; setUForm(p => ({...p, points: n}));
                        }} className="flex-1 p-2 text-xs rounded-lg border bg-white focus:outline-blue-400" />
                        <input type="text" placeholder="Lng" value={uForm.points[1]?.lng || ''} onChange={e => {
                           const n = [...uForm.points]; n[1].lng = e.target.value; setUForm(p => ({...p, points: n}));
                        }} className="flex-1 p-2 text-xs rounded-lg border bg-white focus:outline-blue-400" />
                        <button type="button" onClick={() => getUnifiedGPS(1)} className="px-3 py-2 bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors font-bold rounded-lg text-[10px] shadow-sm">GPS</button>
                     </div>

                     <div className="bg-blue-50/50 p-3 rounded-xl border border-dashed border-blue-200">
                       <p className="text-[10px] text-blue-600 font-bold leading-relaxed">
                         ℹ️ Cukup isi Titik Awal dan Akhir di lapangan. Admin di dashboard dapat menggambar detail lekukan rutenya secara manual melalui <span className="uppercase text-blue-700">Geo-Map &gt; Editor Rute</span> berdasarkan batas titik ini.
                       </p>
                     </div>
                  </div>
                </SurveyInputRow>

                <SurveyInputRow label="Panjang Eks."><input type="text" value={uForm.panjang} onChange={e => setUForm(p => ({ ...p, panjang: e.target.value }))} className="w-full p-3 rounded-xl border bg-slate-50" /></SurveyInputRow>
                <SurveyInputRow label="Lebar Eks."><input type="text" value={uForm.lebar} onChange={e => setUForm(p => ({ ...p, lebar: e.target.value }))} className="w-full p-3 rounded-xl border bg-slate-50" /></SurveyInputRow>
                <SurveyInputRow label="Jenis/Model Eks."><input type="text" value={uForm.jenis_model_awal} onChange={e => setUForm(p => ({ ...p, jenis_model_awal: e.target.value }))} className="w-full p-3 rounded-xl border bg-slate-50" /></SurveyInputRow>
                <SurveyInputRow label="Upload Data Ukur (CSV)"><input type="file" accept=".csv" onChange={e => setUDataUkur(e.target.files[0])} className="w-full p-3 rounded-xl border bg-slate-50 text-xs" /></SurveyInputRow>
                <SurveyInputRow label="Catatan - Kendala - Kondisi"><textarea rows="3" value={uForm.noteDesc} onChange={e => setUForm(p => ({ ...p, noteDesc: e.target.value }))} className="w-full p-3 rounded-xl border bg-slate-50"></textarea></SurveyInputRow>
                <SurveyInputRow label="Dokumentasi Eks.">
                  <input type="file" multiple accept="image/*,video/*" onChange={e => {
                    const files = Array.from(e.target.files);
                    if (files.length > 5) {
                      showMsg("Maksimal 5 file, sisanya diabaikan.", "warning");
                      setUMedia(files.slice(0, 5));
                    } else {
                      setUMedia(files);
                    }
                  }} className="w-full p-3 rounded-xl border bg-slate-50 text-xs" />
                  {uMedia.length > 0 && <div className="text-[10px] mt-1.5 text-blue-600 font-bold">{uMedia.length} file siap diunggah</div>}
                </SurveyInputRow>
                <button type="submit" disabled={isProcessing} className="w-full bg-cyan-600 text-white py-4 rounded-2xl text-sm font-bold uppercase">{isProcessing ? 'Menyimpan...' : 'Simpan Data Survei'}</button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* --- MODAL BARU: UPDATE JALUR REALISASI --- */}
      {showAppendRouteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center z-[1000] p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl relative my-auto">
            <button onClick={() => setShowAppendRouteModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
            <h3 className="text-xl font-black mb-2 text-emerald-600 flex items-center gap-2"><MapPin size={24} strokeWidth={2.5}/> Update Rute (GPS)</h3>
            <p className="text-[10px] font-bold text-slate-500 mb-6 bg-emerald-50 p-3.5 rounded-xl border border-emerald-100 leading-relaxed">
              Gunakan fitur ini di lapangan untuk <b>memperpanjang garis di peta</b> secara otomatis berdasarkan posisi GPS Anda saat ini.
            </p>

            <form onSubmit={handleAppendRouteSubmit} className="space-y-4">
               
               <SurveyInputRow label="Tipe Jalur Target">
                  <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                     <button type="button" onClick={() => { setAppendRouteForm(p => ({ ...p, targetType: 'actual', segmentName: projectData?.actual_segments_data?.[0]?.name || 'Segmen 1' })); setRenameRouteConfig({isEditing:false, newName:''}); setDeleteRouteConfirm(false); }} className={`flex-1 py-2.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all shadow-sm ${appendRouteForm.targetType === 'actual' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}>Realisasi</button>
                     <button type="button" onClick={() => { setAppendRouteForm(p => ({ ...p, targetType: 'plan', segmentName: projectData?.planned_path?.[0]?.name || 'Jalur 1' })); setRenameRouteConfig({isEditing:false, newName:''}); setDeleteRouteConfirm(false); }} className={`flex-1 py-2.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all shadow-sm ${appendRouteForm.targetType === 'plan' ? 'bg-amber-500 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}>Sketsa</button>
                  </div>
               </SurveyInputRow>

               <SurveyInputRow label="Pilih Segmen / Jalur Target">
                  {!renameRouteConfig.isEditing ? (
                     <div className="flex gap-2 items-center">
                        <select value={appendRouteForm.segmentName} onChange={e => setAppendRouteForm(p => ({ ...p, segmentName: e.target.value }))} className="w-full p-3.5 rounded-xl border border-slate-200 bg-white focus:border-emerald-400 outline-none text-sm font-bold text-slate-700">
                           {appendRouteForm.targetType === 'actual' ? (
                              <>
                                 {projectData?.actual_segments_data?.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                 {(!projectData?.actual_segments_data || projectData.actual_segments_data.length === 0) && <option value="Segmen 1">Segmen 1 (Baru)</option>}
                              </>
                           ) : (
                              <>
                                 {projectData?.planned_path?.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                 {(!projectData?.planned_path || projectData.planned_path.length === 0) && <option value="Jalur 1">Jalur 1 (Baru)</option>}
                              </>
                           )}
                        </select>
                        <button type="button" onClick={() => setRenameRouteConfig({ isEditing: true, newName: appendRouteForm.segmentName })} className="p-3.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors shadow-sm shrink-0" title="Edit Nama"><Edit3 size={18} /></button>
                        <button type="button" onClick={() => setDeleteRouteConfirm(true)} className="p-3.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors shadow-sm shrink-0" title="Hapus Segmen"><Trash size={18} /></button>
                     </div>
                  ) : (
                     <div className="flex gap-2 items-center">
                        <input type="text" value={renameRouteConfig.newName} onChange={e => setRenameRouteConfig(p => ({ ...p, newName: e.target.value }))} className="w-full p-3.5 rounded-xl border border-slate-200 bg-white focus:border-blue-400 outline-none text-sm font-bold text-slate-700" autoFocus />
                        <button type="button" onClick={handleRenameRouteTarget} disabled={isProcessing} className="p-3.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-sm shrink-0" title="Simpan"><CheckCircle2 size={18} /></button>
                        <button type="button" onClick={() => setRenameRouteConfig({ isEditing: false, newName: '' })} className="p-3.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors shadow-sm shrink-0" title="Batal"><X size={18} /></button>
                     </div>
                  )}

                  {deleteRouteConfirm && (
                     <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-xl flex flex-col gap-2 animate-in fade-in zoom-in-95 shadow-sm">
                        <span className="text-[10px] font-bold text-rose-600">Yakin ingin menghapus <b>{appendRouteForm.segmentName}</b>? Seluruh titik didalamnya akan ikut terhapus.</span>
                        <div className="flex gap-2">
                           <button type="button" onClick={handleDeleteRouteTarget} disabled={isProcessing} className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 transition-colors text-white text-[10px] font-black rounded-lg shadow-sm">Ya, Hapus</button>
                           <button type="button" onClick={() => setDeleteRouteConfirm(false)} className="flex-1 py-2 bg-white border border-slate-200 hover:bg-slate-100 transition-colors text-slate-700 text-[10px] font-black rounded-lg shadow-sm">Batal</button>
                        </div>
                     </div>
                  )}
               </SurveyInputRow>
               
               <SurveyInputRow label="Kordinat Lokasi Anda">
                  <div className="flex gap-2">
                     <input type="text" placeholder="Latitude" value={appendRouteForm.lat} onChange={e => setAppendRouteForm(p => ({...p, lat: e.target.value}))} className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-mono outline-none focus:border-emerald-400 shadow-inner" required />
                     <input type="text" placeholder="Longitude" value={appendRouteForm.lng} onChange={e => setAppendRouteForm(p => ({...p, lng: e.target.value}))} className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-mono outline-none focus:border-emerald-400 shadow-inner" required />
                  </div>
                  <button type="button" onClick={getAppendGPS} className="w-full mt-3 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-sm border border-emerald-200">
                     <MapPin size={16} /> Kunci Sinyal GPS
                  </button>
               </SurveyInputRow>

               <SurveyInputRow label="Keterangan Rute (Opsional)">
                  <input type="text" value={appendRouteForm.note} onChange={e => setAppendRouteForm(p => ({ ...p, note: e.target.value }))} placeholder="Misal: Pengecoran hari ini sampai titik ini..." className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-sm font-normal outline-none focus:border-emerald-400" />
               </SurveyInputRow>

               <SurveyInputRow label="Dokumentasi Foto Lapangan (Opsional)">
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                     {/* Preview Foto */}
                     {appendRouteFiles && appendRouteFiles.map((file, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl border border-emerald-200 overflow-hidden group bg-white flex items-center justify-center shadow-sm">
                           <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt={`preview-${idx}`} />
                           <button type="button" onClick={() => setAppendRouteFiles(p => p.filter((_, i) => i !== idx))} className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-md shadow-md hover:bg-rose-600 transition-all z-10" title="Hapus Foto">
                               <Trash size={10}/>
                           </button>
                        </div>
                     ))}
                     
                     {/* Tombol Tambah */}
                     <label className="aspect-square rounded-xl border-2 border-dashed border-emerald-300 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all text-emerald-600 bg-white group shadow-sm">
                         <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-full mb-1 group-hover:scale-110 transition-transform">
                             <Plus size={16} />
                         </div>
                         <span className="text-[9px] font-black uppercase mt-0.5">Foto</span>
                         <input
                           type="file"
                           multiple
                           accept="image/*"
                           className="hidden"
                           onChange={(e) => {
                             const files = Array.from(e.target.files);
                             setAppendRouteFiles(prev => [...prev, ...files]);
                             e.target.value = null;
                           }}
                         />
                     </label>
                  </div>
               </SurveyInputRow>

               <button type="submit" disabled={isProcessing} className="w-full bg-emerald-600 text-white py-4 rounded-2xl text-xs font-black tracking-widest uppercase mt-6 hover:bg-emerald-700 shadow-md transition-colors flex justify-center items-center gap-2">
                 {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Save size={16}/>}
                 {isProcessing ? 'Menyimpan...' : 'Simpan Titik Progress'}
               </button>
            </form>
          </div>
        </div>
      )}

      {showSCurveModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setShowSCurveModal(false)} className="absolute top-6 right-6 p-2"><X size={20} /></button>
            <h3 className="text-lg font-black mb-6">Input Data Kurva S</h3>
            <form onSubmit={handleSCurveTextSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold block mb-1">Rencana (%) - pisah dengan strip (-)</label>
                <textarea className="w-full p-4 rounded-2xl border font-mono bg-slate-50 outline-none focus:border-blue-400 text-sm" rows="3" value={sCurveForm.plan} onChange={e => setSCurveForm({ ...sCurveForm, plan: e.target.value })} placeholder="Contoh: 0 - 5.5 - 12 - 25 - 45 - 70 - 100"></textarea>
                {/* Live Preview Label M1, M2 */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {String(sCurveForm.plan || '').split('-').map((val, idx) => val.trim() !== '' ? (
                    <div key={idx} className="text-[9px] font-bold px-2 py-1 rounded-md border bg-blue-50 text-blue-600 border-blue-200">M{idx + 1} <span className="opacity-40 mx-0.5">|</span> {val.trim()}%</div>
                  ) : null)}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold block mb-1">Realisasi (%) - pisah dengan strip (-)</label>
                <textarea className="w-full p-4 rounded-2xl border font-mono bg-slate-50 outline-none focus:border-blue-400 text-sm" rows="3" value={sCurveForm.actual} onChange={e => setSCurveForm({ ...sCurveForm, actual: e.target.value })} placeholder="Contoh: 0 - 6 - 15 - 28"></textarea>
                {/* Live Preview Label M1, M2 */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {String(sCurveForm.actual || '').split('-').map((val, idx) => val.trim() !== '' ? (
                    <div key={idx} className="text-[9px] font-bold px-2 py-1 rounded-md border bg-emerald-50 text-emerald-600 border-emerald-200">M{idx + 1} <span className="opacity-40 mx-0.5">|</span> {val.trim()}%</div>
                  ) : null)}
                </div>
              </div>
              <button type="submit" disabled={isProcessing} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase mt-4 shadow-md">{isProcessing ? 'Proses...' : 'Simpan Kurva'}</button>
            </form>
          </div>
        </div>
      )}

      {showDocModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => { setShowDocModal(false); setDocFile(null); }} className="absolute top-6 right-6 p-2"><X size={20} /></button>
            <h3 className="text-lg font-black mb-6">Upload Dokumen</h3>
            <form onSubmit={handleDocUpload} className="space-y-4">
              <div
                className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer group
                  ${isDraggingDoc ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}
                  ${docFile ? 'border-emerald-500 bg-emerald-50/50' : ''}`}
                onDragOver={handleDragOverDoc}
                onDragLeave={handleDragLeaveDoc}
                onDrop={handleDropDoc}
                onClick={() => docInputRef.current?.click()}
              >
                <input type="file" ref={docInputRef} className="hidden" onChange={(e) => { if (e.target.files && e.target.files.length > 0) setDocFile(e.target.files[0]); }} />
                {docFile ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl mb-3 shadow-sm"><FileText size={28} /></div>
                    <p className="text-sm font-black text-slate-800 line-clamp-1 px-4">{docFile.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-slate-400">Klik untuk mengganti file</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-xl mb-3 transition-colors ${isDraggingDoc ? 'bg-blue-100 text-blue-600 animate-bounce' : 'bg-white shadow-sm border border-slate-200 text-slate-400 group-hover:text-blue-500'}`}><Upload size={28} /></div>
                    <p className="text-sm font-black text-slate-700">Tarik & Lepas File ke Sini</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-slate-400">atau klik untuk mencari</p>
                  </div>
                )}
              </div>
              <div><select className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 font-bold outline-none focus:border-blue-400 transition-colors" value={docUploadCategory} onChange={e => setDocUploadCategory(e.target.value)}>{docCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
              <button type="submit" disabled={isProcessing} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest mt-2 hover:bg-blue-700 transition-colors shadow-md">{isProcessing ? 'Mengunggah...' : 'Simpan Dokumen'}</button>
            </form>
          </div>
        </div>
      )}

      {/* POP-UP MODAL DETAIL LOG AKTIVITAS */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[5000] p-4 md:p-8" onClick={() => setSelectedLog(null)}>
          <div className="bg-white rounded-[32px] w-full max-w-3xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <div>
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  {selectedLog.is_problem ? <AlertCircle className="text-rose-500" /> : <Activity className="text-blue-500" />}
                  {selectedLog.title}
                </h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                  <Clock size={12} /> {new Date(selectedLog.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })} WIB
                </p>
              </div>
              <button onClick={() => setSelectedLog(null)} className="p-2 bg-white rounded-full hover:bg-rose-50 hover:text-rose-500 transition-colors border border-slate-200 shadow-sm"><X size={20} /></button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium mb-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                {selectedLog.description}
              </div>
              {selectedLog.media_url && (
                <div className="mt-4">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest border-b border-slate-100 pb-2">Lampiran Media</h4>
                  {renderMediaContent(selectedLog.media_url)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCategoryManager && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setShowCategoryManager(false)} className="absolute top-6 right-6 p-2"><X size={20} /></button>
            <h3 className="text-lg font-black mb-6">Manajemen Kategori</h3>
            <div className="flex gap-2 mb-6">
              <input type="text" placeholder="Kategori Baru..." className="flex-1 p-3 rounded-xl border bg-slate-50" value={newCatName} onChange={e => setNewCatName(e.target.value)} />
              <button onClick={() => {
                if (newCatName.trim() && !docCategories.includes(newCatName.trim())) {
                  const newCats = [...docCategories, newCatName.trim()];
                  setDocCategories(newCats);
                  if (projectData) supabaseClient.from('projects').update({ doc_categories: newCats }).eq('id', projectData.id).then();
                  setNewCatName('');
                }
              }} className="px-4 bg-slate-800 text-white font-bold rounded-xl">Add</button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {docCategories.map((cat, idx) => (
                <div key={cat} draggable onDragStart={(e) => handleDragStart(e, idx)} onDragOver={(e) => handleDragOver(e, idx)} onDragEnd={handleDragEnd} className="flex justify-between p-3 border rounded-xl bg-white">
                  <span className="font-bold text-xs">{cat}</span>
                  <button onClick={() => {
                    const newCats = docCategories.filter(c => c !== cat);
                    setDocCategories(newCats);
                    if (projectData) supabaseClient.from('projects').update({ doc_categories: newCats }).eq('id', projectData.id).then();
                  }} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"><Trash size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {moveDocConfig && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl relative text-center">
            <h3 className="text-lg font-black mb-4">Pindah Kategori</h3>
            <select className="w-full p-3 rounded-xl border bg-slate-50 mb-6" value={moveDocConfig.newCategory || moveDocConfig.category} onChange={e => setMoveDocConfig({ ...moveDocConfig, newCategory: e.target.value })}>
              {docCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <div className="flex gap-3">
              <button onClick={() => setMoveDocConfig(null)} className="flex-1 py-3 bg-slate-100 rounded-xl">Batal</button>
              <button onClick={handleMoveDocument} disabled={isProcessing} className="flex-1 py-3 bg-blue-600 text-white rounded-xl">Pindahkan</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfig && deleteConfig.type !== 'employee' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative text-center">
            <div className="mx-auto w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-5"><AlertCircle size={28} /></div>
            <h3 className="text-xl font-black mb-2 text-slate-800">
               {deleteConfig.type === 'project' ? 'Hapus Proyek?' : 'Apakah Anda Yakin?'}
            </h3>
            <p className={`text-xs mb-8 font-medium leading-relaxed ${deleteConfig.type === 'project' ? 'text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100' : 'text-slate-500'}`}>
               {deleteConfig.type === 'project' ? (
                   <>Kamar proyek <b>{deleteConfig.name}</b> dan seluruh data didalamnya akan dihapus permanen!</>
               ) : (
                   'Data atau foto ini akan dihapus secara permanen dan tidak dapat dikembalikan lagi.'
               )}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfig(null)} className="flex-1 py-3.5 bg-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">Batal</button>
              <button onClick={confirmDeleteData} disabled={isProcessing} className="flex-1 py-3.5 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors shadow-md">{isProcessing ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Ya, Hapus'}</button>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL REKAP MODAL */}
      {renderGlobalRekapModal()}

    </div>
  );
}
