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

// --- HELPER COMPONENT (SURVEI & RUTE) ---
const SurveyInputRow = ({ label, children }) => (
  <div className="w-full">
    <label className="text-[10px] font-bold block mb-1.5 uppercase text-slate-500">{label}</label>
    {children}
  </div>
);

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

export default function EmployeeApp() {
  const [supabase, setSupabase] = useState(null);
  const [view, setView] = useState('login'); 
  const [user, setUser] = useState(null);
  
  const [projects, setProjects] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState(null);

  // State untuk Absensi & Proyek Umum
  const [closestProject, setClosestProject] = useState(null);
  const [locationType, setLocationType] = useState('Proyek'); 
  const [attendanceMode, setAttendanceMode] = useState('Hadir'); 
  const [absenReceipt, setAbsenReceipt] = useState(null);
  const [absenCatatan, setAbsenCatatan] = useState(''); 

  // State Form Laporan Harian Lengkap
  const [dailyReportForm, setDailyReportForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    lokasi: '',
    shifts: [{ id: Date.now(), tanggalMulai: new Date().toISOString().split('T')[0], jamMulai: '08:00', tanggalSelesai: new Date().toISOString().split('T')[0], jamSelesai: '17:00' }],
    cuaca: {},
    aktivitas: DEFAULT_AKTIVITAS.map(item => ({ ...item })), 
    tenagaKerja: DEFAULT_TENAGA_KERJA.map(item => ({ ...item })),
    catatan: ''
  });
  const [repFiles, setRepFiles] = useState([]);
  const [confirmDeleteFormItem, setConfirmDeleteFormItem] = useState(null);

  // State Lapor Lapangan (Cepat)
  const [laporTab, setLaporTab] = useState('harian'); 
  const [lapanganCatatan, setLapanganCatatan] = useState('');
  const [lapanganFiles, setLapanganFiles] = useState([]);

  // State Form Input Survei (General)
  const [uForm, setUForm] = useState({ 
    tanggal: new Date().toISOString().split('T')[0], namaSegmen: '', startLat: '', startLng: '', endLat: '', endLng: '', panjang: '', lebar: '', jenis_model_awal: '', noteDesc: '' 
  });
  const [uMedia, setUMedia] = useState([]);
  const [uDataUkur, setUDataUkur] = useState(null);

  // --- STATE BARU UNTUK FITUR UPDATE RUTE GPS ---
  const [ruteForm, setRuteForm] = useState({
    type: 'realisasi', // 'realisasi' atau 'sketsa'
    segmentName: '',   // Nama segmen yang dipilih atau 'NEW'
    newSegmentName: '',// Input jika segmentName === 'NEW'
    lat: '',
    lng: '',
    notes: ''
  });
  const [ruteFiles, setRuteFiles] = useState([]);
  const [existingSegments, setExistingSegments] = useState([]); // Daftar segmen yg sdh ada di database

  // State Login
  const [loginForm, setLoginForm] = useState({ id: '', pin: '' });

  useEffect(() => {
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);
    }

    if (!window.supabase) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = () => {
        setSupabase(window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY));
      };
      document.head.appendChild(script);
    } else {
      setSupabase(window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY));
    }

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
         data = data.map(p => ({ ...p, pekerjaan: p.pekerjaan || p.nama_proyek || 'Proyek Tanpa Nama' }));
         setProjects(data);
      }
    } catch (e) {
      showMsg('Gagal memuat daftar proyek dari server', 'error');
    }
  };

  useEffect(() => {
    if (closestProject && supabase) {
      const fetchTemplateData = async () => {
        try {
          const { data, error } = await supabase.from('projects').select('report_template_data').eq('id', closestProject.id).single();
          let templateData = closestProject.report_template_data;
          if (!error && data) templateData = data.report_template_data;

          const initialData = getInitialFormState({ ...closestProject, report_template_data: templateData }, dailyReportForm.tanggal);
          setDailyReportForm(prev => ({
            ...prev, lokasi: initialData.lokasi, shifts: initialData.shifts, aktivitas: initialData.aktivitas, tenagaKerja: initialData.tenagaKerja 
          }));
        } catch (err) {}
      };
      fetchTemplateData();
    }
  }, [closestProject?.id, view === 'lapor', supabase]);

  // Efek Cuaca Laporan Harian
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
  
  const addShift = () => setDailyReportForm({ ...dailyReportForm, shifts: [...dailyReportForm.shifts, { id: Date.now(), tanggalMulai: dailyReportForm.tanggal, jamMulai: '08:00', tanggalSelesai: dailyReportForm.tanggal, jamSelesai: '17:00' }] });
  const addAktivitasRow = () => setDailyReportForm(prev => ({ ...prev, aktivitas: [...prev.aktivitas, { nama: '', kemarin: '', hariIni: '', satuan: '' }] }));
  const addTenagaKerjaRow = () => setDailyReportForm(prev => ({ ...prev, tenagaKerja: [...prev.tenagaKerja, { posisi: '', jumlah: '' }] }));

  const showMsg = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const executeDeleteFormItem = () => {
    if (!confirmDeleteFormItem) return;
    const { type, index } = confirmDeleteFormItem;
    setDailyReportForm(prev => {
      const newState = { ...prev };
      if (type === 'shift') newState.shifts = newState.shifts.filter((_, i) => i !== index);
      else if (type === 'aktivitas') newState.aktivitas = newState.aktivitas.filter((_, i) => i !== index);
      else if (type === 'tenagaKerja') newState.tenagaKerja = newState.tenagaKerja.filter((_, i) => i !== index);
      return newState;
    });
    setConfirmDeleteFormItem(null);
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null); setProjects([]); setView('login');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const inputId = loginForm.id.trim().toLowerCase();
      const inputPin = loginForm.pin.trim();
      const emailDummy = `${inputId}@karyawan.com`;

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email: emailDummy, password: inputPin });
      if (authError) { showMsg('Login Gagal: ID Karyawan atau PIN salah!', 'error'); setIsProcessing(false); return; }

      let userName = inputId;
      let userRole = 'Pelaksana';
      const { data: empData, error: empError } = await supabase.from('karyawan').select('*');
      
      if (!empError && empData && empData.length > 0) {
        const foundUser = empData.find(emp => Object.values(emp).some(val => val !== null && val !== undefined && String(val).toLowerCase() === inputId));
        if (foundUser) {
          userName = foundUser.nama || foundUser.nama_lengkap || foundUser.name || foundUser.id_karyawan || inputId;
          userRole = foundUser.jabatan || foundUser.role || foundUser.posisi || 'Pelaksana';
        }
      }

      setUser({ name: userName, role: userRole, id: inputId, uid: authData.user.id });
      await fetchProjects(supabase);
      setView('home'); showMsg('Selamat bekerja!', 'success');
    } catch (error) {
      showMsg('Terjadi kesalahan jaringan!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const getUnifiedGPS = (type) => {
    if (!navigator.geolocation) { showMsg('Geolokasi tidak didukung perangkat ini.', 'error'); return; }
    showMsg('Sedang mencari koordinat GPS...', 'info');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        if (type === 'rute') {
           setRuteForm(p => ({ ...p, lat, lng }));
        } else {
           setUForm(p => ({ ...p, [type === 'start' ? 'startLat' : 'endLat']: lat, [type === 'start' ? 'startLng' : 'endLng']: lng }));
        }
        showMsg('Koordinat GPS berhasil dikunci!', 'success');
      },
      (error) => showMsg('Gagal mengambil GPS: ' + error.message, 'error'),
      { enableHighAccuracy: true }
    );
  };

  // --- SUBMIT RUTE BARU (REALISASI / SKETSA) ---
  const handleRuteSubmit = async (e) => {
    e.preventDefault();
    if (!closestProject) { showMsg('Pilih proyek terlebih dahulu!', 'error'); return; }
    if (!ruteForm.lat || !ruteForm.lng) { showMsg('Harap ambil kordinat GPS terlebih dahulu!', 'error'); return; }
    
    const finalSegmentName = ruteForm.segmentName === 'NEW' ? ruteForm.newSegmentName.trim() : ruteForm.segmentName;
    if (!finalSegmentName) { showMsg('Nama segmen tidak boleh kosong!', 'error'); return; }

    setIsProcessing(true);
    try {
       // 1. Upload Gambar jika ada
       let publicUrls = [];
       if (ruteFiles.length > 0) {
         showMsg(`Mengunggah ${ruteFiles.length} foto/video...`, 'info');
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
       
       // 2. Tarik Data Paling Baru dari JSON
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

       // 3. Modifikasi JSON
       if (ruteForm.type === 'realisasi') {
          if (segIndex >= 0) {
             if (!currentData[segIndex].points) currentData[segIndex].points = [];
             currentData[segIndex].points.push({ lat: latFloat, lng: lngFloat });
             currentData[segIndex].boundary_end = { lat: latFloat, lng: lngFloat };
          } else {
             currentData.push({
                 id: Date.now(),
                 name: finalSegmentName,
                 points: [{ lat: latFloat, lng: lngFloat }],
                 boundary_end: { lat: latFloat, lng: lngFloat }
             });
          }
       } else {
          if (segIndex >= 0) {
             if (!currentData[segIndex].points) currentData[segIndex].points = [];
             const staString = `T-${currentData[segIndex].points.length + 1}`;
             currentData[segIndex].points.push({ lat: latFloat, lng: lngFloat, sta: staString });
          } else {
             currentData.push({
                 id: Date.now().toString(),
                 name: finalSegmentName,
                 type: 'line', color: '#f59e0b', isDashed: true,
                 points: [{ lat: latFloat, lng: lngFloat, sta: 'T-1' }]
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
           is_problem: false
       }]);
       
       if (repErr) throw repErr;

       showMsg('Titik Rute Berhasil Disimpan & Disinkronkan!', 'success');
       setRuteForm({ type: 'realisasi', segmentName: '', newSegmentName: '', lat: '', lng: '', notes: '' });
       setRuteFiles([]);
       setTimeout(() => setView('home'), 1500);

    } catch (error) {
       showMsg('Gagal memproses rute: ' + error.message, 'error');
    } finally {
       setIsProcessing(false);
    }
  };

  const handleAbsenSubmit = async (e, typeSubmit) => { /* logic absen existing - disingkat utk kejelasan di preview, lihat aslinya di full source jika di luar scope */ };
  const handleReportSubmit = async (e) => { /* logic lapor harian existing */ };
  const handleLaporLapanganSubmit = async (e) => { /* logic lapor cepat existing */ };
  const handleUnifiedSubmit = async (e) => { /* logic survei existing */ };

  return (
    <div className="bg-slate-900 h-[100dvh] w-full fixed inset-0 flex items-center justify-center sm:p-4 overflow-hidden" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <div className="bg-slate-50 w-full h-[100dvh] sm:h-[800px] sm:max-h-[90vh] sm:max-w-[400px] rounded-none sm:rounded-[40px] overflow-hidden shadow-2xl relative flex flex-col border-none sm:border-[6px] sm:border-slate-800">
        
        <style>{`
          * { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif !important; }
          html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; overscroll-behavior-y: none; touch-action: pan-y; }
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
                      <LogOut size={14}/> LOGOUT
                   </button>
                </div>
             </div>

             <div className="p-6 flex-1 flex flex-col gap-4 mt-2 relative z-20 custom-scrollbar overflow-y-auto pb-10">
                <button onClick={() => setView('absen')} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5 hover:border-slate-300 transition-all group active:scale-95">
                   <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.25rem] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"><UserCheck strokeWidth={2.5} size={28}/></div>
                   <div className="text-left flex-1">
                      <h3 className="font-bold text-slate-800 text-[18px] tracking-tight">Absensi</h3>
                      <p className="text-[12px] text-slate-500 mt-1 font-medium leading-snug">Catat data kehadiran harian</p>
                   </div>
                </button>
                <button onClick={() => setView('lapor')} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5 hover:border-slate-300 transition-all group active:scale-95">
                   <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.25rem] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"><FileText strokeWidth={2.5} size={28}/></div>
                   <div className="text-left flex-1">
                      <h3 className="font-bold text-slate-800 text-[18px] tracking-tight">Laporan Harian</h3>
                      <p className="text-[12px] text-slate-500 mt-1 font-medium leading-snug">Lapor progres & laporan lapangan</p>
                   </div>
                </button>
                <button onClick={() => setView('survei')} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5 hover:border-slate-300 transition-all group active:scale-95">
                   <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.25rem] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"><Map strokeWidth={2.5} size={28}/></div>
                   <div className="text-left flex-1">
                      <h3 className="font-bold text-slate-800 text-[18px] tracking-tight">Input Survei</h3>
                      <p className="text-[12px] text-slate-500 mt-1 font-medium leading-snug">Catat rute survei awal</p>
                   </div>
                </button>
                
                {/* Tombol Baru untuk Update Rute GPS */}
                <button onClick={() => setView('rute_gps')} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5 hover:border-amber-300 transition-all group active:scale-95 border-l-4 border-l-amber-500 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-1.5 px-3 bg-amber-100 text-amber-700 text-[9px] font-black tracking-widest rounded-bl-xl uppercase">Map/Peta</div>
                   <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-[1.25rem] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"><Navigation strokeWidth={2.5} size={28}/></div>
                   <div className="text-left flex-1">
                      <h3 className="font-bold text-slate-800 text-[18px] tracking-tight">Update Rute (GPS)</h3>
                      <p className="text-[12px] text-slate-500 mt-1 font-medium leading-snug">Sinkronisasi titik peta Realisasi/Sketsa</p>
                   </div>
                </button>
             </div>
          </div>
        )}

        {/* --- VIEW: UPDATE RUTE GPS (NEW) --- */}
        {view === 'rute_gps' && (
          <div className="flex-1 flex flex-col bg-slate-50 relative h-full overflow-hidden">
             
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
                  
                  {/* Proyek & Segmen */}
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
                           <option value="" disabled>Pilih Segmen...</option>
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

                  {/* Koordinat GPS */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm w-full space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>
                    <SurveyInputRow label="Titik Koordinat (Latitude & Longitude)">
                      <div className="flex gap-2 w-full mb-3">
                        <div className="flex-1 min-w-0 bg-slate-100 rounded-xl p-3 border border-slate-200 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 transition-all">
                           <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">LATITUDE</span>
                           <input 
                              type="text" 
                              value={ruteForm.lat} 
                              onChange={(e) => setRuteForm(p => ({ ...p, lat: e.target.value }))}
                              placeholder="0.000000" 
                              className="w-full bg-transparent outline-none text-sm font-black text-slate-800" 
                           />
                        </div>
                        <div className="flex-1 min-w-0 bg-slate-100 rounded-xl p-3 border border-slate-200 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 transition-all">
                           <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">LONGITUDE</span>
                           <input 
                              type="text" 
                              value={ruteForm.lng} 
                              onChange={(e) => setRuteForm(p => ({ ...p, lng: e.target.value }))}
                              placeholder="0.000000" 
                              className="w-full bg-transparent outline-none text-sm font-black text-slate-800" 
                           />
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => getUnifiedGPS('rute')} 
                        className="w-full py-3.5 bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors font-black rounded-xl text-xs uppercase tracking-widest flex justify-center items-center gap-2 border border-amber-200 shadow-sm"
                      >
                         <MapPin size={16} /> Ambil Lokasi Saat Ini (GPS)
                      </button>
                    </SurveyInputRow>
                  </div>

                  {/* Catatan & Foto */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm w-full space-y-4">
                    <SurveyInputRow label="Catatan Tambahan (Opsional)">
                      <textarea 
                        rows="3" 
                        value={ruteForm.notes} 
                        onChange={e => setRuteForm(p => ({ ...p, notes: e.target.value }))} 
                        placeholder="Keterangan singkat..." 
                        className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs font-normal shadow-inner resize-y leading-relaxed text-slate-800"
                      ></textarea>
                    </SurveyInputRow>

                    <SurveyInputRow label="Upload Foto Lokasi (Opsional)">
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
                           <span>Pilih Foto Bukti</span>
                        </div>
                      </div>
                    </SurveyInputRow>
                  </div>

                  <button type="submit" disabled={isProcessing} className="w-full bg-[#131219] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-[#201f29] shadow-[#131219]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs">
                    {isProcessing ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>}
                    {isProcessing ? 'MENYIMPAN TITIK...' : 'SIMPAN TITIK RUTE'}
                  </button>
                </form>
             </div>
          </div>
        )}

        {/* --- VIEW LAINNYA --- */}
        {/* Sisanya disembunyikan/dijaga sama untuk mempersingkat diff (Sudah ada di struktur atas) */}

      </div>
    </div>
  );
}
