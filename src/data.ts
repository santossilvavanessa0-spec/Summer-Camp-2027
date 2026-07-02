import { Registration, RegistrationStatus, PaymentMethod, TshirtSize } from './types';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface HighlightItem {
  id: string;
  title: string;
  description: string;
  iconName: 'Flame' | 'Music' | 'Activity' | 'Trophy' | 'Trees' | 'Utensils' | 'Users' | 'Heart';
}

export interface TimelineDay {
  day: string;
  title: string;
  events: string[];
}

export const FAQs: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Quem pode participar?',
    answer: 'O Summer Camp 2027 é destinado a jovens e adolescentes a partir de 12 anos de idade que buscam uma experiência profunda com Deus, amizades e diversão.'
  },
  {
    id: 'faq-2',
    question: 'Qual a idade mínima?',
    answer: 'A idade mínima recomendada é de 12 anos completos até a data do evento.'
  },
  {
    id: 'faq-3',
    question: 'O que levar na mala?',
    answer: 'Bíblia, caderno de anotações, roupas confortáveis para gincanas (que possam sujar), roupas de banho (compostura cristã), itens de higiene pessoal, roupa de cama e banho, repelente, protetor solar, medicamentos de uso contínuo e muita disposição!'
  },
  {
    id: 'faq-4',
    question: 'Como funciona o parcelamento e formas de pagamento?',
    answer: 'Oferecemos pagamento via PIX, Cartão de Crédito (com opção de parcelamento em até 10x) ou Dinheiro. A vaga é confirmada mediante o pagamento ou confirmação do PIX/Cartão.'
  },
  {
    id: 'faq-5',
    question: 'Como chegar ao local?',
    answer: 'O transporte de ida e volta já está INCLUSO no valor do retiro. Sairemos todos juntos de ônibus fretado da IEQ Inhoaíba. Mais detalhes e horários de saída serão comunicados no grupo oficial de inscritos.'
  }
];

export const HIGHLIGHTS: HighlightItem[] = [
  {
    id: 'h-1',
    title: 'Oficinas Temáticas',
    description: 'Bate-papo de valor, aconselhamento e palestras focadas nas dúvidas reais da juventude de hoje.',
    iconName: 'Flame'
  },
  {
    id: 'h-2',
    title: 'Louvor & Adoração',
    description: 'Momentos intensos de adoração conduzidos pelo nosso ministério de louvor, tocando o trono de Deus.',
    iconName: 'Music'
  },
  {
    id: 'h-3',
    title: 'Gincanas Radicais',
    description: 'Circuitos desafiadores, lama, trabalho em equipe e muita adrenalina para agitar as tardes do retiro.',
    iconName: 'Activity'
  },
  {
    id: 'h-4',
    title: 'Competicões & Troféu',
    description: 'Dispute campeonatos esportivos e gincanas com sua equipe para conquistar o grande troféu de 2027!',
    iconName: 'Trophy'
  },
  {
    id: 'h-5',
    title: 'Contato com a Natureza',
    description: 'Um sítio incrível, amplo, com piscinas, campos de futebol e cercado por uma área verde revigorante.',
    iconName: 'Trees'
  },
  {
    id: 'h-6',
    title: 'Alimentação Inclusa',
    description: 'Café da manhã, almoço, lanche da tarde e jantar completos todos os dias, preparados com muito carinho.',
    iconName: 'Utensils'
  },
  {
    id: 'h-7',
    title: 'Novas Amizades',
    description: 'Conecte-se com jovens incríveis, fortaleça laços de comunhão e crie memórias que durarão a vida inteira.',
    iconName: 'Users'
  },
  {
    id: 'h-8',
    title: 'Tempo com Deus',
    description: 'Devocionais matinais e momentos individuais na natureza para escutar a doce voz do Espírito Santo.',
    iconName: 'Heart'
  }
];

export const TIMELINE: TimelineDay[] = [
  {
    day: 'Dia 1',
    title: 'Embarque & Abertura',
    events: [
      'Check-in e Embarque na IEQ Inhoaíba',
      'Chegada ao Sítio & Acomodação nos Quartos',
      'Grande Culto de Abertura (Start!)',
      'Integração Geral & Lanche Noturno'
    ]
  },
  {
    day: 'Dia 2',
    title: 'Conexão & Adrenalina',
    events: [
      'Devocional Matinal & Café da Manhã',
      'Gincana Geral - Primeira Etapa',
      'Almoço Especial',
      'Oficinas Temáticas & Bate-Papo',
      'Noite de Louvor e Ministração Profunda'
    ]
  },
  {
    day: 'Dia 3',
    title: 'Desafios & Fogo',
    events: [
      'Oração ao Ar Livre & Café da Manhã',
      'Finais das Competições Esportivas',
      'Almoço & Tempo Livre nas Piscinas',
      'Dinâmicas Especiais de Integração',
      'Culto da Fogueira (Clamor e Espírito Santo)'
    ]
  },
  {
    day: 'Dia 4',
    title: 'Encerramento & Aliança',
    events: [
      'Café da Manhã de Despedida',
      'Grande Culto de Celebração',
      'Entrega de Premiações & Troféus',
      'Foto Oficial e Embarque de Retorno'
    ]
  }
];

// Elegant initial mock registrations
export const MOCK_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-1',
    fullName: 'Ana Julia de Souza',
    birthDate: '2008-04-12',
    cpf: '123.456.789-01',
    rg: '23.456.789-0',
    phone: '(21) 98765-4321',
    whatsapp: '(21) 98765-4321',
    email: 'anajulia@example.com',
    address: 'Estrada do Campinho, 1200 - Campo Grande, RJ',
    church: 'IEQ Inhoaíba',
    leader: 'Lucas e Amanda',
    hasAllergies: false,
    allergiesDetails: '',
    hasMedications: false,
    medicationsDetails: '',
    emergencyContact: 'Mãe: Cláudia (21) 99999-8888',
    tshirtSize: TshirtSize.M,
    paymentMethod: PaymentMethod.PIX,
    status: RegistrationStatus.CONFIRMED,
    createdAt: '2026-06-25T14:30:00.000Z',
    registrationCode: 'SC27-A8B9',
    amountPaid: 500
  },
  {
    id: 'reg-2',
    fullName: 'Mateus Oliveira Costa',
    birthDate: '2005-09-22',
    cpf: '987.654.321-02',
    rg: '12.345.678-9',
    phone: '(21) 99888-7766',
    whatsapp: '(21) 99888-7766',
    email: 'mateus.costa@example.com',
    address: 'Rua Seis, 45 - Inhoaíba, RJ',
    church: 'IEQ Inhoaíba',
    leader: 'Lucas e Amanda',
    hasAllergies: true,
    allergiesDetails: 'Alergia a picada de abelha',
    hasMedications: false,
    medicationsDetails: '',
    emergencyContact: 'Pai: Roberto (21) 98877-6655',
    tshirtSize: TshirtSize.G,
    paymentMethod: PaymentMethod.CARD,
    status: RegistrationStatus.CONFIRMED,
    createdAt: '2026-06-28T10:15:00.000Z',
    registrationCode: 'SC27-F5G4',
    amountPaid: 500
  },
  {
    id: 'reg-3',
    fullName: 'Gabriela Lima Santos',
    birthDate: '2009-11-05',
    cpf: '456.789.123-03',
    rg: '34.567.890-1',
    phone: '(21) 97766-5544',
    whatsapp: '(21) 97766-5544',
    email: 'gabi.lima@example.com',
    address: 'Av. Cesário de Melo, 5500 - Cosmos, RJ',
    church: 'IEQ Cosmos',
    leader: 'Pastor Marcos',
    hasAllergies: false,
    allergiesDetails: '',
    hasMedications: true,
    medicationsDetails: 'Toma antialérgico se tiver crise de rinite',
    emergencyContact: 'Mãe: Sandra (21) 96655-4433',
    tshirtSize: TshirtSize.P,
    paymentMethod: PaymentMethod.PIX,
    status: RegistrationStatus.PENDING,
    createdAt: '2026-06-29T18:40:00.000Z',
    registrationCode: 'SC27-Y2T1',
    amountPaid: 125, // Paid 1st installment
    installmentsCount: 4
  },
  {
    id: 'reg-4',
    fullName: 'Lucas Fernandes Pereira',
    birthDate: '2006-01-15',
    cpf: '321.654.987-04',
    rg: '45.678.901-2',
    phone: '(21) 96655-4422',
    whatsapp: '(21) 96655-4422',
    email: 'lucas.fernandes@example.com',
    address: 'Rua do Horto, 321 - Campo Grande, RJ',
    church: 'IEQ Inhoaíba',
    leader: 'Lucas e Amanda',
    hasAllergies: false,
    allergiesDetails: '',
    hasMedications: false,
    medicationsDetails: '',
    emergencyContact: 'Pai: José (21) 95544-3322',
    tshirtSize: TshirtSize.GG,
    paymentMethod: PaymentMethod.CASH,
    status: RegistrationStatus.PENDING,
    createdAt: '2026-06-30T09:00:00.000Z',
    registrationCode: 'SC27-K7M9',
    amountPaid: 0
  },
  {
    id: 'reg-5',
    fullName: 'Beatriz Rezende Rocha',
    birthDate: '2007-07-07',
    cpf: '789.123.456-05',
    rg: '56.789.012-3',
    phone: '(21) 95544-3311',
    whatsapp: '(21) 95544-3311',
    email: 'bia.rocha@example.com',
    address: 'Rua Marcolina, 12 - Campo Grande, RJ',
    church: 'Assembleia de Deus',
    leader: 'Pr. Gilberto',
    hasAllergies: false,
    allergiesDetails: '',
    hasMedications: false,
    medicationsDetails: '',
    emergencyContact: 'Tia: Márcia (21) 94433-2211',
    tshirtSize: TshirtSize.M,
    paymentMethod: PaymentMethod.PIX,
    status: RegistrationStatus.CONFIRMED,
    createdAt: '2026-06-30T22:10:00.000Z',
    registrationCode: 'SC27-Q3W4',
    amountPaid: 500
  }
];

export const GALLERY_IMAGES = [
  {
    id: 'g-new-1',
    url: 'https://i.postimg.cc/BvW2p7q5/culto.jpg',
    title: 'Culto de Adoração e Entrega',
    category: 'Louvor'
  },
  {
    id: 'g-new-2',
    url: 'https://i.postimg.cc/sDvSrCxS/palavra.jpg',
    title: 'Ministração da Palavra',
    category: 'Louvor'
  },
  {
    id: 'g-new-3',
    url: 'https://i.postimg.cc/6QL409bt/oracao.jpg',
    title: 'Momento de Oração e Mover',
    category: 'Louvor'
  },
  {
    id: 'g-new-4',
    url: 'https://i.postimg.cc/Zn0946bv/redencao.jpg',
    title: 'Adoração e Redenção',
    category: 'Louvor'
  },
  {
    id: 'g-new-5',
    url: 'https://i.postimg.cc/m2zcn3pp/equipe-azul.jpg',
    title: 'Competições - Equipe Azul',
    category: 'Gincanas'
  },
  {
    id: 'g-new-6',
    url: 'https://i.postimg.cc/s2c1WT1c/Equipe-roxa.jpg',
    title: 'Competições - Equipe Roxa',
    category: 'Gincanas'
  }
];
