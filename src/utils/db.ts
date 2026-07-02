import { Registration, RegistrationStatus, PaymentMethod, Announcement, SystemStats } from '../types';
import { MOCK_REGISTRATIONS, GALLERY_IMAGES } from '../data';

const REGISTRATIONS_KEY = 'summer_camp_2027_registrations';
const STATS_KEY = 'summer_camp_2027_stats';
const ANNOUNCEMENTS_KEY = 'summer_camp_2027_announcements';
const CURRENT_USER_KEY = 'summer_camp_2027_current_user';
const GALLERY_KEY = 'summer_camp_2027_gallery';
const VIDEO_KEY = 'summer_camp_2027_video_url';

const DEFAULT_VIDEO_URL = 'https://www.kapwing.com/e/6a456e967d73370f680d63c9'; // Real retiro highlights from Kapwing

export interface LoggedInUser {
  role: 'admin' | 'participant';
  email: string;
  registrationCode?: string;
  fullName: string;
  id?: string;
}

// Initial announcements list
const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Inscrições Abertas!',
    content: 'Fala galera! As inscrições para o Summer Camp 2027 já estão oficialmente abertas. Garanta sua vaga com preço promocional.',
    type: 'Todos',
    sentAt: '2026-06-25T14:00:00.000Z',
    recipientCount: 5
  },
  {
    id: 'ann-2',
    title: 'Camisas do Retiro',
    content: 'Atenção inscritos: Por favor verifiquem seu tamanho de camisa na Área do Participante até o fim do mês para confecção.',
    type: 'WhatsApp',
    sentAt: '2026-06-29T10:30:00.000Z',
    recipientCount: 5
  }
];

export function initDB() {
  if (!localStorage.getItem(REGISTRATIONS_KEY)) {
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(MOCK_REGISTRATIONS));
  }
  if (!localStorage.getItem(ANNOUNCEMENTS_KEY)) {
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(INITIAL_ANNOUNCEMENTS));
  }
  if (!localStorage.getItem(STATS_KEY)) {
    localStorage.setItem(STATS_KEY, JSON.stringify({
      filledSpots: 52, // Start with 52 pre-filled spots out of 80 as requested
      totalSpots: 80,
      totalRevenue: 26000, // Based on initial confirmados (52 * 500)
      pendingAmount: 875
    }));
  }
  const storedGallery = localStorage.getItem(GALLERY_KEY);
  if (!storedGallery) {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(GALLERY_IMAGES));
  } else {
    try {
      let parsed = JSON.parse(storedGallery);
      // Remove the requested mock images (g-1, g-2, g-3, g-4) if present
      const filtered = parsed.filter((img: any) => img && img.id && !['g-1', 'g-2', 'g-3', 'g-4'].includes(img.id));
      
      // Check for any missing images from GALLERY_IMAGES and add them
      const storedIds = new Set(filtered.map((img: any) => img.id));
      const missing = GALLERY_IMAGES.filter(img => !storedIds.has(img.id));
      
      if (filtered.length !== parsed.length || missing.length > 0) {
        localStorage.setItem(GALLERY_KEY, JSON.stringify([...filtered, ...missing]));
      }
    } catch (e) {
      localStorage.setItem(GALLERY_KEY, JSON.stringify(GALLERY_IMAGES));
    }
  }
  const currentVideo = localStorage.getItem(VIDEO_KEY);
  if (!currentVideo || currentVideo === 'https://www.youtube.com/embed/WJ69r9sHn8I') {
    localStorage.setItem(VIDEO_KEY, DEFAULT_VIDEO_URL);
  }
}

export function getRegistrations(): Registration[] {
  initDB();
  const data = localStorage.getItem(REGISTRATIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveRegistrations(regs: Registration[]) {
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(regs));
  updateStats();
}

export function getStats(): SystemStats {
  initDB();
  const statsStr = localStorage.getItem(STATS_KEY);
  if (statsStr) {
    const statsObj = JSON.parse(statsStr);
    // Dynamically calculate based on custom additions
    const regs = getRegistrations();
    const customRegsCount = regs.filter(r => !r.id.startsWith('reg-')).length;
    
    const baseFilled = 52;
    const filled = baseFilled + customRegsCount;
    
    // Calculate financial totals
    let totalRevenue = 0;
    let pendingAmount = 0;
    
    regs.forEach(r => {
      if (r.status === RegistrationStatus.CONFIRMED) {
        totalRevenue += r.amountPaid;
      } else if (r.status === RegistrationStatus.PENDING) {
        totalRevenue += r.amountPaid;
        pendingAmount += (500 - r.amountPaid);
      }
    });

    const stats: SystemStats = {
      filledSpots: Math.min(filled, 80),
      totalSpots: 80,
      totalRevenue: 26000 + (totalRevenue - 1625), // offset by initial mock values
      pendingAmount: 875 + pendingAmount
    };
    
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return stats;
  }
  return { filledSpots: 52, totalSpots: 80, totalRevenue: 26000, pendingAmount: 875 };
}

function updateStats() {
  getStats();
}

export function addRegistration(reg: Omit<Registration, 'id' | 'createdAt' | 'registrationCode' | 'status' | 'amountPaid'>): Registration {
  const regs = getRegistrations();
  
  // Generate code e.g. SC27-X4T9
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomCode = '';
  for (let i = 0; i < 4; i++) {
    randomCode += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  const registrationCode = `SC27-${randomCode}`;
  
  const newReg: Registration = {
    ...reg,
    id: `custom-reg-${Date.now()}`,
    registrationCode,
    status: RegistrationStatus.PENDING,
    amountPaid: 0,
    createdAt: new Date().toISOString()
  };
  
  regs.push(newReg);
  saveRegistrations(regs);
  
  return newReg;
}

export function updateRegistrationStatus(id: string, status: RegistrationStatus, amountPaid?: number): Registration[] {
  const regs = getRegistrations();
  const index = regs.findIndex(r => r.id === id);
  if (index !== -1) {
    regs[index].status = status;
    if (amountPaid !== undefined) {
      regs[index].amountPaid = amountPaid;
    } else if (status === RegistrationStatus.CONFIRMED) {
      regs[index].amountPaid = 500; // Full value
    }
    saveRegistrations(regs);
  }
  return regs;
}

export function deleteRegistration(id: string): Registration[] {
  const regs = getRegistrations();
  const filtered = regs.filter(r => r.id !== id);
  saveRegistrations(filtered);
  return filtered;
}

export function getAnnouncements(): Announcement[] {
  initDB();
  const data = localStorage.getItem(ANNOUNCEMENTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function addAnnouncement(title: string, content: string, type: 'WhatsApp' | 'E-mail' | 'Todos'): Announcement {
  const list = getAnnouncements();
  const regs = getRegistrations();
  const newAnn: Announcement = {
    id: `ann-${Date.now()}`,
    title,
    content,
    type,
    sentAt: new Date().toISOString(),
    recipientCount: regs.length
  };
  list.unshift(newAnn);
  localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(list));
  return newAnn;
}

export function getCurrentUser(): LoggedInUser | null {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function login(email: string, codeOrCpf: string): LoggedInUser | null {
  initDB();
  
  // Standard Admin Account
  if (email.toLowerCase().trim() === 'admin@convictos.com' && codeOrCpf.trim() === 'admin123') {
    const adminUser: LoggedInUser = {
      role: 'admin',
      email: 'admin@convictos.com',
      fullName: 'Administrador Convictos'
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
    return adminUser;
  }
  
  // Participant Account lookup
  const regs = getRegistrations();
  const found = regs.find(
    r => r.email.toLowerCase().trim() === email.toLowerCase().trim() && 
    (r.registrationCode.toLowerCase().trim() === codeOrCpf.toLowerCase().trim() || 
     r.cpf.replace(/\D/g, '') === codeOrCpf.replace(/\D/g, ''))
  );
  
  if (found) {
    const participantUser: LoggedInUser = {
      role: 'participant',
      email: found.email,
      registrationCode: found.registrationCode,
      fullName: found.fullName,
      id: found.id
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(participantUser));
    return participantUser;
  }
  
  return null;
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getGalleryImages(): any[] {
  initDB();
  const data = localStorage.getItem(GALLERY_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveGalleryImages(images: any[]) {
  localStorage.setItem(GALLERY_KEY, JSON.stringify(images));
}

export function addGalleryImage(url: string, title: string, category: string): any[] {
  const images = getGalleryImages();
  const newImage = {
    id: `g-custom-${Date.now()}`,
    url,
    title,
    category
  };
  images.unshift(newImage);
  saveGalleryImages(images);
  return images;
}

export function deleteGalleryImage(id: string): any[] {
  const images = getGalleryImages();
  const filtered = images.filter((img: any) => img.id !== id);
  saveGalleryImages(filtered);
  return filtered;
}

export function formatEmbedUrl(url: string): string {
  if (!url) return '';
  url = url.trim();

  // 1. Kapwing:
  // Examples:
  // https://www.kapwing.com/videos/6a456e967d73370f680d63c9
  // https://www.kapwing.com/w/6a456e967d73370f680d63c9
  // https://www.kapwing.com/e/6a456e967d73370f680d63c9
  const kapwingMatch = url.match(/kapwing\.com\/(?:videos|w|e)\/([a-zA-Z0-9]+)/i);
  if (kapwingMatch) {
    return `https://www.kapwing.com/e/${kapwingMatch[1]}`;
  }

  // 2. YouTube:
  // Examples:
  // https://www.youtube.com/watch?v=WJ69r9sHn8I
  // https://youtu.be/WJ69r9sHn8I
  // https://www.youtube.com/embed/WJ69r9sHn8I
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  return url;
}

export function getPromoVideo(): string {
  initDB();
  const url = localStorage.getItem(VIDEO_KEY);
  return formatEmbedUrl(url || DEFAULT_VIDEO_URL);
}

export function savePromoVideo(url: string) {
  localStorage.setItem(VIDEO_KEY, formatEmbedUrl(url));
}
