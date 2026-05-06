/**
 * Service Layer - Supabase
 * Fonctions métier pour accéder aux données
 * Centralise la logique d'accès aux données
 */

import { 
  EventData, 
  AlbumData, 
  ReportData, 
  BoardMemberData, 
  AboutData,
  UserProfile
} from '../types';
import { supabase, SUPABASE_CONFIG } from './supabase/client';

const STORAGE_BUCKET = 'amescao';

/**
 * Construit l'URL publique d'un fichier Supabase Storage
 * Accepte les chemins relatifs et les URL complètes
 */
export const getMediaUrl = (path?: string): string => {
  if (!path) return '';
  
  // Si c'est déjà une URL complète, la retourner telle quelle
  if (path.startsWith('http') || path.startsWith('//')) return path;
  
  // Sinon, construire l'URL Supabase Storage publique
  return `${SUPABASE_CONFIG.storageUrl}/${STORAGE_BUCKET}/${path}`;
};

/**
 * Utilitaire pour convertir les blocs de contenu texte (compatible STRAPI)
 */
export const renderBlocksToText = (blocks: any): string => {
  if (!blocks) return '';
  if (typeof blocks === 'string') return blocks;
  if (!Array.isArray(blocks)) return '';
  return blocks
    .map((block) => block.children?.map((child: any) => child.text).join('') || '')
    .join('\n');
};

/**
 * Récupère tous les événements
 */
export async function getEvents(): Promise<EventData[]> {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    documentId: item.id,
    title: item.title || '',
    date: item.date || '',
    location: item.location || '',
    description: item.content || '',
    content: item.content || '',
    main_photo: item.cover_photo ? { url: item.cover_photo } : undefined,
    other_photos: (item.other_photos || []).map((photo: string) => ({ url: photo })),
  })) as EventData[];
}

/**
 * Récupère tous les albums
 */
export async function getAlbums(): Promise<AlbumData[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .order('event_date', { ascending: false });

  if (error) {
    console.error('Error fetching albums:', error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    documentId: item.id,
    title: item.event_title || '',
    year: item.event_date ? new Date(item.event_date).getFullYear().toString() : '',
    photos: (item.photos || []).map((photo: string) => ({ url: photo })),
  })) as AlbumData[];
}

/**
 * Récupère tous les rapports
 */
export async function getReports(): Promise<ReportData[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching reports:', error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    documentId: item.id,
    title: item.title || '',
    year: item.date ? new Date(item.date).getFullYear().toString() : '',
    file: item.document_pdf_link ? { url: item.document_pdf_link } : undefined,
  })) as ReportData[];
}

/**
 * Récupère tous les membres du bureau triés par ordre
 */
export async function getBoardMembers(): Promise<BoardMemberData[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('bureau')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching board members:', error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    documentId: item.id,
    name: item.name || '',
    surname: item.surname || '',
    order: item.order || 0,
    role: item.role || '',
    photo: item.photo ? { url: item.photo } : undefined,
    bio: item.biography || '',
  })) as BoardMemberData[];
}

/**
 * Récupère les informations "À propos"
 */
export async function getAbout(): Promise<AboutData> {
  if (!supabase) return {
    id: 0,
    documentId: '',
    text: '',
  } as AboutData;
  const { data, error } = await supabase
    .from('about')
    .select('*')
    .single();

  if (error || !data) {
    console.error('Error fetching about:', error);
    return {
      id: 0,
      documentId: '',
      text: '',
    } as AboutData;
  }

  return {
    id: 0, // UUID from Supabase, but AboutData expects number
    documentId: data.id,
    text: data.content || data.text || '',
  } as AboutData;
}

/**
 * Récupère le profil de l'utilisateur connecté
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  if (!supabase) return null;
  
  try {
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError || !authData?.session?.user?.id) {
      console.error('Error getting session:', authError);
      return null;
    }

    const userId = authData.session.user.id;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name || '',
      surname: data.surname || '',
      email: data.email || authData.session.user.email || '',
      photo: data.photo || undefined,
      role: data.role || 'member',
    } as UserProfile;
  } catch (error) {
    console.error('Exception fetching user profile:', error);
    return null;
  }
}

/**
 * Met à jour le profil de l'utilisateur connecté
 */
export async function updateUserProfile(profile: Partial<UserProfile>): Promise<boolean> {
  if (!supabase) return false;
  
  try {
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError || !authData?.session?.user?.id) {
      console.error('Error getting session:', authError);
      return false;
    }

    const userId = authData.session.user.id;
    
    const { error } = await supabase
      .from('profiles')
      .update({
        name: profile.name,
        surname: profile.surname,
        photo: profile.photo,
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception updating user profile:', error);
    return false;
  }
}
