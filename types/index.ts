export type Ruolo = 'admin' | 'dipendente';

export interface Dipendente {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  password?: string; 
  ruolo: Ruolo;
  created_at?: Date;
  updated_at?: Date;
}

export interface Docente {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  titolo_professionale?: string;
  specializzazione?: string;
  attivo: boolean;
}

export interface Corso {
  id: number;
  titolo: string;
  descrizione: string;
  docente_id: number;
  categoria_id?: number;
  giorni_completamento: number;
  immagine_path: string;
  video_url: string;
  attivo: boolean;
  docente_nome?: string;
  docente_cognome?: string;
  categoria_nome?: string;
}

export interface Iscrizione {
  id: number;
  dipendente_id: number;
  corso_id: number;
  data_iscrizione: Date;
  data_scadenza: Date;
  data_completamento?: Date;
  giorni_completamento_al_momento_iscrizione: number;
  stato?: 'In corso' | 'Completato' | 'Scaduto';
}