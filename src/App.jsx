import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Camera, LogOut, CheckCircle2, AlertCircle, 
  Clock, Send, ChevronLeft, Loader2, UserCircle, Plus, Video, Trash2, UserCheck, Map,
  Info, Cloud, X, UploadCloud, FileText, Calendar, Thermometer, Zap, Navigation
} from 'lucide-react';

// --- KONFIGURASI SUPABASE ---
const SUPABASE_URL = 'https://hnxomovcwwjbtirupnao.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhueG9tb3Zjd3dqYnRpcnVwbmFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTQzMDEsImV4cCI6MjA5MzQ5MDMwMX0.TTqrps9cuHfJKNS-fHNjmrX1nza7Ktp-wDfbIi8Jhlk';

// --- TEMPLATE DEFAULT RINCIAN PEKERJAAN STANDAR (HARDCODED) ---
const DEFAULT_AKTIVITAS = [
  { nama: 'Pek. Galian Tanah', kemarin: '', hariIni: '', satuan: 'm³' },
  { nama: 'Pek. Pasang U-Ditch', kemarin: '', hariIni: '', satuan: 'm' },
  { nama: 'Pek. Cover U-Ditch', kemarin: '', hariIni: '', satuan: 'unit' },
  { nama: 'Pek. Cor Beton K-250', kemarin: '', hariIni: '', satuan: 'm³' },
  { nama: 'Pek. Bekisting', kemarin: '', hariIni: '', satuan: 'm²' },
  { nama: 'Pek. Pembesian', kemarin: '', hariIni: '', satuan: 'kg' },
  { nama: 'Pek. Pasangan Batu', kemarin: '', hariIni: '', satuan: 'm³' },
  { nama: 'Pek. Plesteran + Acian', kemarin: '', hariIni: '', satuan: 'm²' },
  { nama: 'Pek. Timbunan Tanah Kembali', kemarin: '', hariIni: '', satuan: 'm³' }
];

const DEFAULT_TENAGA_KERJA = [
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

// --- HELPER: KOMPRESI GAMBAR CLIENT-SIDE ---
const compressImage = async (file) => {
  if (!file.type.startsWith('image/')) return file; // Jangan kompres video
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 1280;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: file.type, lastModified: Date.now() }));
        }, file.type, 0.75); // Kompresi kualitas 75%
      };
    };
  });
};

// --- HELPER PARSER TEMPLATE DARI COMMAND CENTER ---
const getInitialFormState = (project, currentDate) => {
  let newLokasi = project?.pekerjaan || '';
  let newShifts = [{ id: Date.now(), tanggalMulai: currentDate, jamMulai: '08:00', tanggalSelesai: currentDate, jamSelesai: '17:00' }];
  let newAktivitas = DEFAULT_AKTIVITAS.map(item => ({ ...item }));
  let newTenagaKerja = DEFAULT_TENAGA_KERJA.map(item => ({ ...item }));

  if (!project) return { lokasi: newLokasi, shifts: newShifts, aktivitas: newAktivitas, tenagaKerja: newTenagaKerja };

  let rawData = project.report_template_data;
  if (typeof rawData === 'string') {
    try { rawData = JSON.parse(rawData); } catch (e) { rawData = null; }
  }

  if (rawData && !Array.isArray(rawData) && typeof rawData === 'object') {
    if (rawData.lokasi) newLokasi = rawData.lokasi;
    
    if (rawData.shifts && Array.isArray(rawData.shifts) && rawData.shifts.length > 0) {
      newShifts = rawData.shifts.map(s => ({
        id: s.id || Date.now() + Math.random(),
        tanggalMulai: currentDate, jamMulai: s.jamMulai || '08:00',
        tanggalSelesai: currentDate, jamSelesai: s.jamSelesai || '17:00'
      }));
    }
    
    if (rawData.aktivitas && Array.isArray(rawData.aktivitas) && rawData.aktivitas.length > 0) {
      newAktivitas = rawData.aktivitas.map(item => ({
        nama: item.nama || '', kemarin: '', hariIni: '', satuan: item.satuan || ''
      })).filter(a => a.nama.trim() !== '');
    }
    
    // Konversi JSON Array Tenaga Kerja dari template
    if (rawData.tenagaKerja && Array.isArray(rawData.tenagaKerja) && rawData.tenagaKerja.length > 0) {
      const templateTk = rawData.tenagaKerja
        .map(tk => ({ posisi: tk.posisi || '', jumlah: '' }))
        .filter(tk => tk.posisi.trim() !== '');

      const mergedTk = [...templateTk];
      DEFAULT_TENAGA_KERJA.forEach(defTk => {
        if (!mergedTk.find(tk => tk.posisi.toLowerCase() === defTk.posisi.toLowerCase())) {
           mergedTk.push({ posisi: defTk.posisi, jumlah: '' });
        }
      });
      newTenagaKerja = mergedTk;
    }
  } else if (rawData && Array.isArray(rawData) && rawData.length > 0) {
    newAktivitas = rawData.map(item => ({
      nama: item.nama || '', kemarin: '', hariIni: '', satuan: item.satuan || ''
    })).filter(a => a.nama.trim() !== '');
  }

  if (newAktivitas.length === 0) newAktivitas = DEFAULT_AKTIVITAS.map(item => ({ ...item }));
  if (newTenagaKerja.length === 0) newTenagaKerja = DEFAULT_TENAGA_KERJA.map(item => ({ ...item }));

  return { lokasi: newLokasi, shifts: newShifts, aktivitas: newAktivitas, tenagaKerja: newTenagaKerja };
};

// --- HELPER COMPONENT (SURVEI) ---
const SurveyInputRow = ({ label, children }) => (
  <div className="w-full">
    <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-500">{label}</label>
    {children}
  </div>
);

export default function EmployeeApp() {
  const [supabase, setSupabase] = useState(null);
  const [view, setView] = useState('login'); 
  const [user, setUser] = useState(null);
  
  const [projects, setProjects] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState(null);

  // State untuk Absensi & Proyek
  const [closestProject, setClosestProject] = useState(null);
  const [locationType, setLocationType] = useState('Proyek'); 
  const [attendanceMode, setAttendanceMode] = useState('Hadir'); 
  const [absenReceipt, setAbsenReceipt] = useState(null);
  const [absenCatatan, setAbsenCatatan] = useState(''); 

  // State untuk Form Laporan Harian Lengkap
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
    cuaca: {},
    aktivitas: DEFAULT_AKTIVITAS.map(item => ({ ...item })), 
    tenagaKerja: DEFAULT_TENAGA_KERJA.map(item => ({ ...item })),
    catatan: ''
  });
  const [repFiles, setRepFiles] = useState([]);

  // State Konfirmasi Hapus Baris di Form Laporan
  const [confirmDeleteFormItem, setConfirmDeleteFormItem] = useState(null);

  // State Lapor Lapangan (Cepat)
  const [laporTab, setLaporTab] = useState('harian'); 
  const [lapanganCatatan, setLapanganCatatan] = useState('');
  const [lapanganFiles, setLapanganFiles] = useState([]);

  // --- STATE UNTUK FORM INPUT SURVEI ---
  const [uForm, setUForm] = useState({ 
    tanggal: new Date().toISOString().split('T')[0], 
    namaSegmen: '', startLat: '', startLng: '', endLat: '', endLng: '', 
    panjang: '', lebar: '', jenis_model_awal: '', noteDesc: '' 
  });
  const [uMedia, setUMedia] = useState([]);
  const [uDataUkur, setUDataUkur] = useState(null);

  // --- STATE UNTUK FORM UPDATE RUTE GPS ---
  const [ruteForm, setRuteForm] = useState({
    type: 'realisasi', // 'realisasi' atau 'sketsa'
    segmentName: '',   // Nama segmen yang dipilih atau 'NEW'
    newSegmentName: '',// Input jika segmentName === 'NEW'
    lat: '',
    lng: '',
    notes: ''
  });
  const [ruteFiles, setRuteFiles] = useState([]);
  const [existingSegments, setExistingSegments] = useState([]);

  // --- STATE UNTUK LOGIN ---
  const [loginForm, setLoginForm] = useState({ id: '', pin: '' });

  // --- EFEK PERTAMA: LOAD SUPABASE, PDF CDN, DAN FIX VIEWPORT MOBILE ---
  useEffect(() => {
    // 0. FIX VIEWPORT UNTUK MENGHINDARI TAMPILAN MENGECIL DI HP
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);
    }

    // 1. Supabase Init
    if (!window.supabase) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = () => {
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        setSupabase(client);
      };
      document.head.appendChild(script);
    } else {
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      setSupabase(client);
    }

    // 2. Load jsPDF & html2canvas untuk Cetak PDF
    const loadScript = (id, src) => {
      if (!document.getElementById(id)) {
        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        document.head.appendChild(script);
      }
    };
    loadScript('html2canvas-script', 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    loadScript('jspdf-script', 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

  }, []);

  const fetchProjects = async (client) => {
    try {
      let { data, error } = await client.from('projects').select('id, pekerjaan, report_template_data');
      
      if (error) throw error;

      if (!data || data.length === 0) {
         setProjects([]);
      } else {
         data = data.map(p => ({
             ...p,
             pekerjaan: p.pekerjaan || p.nama_proyek || p.nama || p.title || p.name || 'Proyek Tanpa Nama'
         }));
         setProjects(data);
      }
    } catch (e) {
      console.error("Fetch projects error:", e);
      showMsg('Gagal memuat daftar proyek dari server', 'error');
    }
  };

  // --- EFEK SAAT PROYEK DIPILIH ATAU MASUK HALAMAN LAPOR ---
  useEffect(() => {
    if (closestProject && supabase) {
      const fetchTemplateData = async () => {
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('report_template_data')
            .eq('id', closestProject.id)
            .single();
          
          let templateData = closestProject.report_template_data;
          if (!error && data) {
            templateData = data.report_template_data;
          }

          const initialData = getInitialFormState({ ...closestProject, report_template_data: templateData }, dailyReportForm.tanggal);
          
          setDailyReportForm(prev => ({
            ...prev,
            lokasi: initialData.lokasi,
            shifts: initialData.shifts,
            aktivitas: initialData.aktivitas,
            tenagaKerja: initialData.tenagaKerja 
          }));
        } catch (err) {
          console.error("Gagal mengambil template laporan:", err);
        }
      };
      fetchTemplateData();
    }
  }, [closestProject?.id, view === 'lapor', supabase]);

  // --- EFEK AUTO-GENERATE CUACA PER 1 JAM BERDASARKAN SHIFT ---
  useEffect(() => {
    if (!dailyReportForm.shifts || dailyReportForm.shifts.length === 0) return;

    const newCuaca = {};
    const maxSlots = 96; 
    let slotsCount = 0;
    const timeSlots = [];

    dailyReportForm.shifts.forEach(shift => {
      const tglMulai = shift.tanggalMulai;
      const jmMulai = shift.jamMulai;
      const tglSelesai = shift.tanggalSelesai || tglMulai;
      const jmSelesai = shift.jamSelesai;

      if (!tglMulai || !jmMulai || !tglSelesai || !jmSelesai) return;

      const startStr = `${tglMulai.replace(/-/g, '/')} ${jmMulai}`;
      const endStr = `${tglSelesai.replace(/-/g, '/')} ${jmSelesai}`;

      const start = new Date(startStr);
      const end = new Date(endStr);

      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) return;

      let current = new Date(start);
      while (current < end && slotsCount < maxSlots) {
        let next = new Date(current);
        // DIUBAH: Interval cuaca menjadi kelipatan 1 Jam (60 menit) agar sesuai standar Command Center
        next.setMinutes(current.getMinutes() + 60); 
        if (next > end) next = new Date(end);

        timeSlots.push({ start: new Date(current), end: new Date(next) });
        current = next;
        slotsCount++;
      }
    });

    timeSlots.sort((a, b) => a.start.getTime() - b.start.getTime());

    const formatTimeSafe = (d) => {
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      return `${h}.${m}`;
    };

    const uniqueKeys = new Set();
    timeSlots.forEach(slot => {
      const key = `${formatTimeSafe(slot.start)} - ${formatTimeSafe(slot.end)}`;
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        newCuaca[key] = dailyReportForm.cuaca?.[key] || 'Cerah'; 
      }
    });

    const oldKeys = Object.keys(dailyReportForm.cuaca || {}).join(',');
    const newKeys = Object.keys(newCuaca).join(',');

    if (oldKeys !== newKeys && Object.keys(newCuaca).length > 0) {
      setDailyReportForm(prev => ({ ...prev, cuaca: newCuaca }));
    }
  }, [JSON.stringify(dailyReportForm.shifts)]); 

  // --- EFEK KHUSUS FITUR UPDATE RUTE ---
  useEffect(() => {
    if (view === 'rute_gps' && closestProject && supabase) {
       const loadSegments = async () => {
         try {
           const col = ruteForm.type === 'realisasi' ? 'actual_segments_data' : 'planned_path';
           const { data, error } = await supabase.from('projects').select(col).eq('id', closestProject.id).single();
           
           if (!error && data) {
              let parsedData = data[col];
              if (typeof parsedData === 'string') {
                 try { parsedData = JSON.parse(parsedData); } catch(e){ parsedData = []; }
              }
              if (Array.isArray(parsedData)) {
                 const names = parsedData.map(s => s.name || s.id).filter(Boolean);
                 setExistingSegments([...new Set(names)]); // Hapus duplikat nama
                 if (names.length > 0 && !ruteForm.segmentName) {
                     setRuteForm(prev => ({ ...prev, segmentName: names[0] }));
                 }
              } else {
                 setExistingSegments([]);
              }
           }
         } catch (err) {
           console.error("Gagal memuat daftar segmen rute:", err);
         }
       };
       loadSegments();
    }
  }, [view, closestProject?.id, ruteForm.type, supabase]);

  const updateShift = (index, field, value) => {
    const newShifts = [...dailyReportForm.shifts];
    newShifts[index][field] = value;

    const shift = newShifts[index];
    if (field === 'jamMulai' || field === 'jamSelesai' || field === 'tanggalMulai') {
      if (shift.jamMulai && shift.jamSelesai && shift.tanggalMulai) {
        if (shift.jamSelesai < shift.jamMulai) {
          const startDate = new Date(shift.tanggalMulai);
          startDate.setDate(startDate.getDate() + 1);
          shift.tanggalSelesai = startDate.toISOString().split('T')[0];
        } else {
          shift.tanggalSelesai = shift.tanggalMulai;
        }
      }
    }

    setDailyReportForm({ ...dailyReportForm, shifts: newShifts });
  };
  const addShift = () => {
    setDailyReportForm({ 
      ...dailyReportForm, 
      shifts: [...dailyReportForm.shifts, { id: Date.now(), tanggalMulai: dailyReportForm.tanggal, jamMulai: '08:00', tanggalSelesai: dailyReportForm.tanggal, jamSelesai: '17:00' }] 
    });
  };

  const addAktivitasRow = () => {
    setDailyReportForm(prev => ({
      ...prev,
      aktivitas: [...prev.aktivitas, { nama: '', kemarin: '', hariIni: '', satuan: '' }]
    }));
  };

  const addTenagaKerjaRow = () => {
    setDailyReportForm(prev => ({
      ...prev,
      tenagaKerja: [...prev.tenagaKerja, { posisi: '', jumlah: '' }]
    }));
  };

  const showMsg = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const executeDeleteFormItem = () => {
    if (!confirmDeleteFormItem) return;
    const { type, index } = confirmDeleteFormItem;

    setDailyReportForm(prev => {
      const newState = { ...prev };
      if (type === 'shift') {
        newState.shifts = newState.shifts.filter((_, i) => i !== index);
      } else if (type === 'aktivitas') {
        newState.aktivitas = newState.aktivitas.filter((_, i) => i !== index);
      } else if (type === 'tenagaKerja') {
        newState.tenagaKerja = newState.tenagaKerja.filter((_, i) => i !== index);
      }
      return newState;
    });
    setConfirmDeleteFormItem(null);
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProjects([]);
    setView('login');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const inputId = loginForm.id.trim().toLowerCase();
      const inputPin = loginForm.pin.trim();
      
      const emailDummy = `${inputId}@karyawan.com`;

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailDummy,
        password: inputPin
      });

      if (authError) {
        showMsg('Login Gagal: ID Karyawan atau PIN salah!', 'error');
        setIsProcessing(false);
        return;
      }

      let userName = inputId;
      let userRole = 'Pelaksana';
      
      const { data: empData, error: empError } = await supabase.from('karyawan').select('*');
      
      if (!empError && empData && empData.length > 0) {
        const foundUser = empData.find(emp => {
          return Object.values(emp).some(val => 
            val !== null && val !== undefined && String(val).toLowerCase() === inputId
          );
        });

        if (foundUser) {
          userName = foundUser.nama || foundUser.nama_lengkap || foundUser.name || foundUser.id_karyawan || inputId;
          userRole = foundUser.jabatan || foundUser.role || foundUser.posisi || 'Pelaksana';
        }
      }

      setUser({
        name: userName,
        role: userRole,
        id: inputId,
        uid: authData.user.id
      });
      
      await fetchProjects(supabase);

      setView('home');
      showMsg('Selamat bekerja!', 'success');
    } catch (error) {
      showMsg('Terjadi kesalahan jaringan!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const getUnifiedGPS = (type) => {
    if (!navigator.geolocation) {
      showMsg('Geolokasi tidak didukung perangkat ini.', 'error');
      return;
    }
    showMsg('Sedang mencari koordinat GPS...', 'info');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        if (type === 'rute') {
           setRuteForm(p => ({ ...p, lat, lng }));
        } else {
           setUForm(p => ({
             ...p,
             [type === 'start' ? 'startLat' : 'endLat']: lat,
             [type === 'start' ? 'startLng' : 'endLng']: lng
           }));
        }
        showMsg('Koordinat GPS berhasil dikunci!', 'success');
      },
      (error) => {
        showMsg('Gagal mengambil GPS: ' + error.message, 'error');
      },
      { enableHighAccuracy: true }
    );
  };

  const generateDailyReportReceipt = async (reportData, projectData, reporterName) => {
    if (!window.jspdf || !window.html2canvas) {
      console.warn("Library PDF belum siap, silakan coba lagi.");
      return;
    }

    const { jsPDF } = window.jspdf;

    let waktuStrPDF = '-';
    if (reportData.shifts && reportData.shifts.length > 0) {
        waktuStrPDF = reportData.shifts.map((s) => {
            if (s.tanggalMulai === s.tanggalSelesai) {
                return `${s.tanggalMulai} (${s.jamMulai} - ${s.jamSelesai})`;
            } else {
                return `${s.tanggalMulai} (${s.jamMulai}) - ${s.tanggalSelesai} (${s.jamSelesai})`;
            }
        }).join('<br/>');
    }

    const aktivitasTerisi = reportData.aktivitas.filter(act => 
       (act.kemarin && act.kemarin.toString().trim() !== '0' && act.kemarin.toString().trim() !== '') || 
       (act.hariIni && act.hariIni.toString().trim() !== '0' && act.hariIni.toString().trim() !== '') ||
       (act.nama && act.nama.trim() !== '') 
    ).filter(act => act.nama && act.nama.trim() !== '');

    const aktivitasRows = aktivitasTerisi.map((act, i) => {
      const k = parseFloat(act.kemarin) || 0;
      const h = parseFloat(act.hariIni) || 0;
      return `<tr>
        <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center;">${i + 1}</td>
        <td style="padding: 6px; border: 1px solid #cbd5e1;">${act.nama}</td>
        <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center;">${k}</td>
        <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center;">${h}</td>
        <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${k + h}</td>
        <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center;">${act.satuan}</td>
      </tr>`;
    }).join('');

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
    
    const tkTerisi = Array.isArray(reportData.tenagaKerja) 
       ? reportData.tenagaKerja.filter(tk => tk.posisi && tk.posisi.trim() !== '') 
       : [];
    const halfTk = Math.ceil(tkTerisi.length / 2);
    const tkLeft = tkTerisi.slice(0, halfTk);
    const tkRight = tkTerisi.slice(halfTk);

    let tkRows2Col = '';
    for (let i = 0; i < tkLeft.length; i++) {
      const posL = tkLeft[i].posisi;
      const countL = parseInt(tkLeft[i].jumlah) || 0;
      const posR = tkRight[i] ? tkRight[i].posisi : '';
      const countR = tkRight[i] ? (parseInt(tkRight[i].jumlah) || 0) : '';
      
      tkRows2Col += `<tr>
        <td style="padding: 4px 6px; border: 1px solid #cbd5e1;">${posL}</td>
        <td style="padding: 4px 6px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${countL} Orang</td>
        <td style="padding: 4px 6px; border: 1px solid #cbd5e1;">${posR}</td>
        <td style="padding: 4px 6px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${posR ? countR + ' Orang' : ''}</td>
      </tr>`;
    }

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
            <td style="font-weight: bold; vertical-align: top;">Lokasi</td><td style="vertical-align: top;">: ${reportData.lokasi}</td>
          </tr>
        </table>

        <h3 style="font-size: 14px; background-color: #f8fafc; padding: 6px 10px; margin: 15px 0 10px 0; border-left: 4px solid #3b82f6;">B. KONDISI CUACA</h3>
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

        <h3 style="font-size: 14px; background-color: #f8fafc; padding: 6px 10px; margin: 15px 0 10px 0; border-left: 4px solid #3b82f6;">C. AKTIVITAS PEKERJAAN</h3>
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

        <h3 style="font-size: 14px; background-color: #f8fafc; padding: 6px 10px; margin: 15px 0 10px 0; border-left: 4px solid #3b82f6;">D. JUMLAH TENAGA KERJA</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 15px;">
          <tr style="background-color: #e2e8f0;">
            <th style="padding: 4px; border: 1px solid #cbd5e1; width: 35%;">Posisi / Jabatan</th>
            <th style="padding: 4px; border: 1px solid #cbd5e1; width: 15%;">Jumlah</th>
            <th style="padding: 4px; border: 1px solid #cbd5e1; width: 35%;">Posisi / Jabatan</th>
            <th style="padding: 4px; border: 1px solid #cbd5e1; width: 15%;">Jumlah</th>
          </tr>
          ${tkRows2Col || `<tr><td colspan="4" style="padding: 10px; border: 1px solid #cbd5e1; text-align: center; color: #64748b;">Belum ada daftar tenaga kerja</td></tr>`}
        </table>

        <h3 style="font-size: 14px; background-color: #f8fafc; padding: 6px 10px; margin: 15px 0 10px 0; border-left: 4px solid #3b82f6;">E. CATATAN / KENDALA</h3>
        <div style="border: 1px solid #cbd5e1; padding: 15px; font-size: 12px; min-height: 60px; background-color: #f8fafc;">
          ${reportData.catatan ? reportData.catatan.replace(/\n/g, '<br/>') : '<i>Tidak ada catatan atau kendala.</i>'}
        </div>
        
        <div style="margin-top: 25px; text-align: right; padding-right: 20px;">
            <p style="margin: 0; font-size: 12px;">Dilaporkan Oleh,</p>
            <p style="margin: 0; font-weight: bold; text-decoration: underline;">${reporterName}</p>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    try {
      await new Promise(r => setTimeout(r, 500));
      const canvas = await window.html2canvas(container, { scale: 2, useCORS: true, logging: false });
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

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', xOffset, marginTop, pdfWidth, pdfHeight);
      
      pdf.save(`Laporan_Harian_${reporterName.replace(/\s+/g, '_')}_${reportData.tanggal}.pdf`);
    } catch (err) {
      showMsg("Laporan terkirim, namun gagal mengunduh PDF.", "error");
    } finally {
      document.body.removeChild(container);
    }
  };

  const handleAbsenSubmit = async (e, typeSubmit) => {
    e.preventDefault();
    
    if (typeSubmit === 'Izin' || typeSubmit === 'Sakit') {
        if (!absenCatatan.trim()) {
            showMsg(`Mohon isi kolom keterangan untuk ${typeSubmit} terlebih dahulu`, 'error');
            return;
        }
    } else {
        if (locationType === 'Proyek' && !closestProject) {
            showMsg('Pilih proyek terlebih dahulu', 'error'); 
            return;
        }
    }

    setIsProcessing(true);
    try {
      showMsg('Memverifikasi waktu server...', 'info');
      
      let now = new Date();
      try {
        const timeRes = await fetch('https://worldtimeapi.org/api/timezone/Asia/Makassar');
        if (timeRes.ok) {
          const timeData = await timeRes.json();
          now = new Date(timeData.datetime);
        }
      } catch (timeErr) {
        console.warn("Gagal terhubung ke server waktu internet, fallback ke waktu lokal.", timeErr);
      }

      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      let locName = '-';
      let locTypeLabel = '-';
      let statusKehadiran = '';
      let finalStatus = '';

      if (typeSubmit === 'Izin' || typeSubmit === 'Sakit') {
          locTypeLabel = typeSubmit;
          locName = 'Tidak Hadir';
          statusKehadiran = typeSubmit;
          finalStatus = `${typeSubmit} - ${absenCatatan}`; 
      } else {
          locName = locationType === 'Kantor' ? 'Kantor' : closestProject.pekerjaan;
          locTypeLabel = locationType === 'Kantor' ? 'Kantor' : 'Proyek';
          
          if (typeSubmit === 'Masuk') {
              if (hours < 9) {
                  statusKehadiran = 'Lebih Awal';
              } else if (hours === 9 && minutes <= 30) {
                  statusKehadiran = 'Tepat Waktu';
              } else {
                  statusKehadiran = 'Terlambat';
              }
          } else if (typeSubmit === 'Pulang') {
              if (hours < 17) {
                  statusKehadiran = 'Lebih Awal';
              } else {
                  statusKehadiran = 'Tepat Waktu'; 
              }
          }
          finalStatus = `${typeSubmit} - ${statusKehadiran}`;
      }

      const absenData = {
          project_id: (typeSubmit === 'Masuk' || typeSubmit === 'Pulang') && locationType === 'Proyek' ? closestProject.id : null,
          employee_name: user.name,
          role: user.role,
          location_type: locTypeLabel,
          location_name: locName, 
          latitude: 0,
          longitude: 0,
          status: finalStatus 
      };

      if (typeSubmit === 'Masuk' || typeSubmit === 'Izin' || typeSubmit === 'Sakit') {
          absenData.check_in_time = now.toISOString(); 

          const { error } = await supabase.from('attendances').insert([absenData]);
          if (error) throw error;
          showMsg(`Absen ${typeSubmit} Berhasil Direkam!`, 'success');

      } else if (typeSubmit === 'Pulang') {
          const startOfDay = new Date(now);
          startOfDay.setHours(0, 0, 0, 0);
          
          const endOfDay = new Date(now);
          endOfDay.setHours(23, 59, 59, 999);

          const { data: existingRecords, error: fetchError } = await supabase
              .from('attendances')
              .select('id')
              .eq('employee_name', user.name)
              .gte('check_in_time', startOfDay.toISOString()) 
              .lte('check_in_time', endOfDay.toISOString()) 
              .order('check_in_time', { ascending: false }) 
              .limit(1);

          if (fetchError) throw fetchError;

          if (!existingRecords || existingRecords.length === 0) {
              showMsg('Gagal: Anda belum melakukan Absen Masuk hari ini!', 'error');
              setIsProcessing(false);
              return;
          }

          const recordId = existingRecords[0].id;
          absenData.check_out_time = now.toISOString(); 

          const { error: updateError } = await supabase
              .from('attendances')
              .update(absenData)
              .eq('id', recordId);

          if (updateError) throw updateError;
          showMsg('Absen Pulang Berhasil Diperbarui!', 'success');
      }
      
      setAbsenReceipt({
          name: user.name, 
          time: now.toLocaleString('id-ID') + ' WITA',
          location: typeSubmit === 'Izin' || typeSubmit === 'Sakit' ? absenCatatan : locName, 
          type: locTypeLabel, 
          absenType: typeSubmit, 
          status: statusKehadiran
      });
      setAbsenCatatan(''); 
      setView('absen_success');
    } catch (e) {
      showMsg('Gagal absen: ' + e.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!closestProject) { showMsg('Pilih proyek terlebih dahulu', 'error'); return; }
    
    setIsProcessing(true);
    try {
      let publicUrls = [];
      if (repFiles && repFiles.length > 0) {
        showMsg(`Mengunggah ${repFiles.length} lampiran...`, 'info');
        for (const file of repFiles) {
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_report.${file.name.split('.').pop()}`;
          await supabase.storage.from('project-media').upload(`reports/${fileName}`, file);
          const { data } = supabase.storage.from('project-media').getPublicUrl(`reports/${fileName}`);
          publicUrls.push(data.publicUrl);
        }
      }

      const formState = dailyReportForm;
      const cuacaStr = Object.entries(formState.cuaca).map(([jam, kondisi]) => `${jam} : ${kondisi}`).join('\n');

      const aktivStr = formState.aktivitas
        .filter(a => a.kemarin !== '' || a.hariIni !== '') 
        .map(a => {
          const tot = (parseFloat(a.kemarin) || 0) + (parseFloat(a.hariIni) || 0);
          return `- ${a.nama} : Kemarin=${a.kemarin || 0}, Hari Ini=${a.hariIni || 0}, Total=${tot} ${a.satuan || ''}`;
        }).join('\n');

      const tkStr = Array.isArray(formState.tenagaKerja)
        ? formState.tenagaKerja
            .filter(tk => tk.posisi && tk.posisi.trim() !== '')
            .map(tk => `- ${tk.posisi}: ${parseInt(tk.jumlah) || 0} org`)
            .join('\n')
        : '-';

      let waktuStr = '';
      if (formState.shifts && formState.shifts.length > 0) {
          waktuStr = formState.shifts.map((s) => {
              if (s.tanggalMulai === s.tanggalSelesai) {
                  return `${s.tanggalMulai} (${s.jamMulai} - ${s.jamSelesai})`;
              } else {
                  return `${s.tanggalMulai} (${s.jamMulai}) - ${s.tanggalSelesai} (${s.jamSelesai})`;
              }
          }).join('\n');
      }

      const reportContent = `📋 LAPORAN HARIAN\nTanggal: ${formState.tanggal}\nLokasi: ${formState.lokasi || '-'}\nWaktu:\n${waktuStr}\n\n🌤️ KONDISI CUACA:\n${cuacaStr}\n\n👷 TENAGA KERJA:\n${tkStr || '-'}\n\n🚧 AKTIVITAS PEKERJAAN:\n${aktivStr || '-'}\n\n📝 CATATAN / KENDALA / SARAN:\n${formState.catatan || '-'}`;

      const isProblem = !!formState.catatan && formState.catatan.toLowerCase().includes('kendala');
      
      const mediaUrlString = publicUrls.length > 0 ? publicUrls.join(',') : null;

      const { error } = await supabase.from('field_reports').insert([{ 
          project_id: closestProject.id, 
          title: 'Laporan Harian', 
          description: reportContent, 
          media_url: mediaUrlString,
          is_problem: isProblem
      }]);

      if (error) throw error;
      
      try {
         const templateBaru = {
             lokasi: formState.lokasi,
             shifts: formState.shifts.map(s => ({ id: s.id, tanggalMulai: s.tanggalMulai, jamMulai: s.jamMulai, tanggalSelesai: s.tanggalSelesai, jamSelesai: s.jamSelesai })),
             aktivitas: formState.aktivitas
                 .filter(a => a.nama && a.nama.trim() !== '')
                 .map(a => ({ nama: a.nama, satuan: a.satuan || '' })),
             tenagaKerja: formState.tenagaKerja
                 .filter(tk => tk.posisi && tk.posisi.trim() !== '')
                 .map(tk => ({ posisi: tk.posisi, jumlah: "" }))
         };
         
         const { error: templateErr } = await supabase
           .from('projects')
           .update({ report_template_data: templateBaru })
           .eq('id', closestProject.id);
         
         if (!templateErr) {
            closestProject.report_template_data = templateBaru; 
         }
      } catch (errTemplate) {
         console.warn("Gagal memperbarui template: ", errTemplate);
      }
      
      showMsg('Laporan Harian Berhasil Terkirim! Mengunduh PDF...', 'success');
      
      await generateDailyReportReceipt(dailyReportForm, closestProject, user.name);
      
      const today = new Date().toISOString().split('T')[0];
      const initialData = getInitialFormState(closestProject, today);
      
      setDailyReportForm(p => ({
        ...p,
        tanggal: today,
        lokasi: initialData.lokasi,
        shifts: initialData.shifts,
        cuaca: {}, 
        aktivitas: initialData.aktivitas,
        tenagaKerja: initialData.tenagaKerja,
        catatan: ''
      }));
      setRepFiles([]);
      setClosestProject({...closestProject});
      
      setTimeout(() => setView('home'), 2000);
    } catch (e) {
      showMsg('Gagal mengirim laporan: ' + e.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLaporLapanganSubmit = async (e) => {
    e.preventDefault();
    if (!closestProject) { showMsg('Pilih proyek terlebih dahulu', 'error'); return; }
    if (!lapanganCatatan.trim() && lapanganFiles.length === 0) {
      showMsg('Catatan atau foto/video harus diisi!', 'error'); return;
    }

    setIsProcessing(true);
    try {
      let publicUrls = [];
      if (lapanganFiles.length > 0) {
        showMsg(`Mengunggah ${lapanganFiles.length} lampiran...`, 'info');
        for (const file of lapanganFiles) {
          const fileName = `quick_${Date.now()}_${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
          const { error: uploadError } = await supabase.storage.from('project-media').upload(`reports/${fileName}`, file);
          if (uploadError) throw uploadError;
          const { data } = supabase.storage.from('project-media').getPublicUrl(`reports/${fileName}`);
          publicUrls.push(data.publicUrl);
        }
      }

      const isProblem = lapanganCatatan.toLowerCase().includes('kendala');
      const mediaUrlString = publicUrls.length > 0 ? publicUrls.join(',') : null;

      const { error } = await supabase.from('field_reports').insert([{
          project_id: closestProject.id,
          title: 'Lapor Lapangan',
          description: lapanganCatatan || 'Tanpa Keterangan',
          media_url: mediaUrlString,
          is_problem: isProblem
      }]);

      if (error) throw error;

      showMsg('Laporan Lapangan berhasil dikirim!', 'success');
      setLapanganCatatan('');
      setLapanganFiles([]);
      setTimeout(() => setView('home'), 1500);

    } catch (e) {
      showMsg('Gagal mengirim laporan: ' + e.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnifiedSubmit = async (e) => {
    e.preventDefault();
    if (!closestProject) { showMsg('Pilih proyek terlebih dahulu', 'error'); return; }

    setIsProcessing(true);
    try {
      let csvUrl = null;
      if (uDataUkur) {
        showMsg('Mengunggah data CSV...', 'info');
        const fileName = `csv_${Date.now()}_${uDataUkur.name}`;
        await supabase.storage.from('project-media').upload(`survey/${fileName}`, uDataUkur);
        const { data } = supabase.storage.from('project-media').getPublicUrl(`survey/${fileName}`);
        csvUrl = data.publicUrl;
      }

      let mediaUrls = [];
      if (uMedia.length > 0) {
        showMsg('Mengunggah dokumentasi...', 'info');
        for (const file of uMedia) {
          const fileName = `media_${Date.now()}_${file.name}`;
          await supabase.storage.from('project-media').upload(`survey/${fileName}`, file);
          const { data } = supabase.storage.from('project-media').getPublicUrl(`survey/${fileName}`);
          mediaUrls.push(data.publicUrl);
        }
      }

      const newSegment = {
        id: Date.now().toString(),
        nama: uForm.namaSegmen,
        start_lat: parseFloat(uForm.startLat) || null,
        start_lng: parseFloat(uForm.startLng) || null,
        end_lat: parseFloat(uForm.endLat) || null,
        end_lng: parseFloat(uForm.endLng) || null,
        panjang: uForm.panjang,
        lebar: uForm.lebar,
        jenis_model_awal: uForm.jenis_model_awal,
        data_ukur_url: csvUrl,
        media_urls: mediaUrls,
        catatan: uForm.noteDesc,
        tanggal: uForm.tanggal,
        dilaporkan_oleh: user.name
      };

      try {
        const { data: projData, error: fetchErr } = await supabase.from('projects').select('rute').eq('id', closestProject.id).single();
        if (!fetchErr && projData) {
          const currentRute = projData.rute || [];
          const updatedRute = [...currentRute, newSegment];
          await supabase.from('projects').update({ rute: updatedRute }).eq('id', closestProject.id);
        }
      } catch (err) {
        console.warn("Kolom 'rute' tidak ditemukan di database. Penyimpanan spesifik rute dilewati.", err);
      }

      const deskripsi = `[LAPORAN SURVEI]\nNama Segmen: ${uForm.namaSegmen}\nPanjang: ${uForm.panjang}\nLebar: ${uForm.lebar}\nJenis: ${uForm.jenis_model_awal}\nCatatan: ${uForm.noteDesc}`;
      const { error: repErr } = await supabase.from('field_reports').insert([{
        project_id: closestProject.id,
        title: 'Laporan Survei',
        description: deskripsi,
        media_url: mediaUrls[0] || null, 
        is_problem: uForm.noteDesc.toLowerCase().includes('kendala') || uForm.noteDesc.toLowerCase().includes('masalah')
      }]);
      if (repErr) throw repErr;

      showMsg('Data Survei berhasil disimpan!', 'success');
      
      setUForm({ tanggal: new Date().toISOString().split('T')[0], namaSegmen: '', startLat: '', startLng: '', endLat: '', endLng: '', panjang: '', lebar: '', jenis_model_awal: '', noteDesc: '' });
      setUMedia([]);
      setUDataUkur(null);
      setTimeout(() => setView('home'), 1500);

    } catch (error) {
      showMsg('Gagal menyimpan survei: ' + error.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- HANDLER SUBMIT UPDATE RUTE (REALISASI / SKETSA) ---
  const handleRuteSubmit = async (e) => {
    e.preventDefault();
    if (!closestProject) { showMsg('Pilih proyek terlebih dahulu!', 'error'); return; }
    if (!ruteForm.lat || !ruteForm.lng) { showMsg('Harap isi atau ambil kordinat GPS!', 'error'); return; }
    
    const finalSegmentName = ruteForm.segmentName === 'NEW' ? ruteForm.newSegmentName.trim() : ruteForm.segmentName;
    if (!finalSegmentName) { showMsg('Nama segmen tidak boleh kosong!', 'error'); return; }

    setIsProcessing(true);
    try {
       // 1. Upload dan Compress Gambar jika ada
       let publicUrls = [];
       if (ruteFiles.length > 0) {
         showMsg(`Mengompres & mengunggah ${ruteFiles.length} foto/video...`, 'info');
         for (const file of ruteFiles) {
           const compressedFile = await compressImage(file);
           const fileName = `rute_${Date.now()}_${Math.random().toString(36).substring(7)}.${compressedFile.name.split('.').pop()}`;
           const { error: uploadError } = await supabase.storage.from('project-media').upload(`reports/${fileName}`, compressedFile);
           if (!uploadError) {
             const { data } = supabase.storage.from('project-media').getPublicUrl(`reports/${fileName}`);
             publicUrls.push(data.publicUrl);
           }
         }
       }

       const targetCol = ruteForm.type === 'realisasi' ? 'actual_segments_data' : 'planned_path';
       
       // 2. Tarik Data Segmen Paling Baru dari DB
       const { data: currentProj, error: fetchErr } = await supabase.from('projects').select(targetCol).eq('id', closestProject.id).single();
       if (fetchErr) throw fetchErr;

       let currentData = currentProj[targetCol];
       if (typeof currentData === 'string') {
          try { currentData = JSON.parse(currentData); } catch(e) { currentData = []; }
       }
       if (!Array.isArray(currentData)) currentData = [];

       const segIndex = currentData.findIndex(s => (s.name || s.id) === finalSegmentName);
       const latFloat = parseFloat(ruteForm.lat);
       const lngFloat = parseFloat(ruteForm.lng);

       // 3. Modifikasi array JSON sesuai tipe jalur (HANYA POIN, TANPA PIN/MARKER)
       if (ruteForm.type === 'realisasi') {
          if (segIndex >= 0) {
             if (!currentData[segIndex].points) currentData[segIndex].points = [];
             currentData[segIndex].points.push({ lat: latFloat, lng: lngFloat });
          } else {
             currentData.push({
                 id: Date.now(),
                 name: finalSegmentName,
                 points: [{ lat: latFloat, lng: lngFloat }]
             });
          }
       } else {
          if (segIndex >= 0) {
             if (!currentData[segIndex].points) currentData[segIndex].points = [];
             currentData[segIndex].points.push({ lat: latFloat, lng: lngFloat });
          } else {
             currentData.push({
                 id: Date.now().toString(),
                 name: finalSegmentName,
                 type: 'line', color: '#f59e0b', isDashed: true,
                 points: [{ lat: latFloat, lng: lngFloat }]
             });
          }
       }

       // 4. Update Database
       const { error: updateErr } = await supabase.from('projects')
         .update({ 
           [targetCol]: currentData, 
           updated_at: new Date().toISOString() 
         }).eq('id', closestProject.id);
       
       if (updateErr) throw updateErr;

       // 5. Insert Log ke Field Reports
       const labelTipe = ruteForm.type === 'realisasi' ? 'Realisasi' : 'Sketsa Rencana';
       const deskripsiReport = `Penambahan titik rute ${labelTipe.toLowerCase()} baru pada [${finalSegmentName}].\nKordinat Baru: Lat ${latFloat}, Lng ${lngFloat}\nCatatan: ${ruteForm.notes || '-'}`;
       const mediaUrlString = publicUrls.length > 0 ? publicUrls.join(',') : null;

       const { error: repErr } = await supabase.from('field_reports').insert([{
           project_id: closestProject.id,
           title: `Update Progress Rute ${labelTipe}`,
           description: deskripsiReport,
           media_url: mediaUrlString,
           is_problem: ruteForm.notes.toLowerCase().includes('kendala') || ruteForm.notes.toLowerCase().includes('masalah')
       }]);
       
       if (repErr) throw repErr;

       showMsg('Titik Rute Berhasil Disimpan & Disinkronkan!', 'success');
       setRuteForm({ type: 'realisasi', segmentName: '', newSegmentName: '', lat: '', lng: '', notes: '' });
       setRuteFiles([]);
       
       // Sync project details di memory sebelum kembali ke Home (tanpa harus refresh browser)
       await fetchProjects(supabase);
       
       setTimeout(() => setView('home'), 1500);

    } catch (error) {
       showMsg('Gagal memproses rute: ' + error.message, 'error');
    } finally {
       setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-900 h-[100dvh] w-full fixed inset-0 flex items-center justify-center sm:p-4 overflow-hidden" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <div className="bg-slate-50 w-full h-[100dvh] sm:h-[800px] sm:max-h-[90vh] sm:max-w-[400px] rounded-none sm:rounded-[40px] overflow-hidden shadow-2xl relative flex flex-col border-none sm:border-[6px] sm:border-slate-800">
        
        <style>{`
          /* Terapkan font Apple secara paksa ke semua elemen termasuk input, textarea & button */
          * {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
          }
          
          /* Kunci utama mencegah pull-to-refresh & zoom */
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            overscroll-behavior-y: none;
            touch-action: pan-y;
          }
          
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        `}</style>

        {notification && (
          <div className={`absolute top-4 left-4 right-4 z-[9999] p-3 rounded-2xl shadow-lg text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2 ${notification.type === 'error' ? 'bg-rose-500 text-white' : notification.type === 'info' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'}`}>
            {notification.type === 'error' ? <AlertCircle size={16}/> : <CheckCircle2 size={16}/>}
            {notification.msg}
          </div>
        )}

        {/* --- VIEW: LOGIN --- */}
        {view === 'login' && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative overflow-y-auto custom-scrollbar" style={{ backgroundImage: "url('image_f91486.png')", backgroundColor: '#ffffff' }}>
             <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-[3px] z-0"></div>
             
             <div className="relative z-10 flex flex-col items-center w-full px-6 py-4 my-auto sm:max-w-md">
                 
                 <div className="flex flex-col items-center w-full mb-10 sm:mb-14">
                     <div className="w-20 h-20 bg-indigo-50/80 border border-indigo-100 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/10 shrink-0">
                        <MapPin size={40} className="text-indigo-500" />
                     </div>
                     <h1 className="text-4xl sm:text-5xl font-black text-[#131219] mb-3 drop-shadow-sm tracking-tight shrink-0">
                        ak<span className="text-indigo-500/90">md</span>
                     </h1>
                     <p className="text-slate-500 text-xs sm:text-sm font-normal tracking-widest uppercase shrink-0">Absensi & Form Input</p>
                 </div>
                 
                 <form onSubmit={handleLogin} className="w-full space-y-5 shrink-0">
                    <div>
                       <label className="text-[12px] font-normal text-slate-600 uppercase tracking-wider ml-1 block">ID Karyawan</label>
                       <input type="text" value={loginForm.id} onChange={e => setLoginForm({...loginForm, id: e.target.value})} placeholder="Contoh: deni" required className="w-full mt-2 p-4 rounded-xl bg-white border border-slate-300 shadow-sm outline-none focus:border-[#131219] focus:ring-2 focus:ring-[#131219]/20 text-[16px] font-normal text-slate-800 transition-all"/>
                    </div>
                    <div>
                       <label className="text-[12px] font-normal text-slate-600 uppercase tracking-wider ml-1 block">PIN/PASSWORD</label>
                       <input type="password" value={loginForm.pin} onChange={e => setLoginForm({...loginForm, pin: e.target.value})} placeholder="••••••" required className="w-full mt-2 p-4 rounded-xl bg-white border border-slate-300 shadow-sm outline-none focus:border-[#131219] focus:ring-2 focus:ring-[#131219]/20 text-[16px] font-normal tracking-widest text-slate-800 transition-all"/>
                    </div>
                    <button type="submit" disabled={isProcessing} className="w-full bg-[#131219] text-white py-4 rounded-xl text-[16px] font-normal uppercase mt-8 hover:bg-[#201f29] active:scale-[0.98] transition-all flex justify-center items-center gap-2">
                       {isProcessing ? <Loader2 size={16} className="animate-spin"/> : null}
                       {isProcessing ? 'VERIFIKASI...' : 'LOGIN'}
                    </button>
                 </form>
             </div>
          </div>
        )}

        {/* --- VIEW: HOME --- */}
        {view === 'home' && (
          <div className="flex-1 flex flex-col bg-slate-50 relative h-full">
             <div className="bg-slate-200/80 border-b border-slate-300/50 px-6 pt-10 pb-8 rounded-b-[32px] text-slate-800 shadow-sm relative z-10">
                <div className="flex justify-between items-center mb-6">
                   <div className="flex items-center gap-3">
                      <div className="bg-[#131219] text-white p-2 rounded-full shadow-md"><UserCircle size={24}/></div>
                      <div>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Selamat Bekerja,</p>
                         <h2 className="text-base font-black truncate max-w-[200px] text-[#131219]">{user.name}</h2>
                      </div>
                   </div>
                   <button onClick={handleLogout} className="px-4 py-2 bg-[#131219] rounded-xl hover:bg-[#201f29] active:scale-95 transition-all flex items-center gap-2 text-xs font-bold shadow-md shadow-[#131219]/20 text-white">
                      <LogOut size={14}/>
                      LOGOUT
                   </button>
                </div>
             </div>

             <div className="p-6 flex-1 flex flex-col gap-4 mt-2 relative z-20 custom-scrollbar overflow-y-auto pb-10">
                <button onClick={() => setView('absen')} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5 hover:border-slate-300 transition-all group active:scale-95">
                   <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"><UserCheck strokeWidth={2.5} size={30}/></div>
                   <div className="text-left flex-1">
                      <h3 className="font-normal text-slate-800 text-[20px] tracking-tight">Absensi</h3>
                      <p className="text-[12px] text-slate-500 mt-1 font-medium leading-snug">Catat data absensi harian</p>
                   </div>
                </button>
                <button onClick={() => setView('lapor')} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5 hover:border-slate-300 transition-all group active:scale-95">
                   <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"><FileText strokeWidth={2.5} size={30}/></div>
                   <div className="text-left flex-1">
                      <h3 className="font-normal text-slate-800 text-[20px] tracking-tight">Buat Laporan</h3>
                      <p className="text-[12px] text-slate-500 mt-1 font-medium leading-snug">Laporan harian & lapor cepat lapangan</p>
                   </div>
                </button>
                <button onClick={() => setView('survei')} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5 hover:border-slate-300 transition-all group active:scale-95">
                   <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"><Map strokeWidth={2.5} size={30}/></div>
                   <div className="text-left flex-1">
                      <h3 className="font-normal text-slate-800 text-[20px] tracking-tight">Input Survei</h3>
                      <p className="text-[12px] text-slate-500 mt-1 font-medium leading-snug">Catat rute & data ukur lapangan</p>
                   </div>
                </button>
                {/* TOMBOL BARU UPDATE RUTE */}
                <button onClick={() => setView('rute_gps')} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5 hover:border-amber-300 transition-all group active:scale-95 border-l-4 border-l-amber-500 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-1.5 px-3 bg-amber-100 text-amber-700 text-[9px] font-black tracking-widest rounded-bl-xl uppercase">Map/Peta</div>
                   <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"><Navigation strokeWidth={2.5} size={30}/></div>
                   <div className="text-left flex-1">
                      <h3 className="font-normal text-slate-800 text-[20px] tracking-tight">Update Rute (GPS)</h3>
                      <p className="text-[12px] text-slate-500 mt-1 font-medium leading-snug">Sinkronisasi rute aktual & rencana</p>
                   </div>
                </button>
             </div>
          </div>
        )}

        {/* --- VIEW BARU: UPDATE RUTE GPS (MODAL-LIKE VIEW) --- */}
        {view === 'rute_gps' && (
          <div className="flex-1 flex flex-col bg-slate-50 relative h-full overflow-hidden animate-in slide-in-from-right-4 duration-200">
             
             {/* Header */}
             <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-4 shrink-0 shadow-sm z-10">
                <button onClick={() => setView('home')} className="p-2 bg-[#131219] text-white rounded-full hover:bg-[#201f29] active:scale-95 transition-all shadow-sm shadow-[#131219]/20"><ChevronLeft size={20}/></button>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-slate-800 text-lg truncate flex items-center gap-2">
                    <Navigation size={18} className="text-amber-500" /> Update Rute
                  </h2>
                </div>
             </div>
             
             {/* Tab Tipe Jalur */}
             <div className="px-5 pt-5 shrink-0 relative z-10 bg-slate-50">
                <label className="text-[10px] font-bold block mb-2 uppercase text-slate-500 text-center">Pilih Tipe Jalur Pada Peta</label>
                <div className="flex bg-slate-200/80 p-1.5 rounded-2xl shadow-inner">
                   <button onClick={() => setRuteForm({...ruteForm, type: 'realisasi', segmentName: ''})} className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm ${ruteForm.type === 'realisasi' ? 'bg-white text-emerald-600 border border-emerald-100' : 'text-slate-500 hover:text-slate-700 bg-transparent shadow-none border-transparent'}`}>
                      Aktual (Realisasi)
                   </button>
                   <button onClick={() => setRuteForm({...ruteForm, type: 'sketsa', segmentName: ''})} className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm ${ruteForm.type === 'sketsa' ? 'bg-white text-amber-500 border border-amber-100' : 'text-slate-500 hover:text-slate-700 bg-transparent shadow-none border-transparent'}`}>
                      Rencana (Sketsa)
                   </button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar bg-slate-50 overflow-x-hidden">
                <form onSubmit={handleRuteSubmit} className="space-y-4 text-left pb-10 animate-in fade-in w-full">
                  
                  {/* Pilihan Proyek & Segmen */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm w-full space-y-4">
                    <SurveyInputRow label="Pilih Proyek">
                      <select 
                         className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-bold outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-inner"
                         value={closestProject?.id || ''}
                         onChange={(e) => setClosestProject(projects.find(p => p.id === e.target.value))}
                      >
                         <option value="" disabled>Pilih Proyek...</option>
                         {projects.map(p => <option key={p.id} value={p.id}>{p.pekerjaan}</option>)}
                      </select>
                    </SurveyInputRow>

                    {closestProject && (
                      <SurveyInputRow label="Pilih Segmen / Ruas">
                        <select 
                           className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-bold outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-inner mb-2"
                           value={ruteForm.segmentName}
                           onChange={(e) => setRuteForm({...ruteForm, segmentName: e.target.value})}
                        >
                           <option value="" disabled>Pilih Segmen yang Tersedia...</option>
                           {existingSegments.map((name, idx) => <option key={idx} value={name}>{name}</option>)}
                           <option value="NEW" className="text-blue-600 font-black">+ Buat Segmen Baru</option>
                        </select>

                        {ruteForm.segmentName === 'NEW' && (
                           <div className="animate-in slide-in-from-top-1 fade-in mt-2">
                             <input 
                               type="text" 
                               placeholder="Ketik Nama Segmen Baru..." 
                               value={ruteForm.newSegmentName}
                               onChange={(e) => setRuteForm({...ruteForm, newSegmentName: e.target.value})}
                               className="w-full p-3.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 text-sm font-bold outline-none focus:bg-white focus:border-blue-500 shadow-inner"
                               autoFocus
                             />
                           </div>
                        )}
                      </SurveyInputRow>
                    )}
                  </div>

                  {/* Koordinat GPS (Support Manual / Auto) */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm w-full space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>
                    <SurveyInputRow label="Titik Koordinat (Bisa Diketik Manual)">
                      <div className="flex gap-2 w-full mb-3">
                        <div className="flex-1 min-w-0 bg-slate-100 rounded-xl p-3 border border-slate-200 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 transition-all">
                           <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">LATITUDE</span>
                           <input 
                              type="text" 
                              value={ruteForm.lat} 
                              onChange={(e) => setRuteForm(p => ({ ...p, lat: e.target.value }))}
                              placeholder="-0.000000" 
                              className="w-full bg-transparent outline-none text-sm font-black text-slate-800" 
                           />
                        </div>
                        <div className="flex-1 min-w-0 bg-slate-100 rounded-xl p-3 border border-slate-200 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 transition-all">
                           <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">LONGITUDE</span>
                           <input 
                              type="text" 
                              value={ruteForm.lng} 
                              onChange={(e) => setRuteForm(p => ({ ...p, lng: e.target.value }))}
                              placeholder="115.000000" 
                              className="w-full bg-transparent outline-none text-sm font-black text-slate-800" 
                           />
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => getUnifiedGPS('rute')} 
                        className="w-full py-3.5 bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors font-black rounded-xl text-xs uppercase tracking-widest flex justify-center items-center gap-2 border border-amber-200 shadow-sm"
                      >
                         <MapPin size={16} /> Ambil Lokasi Otomatis (GPS)
                      </button>
                    </SurveyInputRow>
                  </div>

                  {/* Catatan & Dokumentasi Gambar Grid */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm w-full space-y-4">
                    <SurveyInputRow label="Catatan Tambahan / Kendala">
                      <textarea 
                        rows="3" 
                        value={ruteForm.notes} 
                        onChange={e => setRuteForm(p => ({ ...p, notes: e.target.value }))} 
                        placeholder="Misal: Posisi berada di depan tiang listrik..." 
                        className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs font-normal shadow-inner resize-y leading-relaxed text-slate-800"
                      ></textarea>
                    </SurveyInputRow>

                    <SurveyInputRow label="Upload Foto Lapangan (Akan Dikompresi)">
                      {ruteFiles.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-3">
                           {ruteFiles.map((file, idx) => (
                              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-sm">
                                 {file.type.startsWith('image/') ? (
                                    <img src={URL.createObjectURL(file)} alt="prev" className="w-full h-full object-cover" />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[8px] font-bold truncate px-1 text-slate-500">{file.name}</div>
                                 )}
                                 <button type="button" onClick={() => setRuteFiles(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-md shadow-md active:scale-90"><Trash2 size={12} /></button>
                              </div>
                           ))}
                        </div>
                      )}

                      <div className="bg-slate-50 p-3 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden h-14">
                        <input 
                           type="file" multiple accept="image/*" 
                           onChange={(e) => setRuteFiles(prev => [...prev, ...Array.from(e.target.files)])} 
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 py-1 uppercase">
                           <Camera size={16} className="text-amber-500" />
                           <span>Pilih Foto/Gambar</span>
                        </div>
                      </div>
                    </SurveyInputRow>
                  </div>

                  <button type="submit" disabled={isProcessing} className="w-full bg-[#131219] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-[#201f29] shadow-[#131219]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs">
                    {isProcessing ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>}
                    {isProcessing ? 'MENYIMPAN KE SERVER...' : 'SIMPAN TITIK RUTE'}
                  </button>
                </form>
             </div>
          </div>
        )}

        {/* --- VIEW: INPUT SURVEI (DIPERBAIKI OVERFLOW & MIN-W) --- */}
        {view === 'survei' && (
          <div className="flex-1 flex flex-col bg-white relative h-full overflow-hidden">
             <div className="p-5 border-b border-slate-200 bg-white flex items-center gap-4 shrink-0 shadow-sm z-10">
                <button onClick={() => setView('home')} className="p-2 bg-[#131219] text-white rounded-full hover:bg-[#201f29] active:scale-95 transition-all shadow-sm shadow-[#131219]/20"><ChevronLeft size={20}/></button>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-slate-800 text-lg truncate">Input Survei</h2>
                </div>
             </div>
             
             {/* Tambahkan overflow-x-hidden untuk memastikan tidak ada elemen form yang membuat layar melar ke kanan */}
             <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 custom-scrollbar bg-white pb-10">
                <form onSubmit={handleUnifiedSubmit} className="space-y-4 text-left w-full">
                  <SurveyInputRow label="Pilih Proyek">
                    <select 
                       className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-400 focus:bg-white transition-colors text-sm font-bold text-slate-800"
                       value={closestProject?.id || ''}
                       onChange={(e) => setClosestProject(projects.find(p => p.id === e.target.value))}
                    >
                       <option value="" disabled>Pilih Proyek...</option>
                       {projects.map(p => <option key={p.id} value={p.id}>{p.pekerjaan}</option>)}
                    </select>
                  </SurveyInputRow>

                  <SurveyInputRow label="Tanggal">
                    <input type="date" value={uForm.tanggal} onChange={e => setUForm(p => ({ ...p, tanggal: e.target.value }))} className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-400 focus:bg-white transition-colors" />
                  </SurveyInputRow>
                  
                  <SurveyInputRow label="Nama Jln/Gg./Blok">
                    <textarea rows="2" value={uForm.namaSegmen} onChange={e => setUForm(p => ({ ...p, namaSegmen: e.target.value }))} placeholder="Misal: Jl. Mawar / Segmen 1" className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-400 focus:bg-white transition-colors resize-none leading-relaxed"></textarea>
                  </SurveyInputRow>
                  
                  {/* Gunakan min-w-0 pada input flex agar tidak overflow */}
                  <SurveyInputRow label="Titik Awal">
                    <div className="flex gap-2 w-full">
                      <input type="text" placeholder="Lat" value={uForm.startLat} onChange={e => setUForm(p => ({ ...p, startLat: e.target.value }))} className="flex-1 min-w-0 p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-400 focus:bg-white" />
                      <input type="text" placeholder="Lng" value={uForm.startLng} onChange={e => setUForm(p => ({ ...p, startLng: e.target.value }))} className="flex-1 min-w-0 p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-400 focus:bg-white" />
                      <button type="button" onClick={() => getUnifiedGPS('start')} className="shrink-0 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-bold rounded-xl text-[10px] shadow-sm">GPS</button>
                    </div>
                  </SurveyInputRow>
                  
                  {/* Gunakan min-w-0 pada input flex agar tidak overflow */}
                  <SurveyInputRow label="Titik Akhir">
                    <div className="flex gap-2 w-full">
                      <input type="text" placeholder="Lat" value={uForm.endLat} onChange={e => setUForm(p => ({ ...p, endLat: e.target.value }))} className="flex-1 min-w-0 p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-400 focus:bg-white" />
                      <input type="text" placeholder="Lng" value={uForm.endLng} onChange={e => setUForm(p => ({ ...p, endLng: e.target.value }))} className="flex-1 min-w-0 p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-400 focus:bg-white" />
                      <button type="button" onClick={() => getUnifiedGPS('end')} className="shrink-0 px-3 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors font-bold rounded-xl text-[10px] shadow-sm">GPS</button>
                    </div>
                  </SurveyInputRow>
                  
                  <SurveyInputRow label="Panjang Eks.">
                    <input type="text" value={uForm.panjang} onChange={e => setUForm(p => ({ ...p, panjang: e.target.value }))} className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-400 focus:bg-white" />
                  </SurveyInputRow>
                  
                  <SurveyInputRow label="Lebar Eks.">
                    <input type="text" value={uForm.lebar} onChange={e => setUForm(p => ({ ...p, lebar: e.target.value }))} className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-400 focus:bg-white" />
                  </SurveyInputRow>
                  
                  <SurveyInputRow label="Jenis/Model Eks.">
                    <input type="text" value={uForm.jenis_model_awal} onChange={e => setUForm(p => ({ ...p, jenis_model_awal: e.target.value }))} className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-400 focus:bg-white" />
                  </SurveyInputRow>
                  
                  <SurveyInputRow label="Upload Data Ukur (CSV)">
                    <input type="file" accept=".csv" onChange={e => setUDataUkur(e.target.files[0])} className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100" />
                  </SurveyInputRow>
                  
                  <SurveyInputRow label="Catatan - Kendala - Kondisi">
                    <textarea rows="3" value={uForm.noteDesc} onChange={e => setUForm(p => ({ ...p, noteDesc: e.target.value }))} className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-400 focus:bg-white"></textarea>
                  </SurveyInputRow>
                  
                  <SurveyInputRow label="Dokumentasi Eks.">
                    <input type="file" multiple accept="image/*,video/*" onChange={e => {
                      const files = Array.from(e.target.files);
                      if (files.length > 5) { showMsg("Maksimal 5 file.", "error"); setUMedia(files.slice(0, 5)); } 
                      else { setUMedia(files); }
                    }} className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100" />
                    {uMedia.length > 0 && <div className="text-[10px] mt-1.5 text-blue-600 font-bold">{uMedia.length} file siap diunggah</div>}
                  </SurveyInputRow>
                  
                  <button type="submit" disabled={isProcessing} className="w-full bg-blue-600 text-white py-4 rounded-2xl text-sm font-bold uppercase shadow-md hover:bg-blue-700 transition-colors">
                    {isProcessing ? 'Menyimpan Data...' : 'Simpan Data Survei'}
                  </button>
                </form>
             </div>
          </div>
        )}

        {/* --- VIEW: ABSENSI --- */}
        {view === 'absen' && (
          <div className="flex-1 flex flex-col bg-slate-50 relative h-full overflow-hidden">
             <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-3 shrink-0 shadow-sm z-10">
                <button onClick={() => setView('home')} className="p-2 bg-[#131219] text-white rounded-full hover:bg-[#201f29] active:scale-95 transition-all shadow-sm shadow-[#131219]/20"><ChevronLeft size={20}/></button>
                <h2 className="font-black text-slate-800 text-lg">Form Absensi</h2>
             </div>
             
             {/* --- TAB MODE KEHADIRAN (PEMISAH) --- */}
             <div className="px-6 pt-6 shrink-0 relative z-10">
                <div className="flex bg-slate-200/60 p-1.5 rounded-2xl">
                   <button onClick={() => setAttendanceMode('Hadir')} className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all ${attendanceMode === 'Hadir' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Kehadiran</button>
                   <button onClick={() => setAttendanceMode('TidakHadir')} className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all ${attendanceMode === 'TidakHadir' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Izin / Sakit</button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-6 flex flex-col custom-scrollbar pb-32 relative z-0">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
                   
                   {attendanceMode === 'Hadir' ? (
                      <div className="animate-in fade-in slide-in-from-bottom-2">
                         <h3 className="text-slate-800 mb-4 text-center mt-2 font-normal">Info Posisi</h3>
                         <div className="space-y-3 mb-6">
                            <button onClick={() => setLocationType('Kantor')} className={`w-full p-4 rounded-2xl border-2 font-normal text-sm transition-all flex items-center justify-center gap-3 ${locationType === 'Kantor' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300'}`}><Clock size={24} /> Kantor</button>
                            <button onClick={() => setLocationType('Proyek')} className={`w-full p-4 rounded-2xl border-2 font-normal text-sm transition-all flex items-center justify-center gap-3 ${locationType === 'Proyek' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300'}`}><MapPin size={24} /> Lokasi</button>
                         </div>
                         
                         {locationType === 'Proyek' && (
                            <div className="animate-in fade-in slide-in-from-top-2 border-t border-slate-100 pt-6">
                               <label className="text-[10px] font-normal text-slate-500 uppercase ml-1 block mb-2">Pilih Nama Proyek</label>
                               <select className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-normal focus:border-emerald-500" value={closestProject?.id || ''} onChange={(e) => setClosestProject(projects.find(p => p.id === e.target.value))}>
                                  <option value="" disabled>Pilih Proyek...</option>
                                  {projects.map(p => <option key={p.id} value={p.id}>{p.pekerjaan}</option>)}
                               </select>
                            </div>
                         )}
                      </div>
                   ) : (
                      <div className="animate-in fade-in slide-in-from-bottom-2">
                         <h3 className="text-slate-800 mb-4 text-center mt-2 font-normal">Form Ketidakhadiran</h3>
                         <div>
                            <label className="text-[10px] font-normal text-slate-500 uppercase ml-1 block mb-2">Keterangan / Alasan (Wajib)</label>
                            <textarea
                              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none text-sm font-normal focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none placeholder:text-slate-400/80"
                              rows="5"
                              placeholder="Tuliskan alasan atau keperluan secara detail di sini..."
                              value={absenCatatan}
                              onChange={e => setAbsenCatatan(e.target.value)}
                            ></textarea>
                         </div>
                      </div>
                   )}

                </div>
             </div>

             <div className="absolute bottom-0 left-0 right-0 p-5 bg-white/90 backdrop-blur-md border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-20 rounded-b-[34px]">
                 {attendanceMode === 'Hadir' ? (
                     <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2">
                         <button onClick={(e) => handleAbsenSubmit(e, 'Masuk')} disabled={isProcessing} className="py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex flex-col items-center justify-center gap-1.5 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 active:scale-95 disabled:opacity-50">
                           {isProcessing ? <Loader2 size={18} className="animate-spin"/> : <CheckCircle2 size={18}/>} Masuk
                         </button>
                         <button onClick={(e) => handleAbsenSubmit(e, 'Pulang')} disabled={isProcessing} className="py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex flex-col items-center justify-center gap-1.5 bg-rose-500 text-white shadow-lg shadow-rose-500/30 hover:bg-rose-600 active:scale-95 disabled:opacity-50">
                           {isProcessing ? <Loader2 size={18} className="animate-spin"/> : <LogOut size={18}/>} Pulang
                         </button>
                     </div>
                 ) : (
                     <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2">
                         <button onClick={(e) => handleAbsenSubmit(e, 'Izin')} disabled={isProcessing} className="py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex flex-col items-center justify-center gap-1.5 bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 active:scale-95 disabled:opacity-50">
                           {isProcessing ? <Loader2 size={18} className="animate-spin"/> : <Calendar size={18}/>} Kirim Izin
                         </button>
                         <button onClick={(e) => handleAbsenSubmit(e, 'Sakit')} disabled={isProcessing} className="py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex flex-col items-center justify-center gap-1.5 bg-amber-500 text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600 active:scale-95 disabled:opacity-50">
                           {isProcessing ? <Loader2 size={18} className="animate-spin"/> : <Thermometer size={18}/>} Kirim Sakit
                         </button>
                     </div>
                 )}
             </div>
          </div>
        )}

        {/* --- VIEW: ABSENSI SUCCESS --- */}
        {view === 'absen_success' && absenReceipt && (
          <div className={`flex-1 flex flex-col p-6 animate-in zoom-in-95 duration-300 relative ${absenReceipt.absenType === 'Izin' || absenReceipt.absenType === 'Sakit' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
             <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full bg-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                   <div className={`absolute -left-4 top-1/2 w-8 h-8 rounded-full -translate-y-1/2 ${absenReceipt.absenType === 'Izin' || absenReceipt.absenType === 'Sakit' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                   <div className={`absolute -right-4 top-1/2 w-8 h-8 rounded-full -translate-y-1/2 ${absenReceipt.absenType === 'Izin' || absenReceipt.absenType === 'Sakit' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                   <div className="text-center pb-6 border-b-2 border-dashed border-slate-200">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${absenReceipt.absenType === 'Izin' || absenReceipt.absenType === 'Sakit' ? 'bg-blue-100 text-blue-500' : 'bg-emerald-100 text-emerald-500'}`}>
                         <CheckCircle2 size={32} />
                      </div>
                      <h2 className="text-2xl font-black text-slate-800">
                         {absenReceipt.absenType === 'Izin' || absenReceipt.absenType === 'Sakit' ? 'Terkirim!' : 'Sudah Absen!'}
                      </h2>
                      <p className="text-xs text-slate-500 font-bold mt-1">
                         {absenReceipt.absenType === 'Izin' || absenReceipt.absenType === 'Sakit' ? 'Status telah dicatat' : 'Kehadiran direkam'}
                      </p>
                      <div className={`mt-3 inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${absenReceipt.status.includes('Terlambat') || absenReceipt.status.includes('Lebih Awal') ? 'bg-rose-100 text-rose-600' : (absenReceipt.status === 'Izin' || absenReceipt.status === 'Sakit') ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                         {absenReceipt.status}
                      </div>
                   </div>
                   <div className="py-6 space-y-4">
                      <div><p className="text-[10px] text-slate-400 font-bold uppercase">Nama</p><p className="text-sm font-black text-slate-800">{absenReceipt.name}</p></div>
                      <div><p className="text-[10px] text-slate-400 font-bold uppercase">Waktu</p><p className="text-sm font-black text-slate-800">{absenReceipt.time}</p></div>
                      <div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">
                            {absenReceipt.absenType === 'Izin' || absenReceipt.absenType === 'Sakit' ? 'Keterangan' : 'Lokasi'}
                         </p>
                         <p className="text-sm font-black text-slate-800 leading-relaxed">{absenReceipt.location}</p>
                      </div>
                   </div>
                </div>
             </div>
             <button onClick={() => setView('home')} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-sm mt-6 shadow-xl">Kembali ke Beranda</button>
          </div>
        )}

        {/* --- VIEW: LAPORAN HARIAN --- */}
        {view === 'lapor' && (
          <div className="flex-1 flex flex-col bg-white relative h-full overflow-hidden">
             
             {/* Header */}
             <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-4 shrink-0 shadow-sm z-10">
                <button onClick={() => setView('home')} className="p-2 bg-[#131219] text-white rounded-full hover:bg-[#201f29] active:scale-95 transition-all shadow-sm shadow-[#131219]/20"><ChevronLeft size={20}/></button>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-slate-800 text-lg truncate">Buat Laporan</h2>
                </div>
             </div>
             
             {/* Tab Laporan */}
             <div className="px-5 pt-4 shrink-0 relative z-10 bg-slate-50/50">
                <div className="flex bg-slate-200/60 p-1.5 rounded-2xl">
                   <button onClick={() => setLaporTab('harian')} className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${laporTab === 'harian' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                      <FileText size={14} /> Harian
                   </button>
                   <button onClick={() => setLaporTab('lapangan')} className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${laporTab === 'lapangan' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                      <Zap size={14} /> Cepat (Lapangan)
                   </button>
                </div>
             </div>

             {/* Form Area - Scrollable */}
             <div className="flex-1 overflow-y-auto p-3 md:p-5 custom-scrollbar bg-slate-50/50 overflow-x-hidden">
                
                {laporTab === 'harian' && (
                <form onSubmit={handleReportSubmit} className="space-y-4 text-left pb-10 animate-in fade-in slide-in-from-bottom-2 w-full">
                  
                  {/* A. JAM KERJA & LOKASI */}
                  <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 space-y-4 w-full shadow-sm">
                    <h4 className="text-sm font-black uppercase text-slate-700 mb-1 border-b border-slate-100 pb-2 tracking-widest flex items-center gap-2">
                       A. Informasi & Jam Kerja
                    </h4>
                    <div>
                      <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-600">Pilih Proyek / Pekerjaan</label>
                      <select 
                         className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                         value={closestProject?.id || ''}
                         onChange={(e) => setClosestProject(projects.find(p => p.id === e.target.value))}
                      >
                         <option value="" disabled>Pilih Proyek yang Sedang Dikerjakan...</option>
                         {projects.map(p => <option key={p.id} value={p.id}>{p.pekerjaan}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-600">Lokasi Pekerjaan Detail</label>
                      <textarea rows="2" value={dailyReportForm.lokasi} onChange={e => setDailyReportForm(p => ({ ...p, lokasi: e.target.value }))} placeholder="Ketik nama jalan atau lokasi lengkap..." className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-inner resize-y leading-relaxed break-words"></textarea>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-600">Tanggal Utama Laporan</label>
                      <input type="date" value={dailyReportForm.tanggal} onChange={e => setDailyReportForm(p => ({ ...p, tanggal: e.target.value }))} className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs font-bold shadow-inner text-slate-800" />
                    </div>
                    
                    {/* Waktu Kerja (Shifts) */}
                    <div className="pt-1">
                      <label className="text-[10px] font-bold block mb-2 uppercase text-slate-600">Waktu Kerja (Shift)</label>
                      <div className="space-y-3">
                        {dailyReportForm.shifts.map((shift, idx) => (
                           <div key={idx} className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl space-y-3 relative shadow-sm">
                              {dailyReportForm.shifts.length > 1 && (
                                <button type="button" onClick={() => setConfirmDeleteFormItem({ type: 'shift', index: idx })} className="absolute top-2 right-2 p-1.5 text-rose-500 bg-rose-100 rounded-lg hover:bg-rose-200 transition-colors"><Trash2 size={14}/></button>
                              )}
                              <div className="flex flex-col gap-2.5">
                                 <div>
                                   <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Mulai Shift</label>
                                   <div className="flex gap-2">
                                     <input type="date" value={shift.tanggalMulai} onChange={(e) => updateShift(idx, 'tanggalMulai', e.target.value)} className="w-3/5 p-2 text-xs font-bold border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                     <input type="time" value={shift.jamMulai} onChange={(e) => updateShift(idx, 'jamMulai', e.target.value)} className="w-2/5 p-2 text-xs font-bold border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                   </div>
                                 </div>
                                 <div>
                                   <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Selesai Shift</label>
                                   <div className="flex gap-2">
                                     <input type="date" value={shift.tanggalSelesai} onChange={(e) => updateShift(idx, 'tanggalSelesai', e.target.value)} className="w-3/5 p-2 text-xs font-bold border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                     <input type="time" value={shift.jamSelesai} onChange={(e) => updateShift(idx, 'jamSelesai', e.target.value)} className="w-2/5 p-2 text-xs font-bold border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                                   </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                      </div>
                      <button type="button" onClick={addShift} className="mt-3 w-full py-2.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-dashed border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wide">
                         <Plus size={14} /> Tambah Shift Lainnya
                      </button>
                    </div>
                  </div>

                  {/* B. CUACA */}
                  <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 w-full shadow-sm">
                    <h4 className="text-sm font-black uppercase text-slate-700 mb-3 border-b border-slate-100 pb-2 tracking-widest">B. Kondisi Cuaca</h4>
                    
                    <div className="flex flex-col gap-2 w-full">
                      {Object.keys(dailyReportForm.cuaca).map(jam => (
                        <div key={jam} className="flex flex-row items-center justify-between border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
                          <label className="w-1/2 p-3 bg-slate-100/80 text-xs font-bold text-slate-700 border-r border-slate-200 text-left pl-4 truncate">{jam}</label>
                          <select 
                            value={dailyReportForm.cuaca[jam]} 
                            onChange={e => setDailyReportForm(p => ({ ...p, cuaca: { ...p.cuaca, [jam]: e.target.value } }))} 
                            className="w-1/2 p-3 bg-white outline-none text-xs font-bold text-slate-800 text-center hover:bg-blue-50 cursor-pointer"
                          >
                            <option value="Cerah">Cerah</option>
                            <option value="Gerimis">Gerimis</option>
                            <option value="Hujan">Hujan</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* C. AKTIVITAS - DINAMIS TAMBAH & HAPUS ROW */}
                  <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 w-full shadow-sm">
                    <h4 className="text-sm font-black uppercase text-slate-700 mb-3 border-b border-slate-100 pb-2 tracking-widest">C. Aktivitas Pekerjaan</h4>
                    <div className="flex flex-col bg-slate-50/50 border border-slate-200 rounded-xl overflow-hidden shadow-sm w-full">
                      {dailyReportForm.aktivitas.map((akt, i) => {
                        const total = (parseFloat(akt.kemarin) || 0) + (parseFloat(akt.hariIni) || 0);
                        return (
                          <div key={i} className="flex flex-col border-b border-slate-200 p-4 w-full gap-3 relative">
                            <div className="flex justify-between items-start">
                               <div className="flex-1 mr-3">
                                  <label className="text-[10px] font-normal text-slate-600 uppercase block mb-1.5">Nama Pekerjaan</label>
                                  <textarea 
                                    rows="2"
                                    className="w-full p-2.5 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm resize-y leading-relaxed" 
                                    value={akt.nama} 
                                    onChange={e => { 
                                      const n = [...dailyReportForm.aktivitas]; 
                                      n[i].nama = e.target.value; 
                                      setDailyReportForm({ ...dailyReportForm, aktivitas: n }); 
                                    }} 
                                    placeholder="Contoh: Pek. Galian..." 
                                  ></textarea>
                               </div>
                               <div className="pt-5">
                                  <button 
                                    type="button" 
                                    onClick={() => setConfirmDeleteFormItem({ type: 'aktivitas', index: i })} 
                                    className="p-2 text-rose-500 hover:text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors shadow-sm"
                                    title="Hapus Baris"
                                  >
                                    <Trash2 size={16}/>
                                  </button>
                               </div>
                            </div>
                            <div className="flex items-center flex-1 gap-2 justify-between w-full">
                              <div className="flex-1 min-w-0">
                                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1 text-center truncate">Kemarin</label>
                                <input type="number" placeholder="0" className="w-full p-2 rounded-md border border-slate-200 bg-white text-xs font-bold text-center text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm" value={akt.kemarin} onChange={e => { const n = [...dailyReportForm.aktivitas]; n[i].kemarin = e.target.value; setDailyReportForm({ ...dailyReportForm, aktivitas: n }); }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1 text-center truncate">Hari Ini</label>
                                <input type="number" placeholder="0" className="w-full p-2 rounded-md border border-slate-200 bg-white text-xs font-bold text-center text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm" value={akt.hariIni} onChange={e => { const n = [...dailyReportForm.aktivitas]; n[i].hariIni = e.target.value; setDailyReportForm({ ...dailyReportForm, aktivitas: n }); }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1 text-center truncate">Total</label>
                                <input type="number" className="w-full p-2 rounded-md border border-slate-200 bg-slate-100 text-blue-600 font-black text-xs text-center cursor-not-allowed shadow-inner" value={total > 0 ? total : ''} readOnly />
                              </div>
                              <div className="flex-1 min-w-0">
                                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1 text-center truncate">Satuan</label>
                                <input type="text" className="w-full p-2 rounded-md border border-slate-200 bg-white text-xs font-bold text-center text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm" value={akt.satuan} onChange={e => { const n = [...dailyReportForm.aktivitas]; n[i].satuan = e.target.value; setDailyReportForm({ ...dailyReportForm, aktivitas: n }); }} placeholder="m³" />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <div className="p-3 bg-[#f8fafc] flex justify-center border-t border-slate-200">
                        <button type="button" onClick={addAktivitasRow} className="text-[10px] font-bold text-blue-600 bg-white border border-blue-200 px-3 py-2 rounded-lg flex items-center justify-center w-full gap-1.5 hover:bg-blue-50 transition-colors shadow-sm uppercase tracking-wide">
                           <Plus size={14}/> Tambah Item Pekerjaan
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* D. TENAGA KERJA (LAYOUT DIPERBAIKI) */}
                  <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 w-full shadow-sm">
                    <h4 className="text-sm font-black uppercase text-slate-700 mb-3 border-b border-slate-100 pb-2 tracking-widest">D. Jumlah Tenaga Kerja</h4>
                    <div className="flex flex-col bg-slate-50/50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      {dailyReportForm.tenagaKerja.length > 0 ? (
                        dailyReportForm.tenagaKerja.map((tk, i) => (
                          <div key={i} className="flex flex-col border-b border-slate-200 p-4 w-full gap-3 relative">
                            <div className="flex justify-between items-start">
                               <div className="flex-1 mr-3">
                                  <label className="text-[10px] font-normal text-slate-600 uppercase block mb-1.5">Posisi / Jabatan</label>
                                  <input 
                                     type="text" 
                                     placeholder="Contoh: Tukang Kayu..." 
                                     className="w-full p-2.5 rounded-lg border border-slate-200 bg-white outline-none text-xs font-bold text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm" 
                                     value={tk.posisi} 
                                     onChange={e => { 
                                       const n = [...dailyReportForm.tenagaKerja]; 
                                       n[i].posisi = e.target.value; 
                                       setDailyReportForm({...dailyReportForm, tenagaKerja: n}); 
                                     }} 
                                  />
                               </div>
                               <div className="pt-5">
                                  <button 
                                    type="button" 
                                    onClick={() => setConfirmDeleteFormItem({ type: 'tenagaKerja', index: i })} 
                                    className="p-2 text-rose-500 hover:text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors shadow-sm"
                                    title="Hapus Tenaga Kerja"
                                  >
                                    <Trash2 size={16}/>
                                  </button>
                               </div>
                            </div>
                            
                            <div className="flex items-center gap-2 w-full sm:w-1/2">
                               <label className="text-[10px] font-bold text-slate-600 uppercase w-16">Jumlah</label>
                               <input 
                                 type="number" 
                                 min="0" 
                                 placeholder="0" 
                                 className="flex-1 p-2 text-center rounded-lg border border-slate-200 bg-white outline-none text-xs font-bold text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm" 
                                 value={tk.jumlah} 
                                 onChange={e => { 
                                   const n = [...dailyReportForm.tenagaKerja]; 
                                   n[i].jumlah = e.target.value; 
                                   setDailyReportForm({...dailyReportForm, tenagaKerja: n}); 
                                 }} 
                               />
                               <span className="text-xs font-bold text-slate-500 w-12 shrink-0">Orang</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center flex flex-col items-center justify-center gap-2">
                           <Info size={24} className="text-slate-300" />
                           <p className="text-[10px] font-bold text-slate-400 leading-relaxed">Daftar tenaga kerja belum disetel.<br/>Silakan tambahkan di bawah atau konfigurasi dari Command Center.</p>
                        </div>
                      )}
                      
                      <div className="p-3 bg-[#f8fafc] flex justify-center border-t border-slate-200">
                        <button 
                          type="button" 
                          onClick={addTenagaKerjaRow} 
                          className="text-[10px] font-bold text-blue-600 bg-white border border-blue-200 px-3 py-2 rounded-lg flex items-center justify-center w-full gap-1.5 hover:bg-blue-50 transition-colors shadow-sm uppercase tracking-wide"
                        >
                           <Plus size={14}/> Tambah Tenaga Kerja
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* E & F. CATATAN & FOTO */}
                  <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 space-y-4 w-full shadow-sm">
                    <div>
                      <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-600">E. Catatan / Kendala / Saran</label>
                      <textarea rows="3" value={dailyReportForm.catatan} onChange={e => setDailyReportForm(p => ({ ...p, catatan: e.target.value }))} placeholder="Tuliskan catatan harian atau hambatan..." className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs font-normal shadow-inner resize-y leading-relaxed text-slate-800"></textarea>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-600">F. Dokumentasi Lampiran (Maks. 4)</label>
                      
                      {repFiles.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 mb-3">
                           {repFiles.map((file, idx) => (
                              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-sm">
                                 {file.type.startsWith('image/') ? (
                                    <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                                 ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                                       <Video size={24} className="mb-1 text-slate-400" />
                                       <span className="text-[8px] font-bold truncate px-2 w-full text-center">{file.name}</span>
                                    </div>
                                 )}
                                 <button 
                                    type="button" 
                                    onClick={() => setRepFiles(prev => prev.filter((_, i) => i !== idx))}
                                    className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-lg shadow-md opacity-90 hover:opacity-100 active:scale-90 transition-all"
                                 >
                                    <Trash2 size={14} />
                                 </button>
                              </div>
                           ))}
                        </div>
                      )}

                      {repFiles.length < 4 && (
                        <div className="bg-slate-50 p-3 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden h-14">
                          <input 
                             type="file" 
                             multiple
                             accept="image/*,video/*" 
                             onChange={(e) => {
                               const files = Array.from(e.target.files);
                               const combined = [...repFiles, ...files];
                               if (combined.length > 4) {
                                  showMsg('Maksimal 4 file dokumentasi.', 'error');
                                  setRepFiles(combined.slice(0, 4));
                               } else {
                                  setRepFiles(combined);
                               }
                             }} 
                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                          />
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 py-1">
                             <UploadCloud size={18} className="text-blue-500" />
                             <span>Pilih Foto/Video (Sisa {4 - repFiles.length})</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button type="submit" disabled={isProcessing} className="w-full bg-[#131219] text-white py-3.5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-[#201f29] shadow-[#131219]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs">
                    {isProcessing ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>}
                    {isProcessing ? 'MEMPROSES LAPORAN...' : 'KIRIM LAPORAN'}
                  </button>
                </form>
                )}

                {laporTab === 'lapangan' && (
                  <form onSubmit={handleLaporLapanganSubmit} className="space-y-4 text-left pb-10 animate-in fade-in slide-in-from-bottom-2 w-full">
                    <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm w-full">
                      <h4 className="text-sm font-black uppercase text-slate-700 mb-3 border-b border-slate-100 pb-2 tracking-widest flex items-center gap-2">
                         <MapPin size={16} className="text-emerald-500" /> Pilih Proyek
                      </h4>
                      <select 
                         className="w-full p-2.5 mb-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
                         value={closestProject?.id || ''}
                         onChange={(e) => setClosestProject(projects.find(p => p.id === e.target.value))}
                      >
                         <option value="" disabled>Pilih Proyek...</option>
                         {projects.map(p => <option key={p.id} value={p.id}>{p.pekerjaan}</option>)}
                      </select>
                    </div>
                    <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm w-full">
                      <h4 className="text-sm font-black uppercase text-slate-700 mb-3 border-b border-slate-100 pb-2 tracking-widest flex items-center gap-2">
                         <Camera size={16} className="text-emerald-500" /> Dokumentasi Lapangan
                      </h4>
                      
                      {lapanganFiles.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                           {lapanganFiles.map((file, idx) => (
                              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-sm">
                                 {file.type.startsWith('image/') ? (
                                    <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                                 ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                                       <Video size={24} className="mb-1 text-slate-400" />
                                       <span className="text-[8px] font-bold truncate px-2 w-full text-center">{file.name}</span>
                                    </div>
                                 )}
                                 <button 
                                    type="button" 
                                    onClick={() => setLapanganFiles(prev => prev.filter((_, i) => i !== idx))}
                                    className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-lg shadow-md opacity-90 hover:opacity-100 active:scale-90 transition-all"
                                 >
                                    <Trash2 size={14} />
                                 </button>
                              </div>
                           ))}
                        </div>
                      )}

                      <div className="bg-slate-50 p-4 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden h-20">
                        <input 
                           type="file" 
                           multiple
                           accept="image/*,video/*" 
                           onChange={(e) => {
                             const files = Array.from(e.target.files);
                             setLapanganFiles(prev => [...prev, ...files]);
                           }} 
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className="flex flex-col items-center gap-1 text-slate-500">
                           <UploadCloud size={24} className="text-emerald-500" />
                           <span className="text-[10px] font-bold uppercase tracking-wider">Pilih Foto/Video</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm w-full">
                      <h4 className="text-sm font-black uppercase text-slate-700 mb-3 border-b border-slate-100 pb-2 tracking-widest flex items-center gap-2">
                         <FileText size={16} className="text-emerald-500" /> Catatan / Keterangan
                      </h4>
                      <textarea 
                        rows="6" 
                        value={lapanganCatatan} 
                        onChange={e => setLapanganCatatan(e.target.value)} 
                        placeholder="Tuliskan keterangan lapangan di sini... Jika ada masalah, sertakan kata 'kendala' agar ditandai sebagai isu." 
                        className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs font-normal shadow-inner resize-y leading-relaxed text-slate-800"
                      ></textarea>
                    </div>

                    <button type="submit" disabled={isProcessing} className="w-full bg-[#131219] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#131219]/30 hover:bg-[#201f29] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 text-xs mt-2">
                      {isProcessing ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} strokeWidth={2.5} />}
                      {isProcessing ? 'MENGIRIM...' : 'KIRIM'}
                    </button>
                  </form>
                )}

                {/* MODAL KONFIRMASI HAPUS BARIS FORM */}
                {confirmDeleteFormItem && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
                    <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative text-center">
                      <div className="mx-auto w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-5">
                        <AlertCircle size={28} />
                      </div>
                      <h3 className="text-xl font-black mb-2 text-slate-800">Hapus Baris Ini?</h3>
                      <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed">
                        Baris yang dihapus dari form tidak dapat dikembalikan.
                      </p>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setConfirmDeleteFormItem(null)} className="flex-1 py-3.5 bg-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">Batal</button>
                        <button type="button" onClick={executeDeleteFormItem} className="flex-1 py-3.5 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors shadow-md">Ya, Hapus</button>
                      </div>
                    </div>
                  </div>
                )}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
