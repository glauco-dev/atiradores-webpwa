import { Timestamp } from 'firebase/firestore';

export type EntityID = string;

export type RegistrationModel = {
  email: string;
  foto: string;
  foto_file?: File | undefined;
  password: string;
  confirmPassword: string;
  nascimento: string;
  apelido: string;
  error: string;
};

export type SessionModel = {
  userId: string;
  apelido: string;
  nome: string;
  email: string;
  nascimento: string;
  error: string;
  password: string;
};

// Definição das pontuações
export const Pontuacoes = {
  Alpha: 10,
  Charlie: 5,
  Delta: 1,
  Miss: 0,
  'No Shoot': -10,
};

export type Alvo = {
  icone: string;
  pontos: keyof typeof Pontuacoes;
};

// Classe Atleta
export type Membro = {
  id: string;
  email: string;
  password: string;
  apelido: string;
  nascimento: string;
  foto: string;
  bio: string;
};
export enum CampeonatoCategorias {
  'W2C',
  'IPSC',
  'IDSC',
}
// Classe Campeonato
export type Campeonato = {
  squads: EntityID[];
  id: string;
  nome: string;
  dataInicio: Timestamp;
  dataFim: Timestamp;
  descricao: string;
  localidade: string;
  pistas: EntityID[];
  banner: string;
  categoria: keyof typeof CampeonatoCategorias;
  atletasRegistrados: number;
};

// Classe Pista
export type Pista = {
  id: string;
  nome: string;
  localizacao: string;
  alvos: EntityID[];
};

// Classe Squad
export type Squad = {
  id: string;
  nome: string;
  membros: EntityID[];
  etapa?: EntityID;
  bg_banner: string;
  capitao?: string;
  campeonatoId?: EntityID;
};

export type RegistroDePontuacao = {
  id: string;
  atleta: EntityID;
  campeonato: EntityID;
  pista: EntityID;
  data: Date;
  pontuacao: number;
};

export enum AppStates {
  AppData = 'AppData',
  Session = 'Session',
}

export enum LocalStorageKeys {
  AppUserInfo = 'AppUserInfo',
  SessionUserInfo = 'SessionUserInfo',
  AppData = 'AppData',
  StateVersion = 'lastUpdate',
}

// apps

export interface CSquad extends Omit<Squad, 'membros'> {
  membros: Membro[];
}
export interface CCampeonato
  extends Omit<Campeonato, 'squads' | 'atletasRegistrados'> {
  squads: CSquad[];
}
