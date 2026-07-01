export enum RegistrationStatus {
  PENDING = 'Pendente',
  CONFIRMED = 'Confirmado',
  CANCELLED = 'Cancelado'
}

export enum PaymentMethod {
  PIX = 'PIX',
  CARD = 'Cartão de Crédito',
  CASH = 'Dinheiro',
  INSTALLMENT = 'Parcelado'
}

export enum TshirtSize {
  PP = 'PP',
  P = 'P',
  M = 'M',
  G = 'G',
  GG = 'GG',
  XG = 'XG'
}

export interface Registration {
  id: string;
  fullName: string;
  birthDate: string;
  cpf: string;
  rg: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  church: string;
  leader: string;
  hasAllergies: boolean;
  allergiesDetails: string;
  hasMedications: boolean;
  medicationsDetails: string;
  emergencyContact: string;
  tshirtSize: TshirtSize;
  paymentMethod: PaymentMethod;
  status: RegistrationStatus;
  createdAt: string;
  registrationCode: string;
  amountPaid: number;
  installmentsCount?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'WhatsApp' | 'E-mail' | 'Todos';
  sentAt: string;
  recipientCount: number;
}

export interface SystemStats {
  filledSpots: number;
  totalSpots: number;
  totalRevenue: number;
  pendingAmount: number;
}
