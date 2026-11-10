export interface VenueInfo {
  id: "ceremony" | "reception";
  label: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  city: string;
  description: string;
  searchQuery: string;
  mapsSearchUrl: string;
  mapsEmbedUrl: string;
  isDemonstrative: boolean;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
  featuredSpan?: string;
}

export interface RsvpSubmissionInput {
  fullName: string;
  phone: string;
  attending: boolean;
  companionsCount: number;
  companionNames: string[];
  message?: string;
  website?: string; // Honeypot anti-spam field
}

export interface RsvpRecordResponse {
  id: string;
  fullName: string;
  attending: boolean;
  companionsCount: number;
  createdAt: string;
}

export interface RsvpApiSuccess {
  success: true;
  message: string;
  data: RsvpRecordResponse;
}

export interface RsvpApiError {
  success: false;
  code:
    | "VALIDATION_ERROR"
    | "DUPLICATE_RSVP"
    | "DATABASE_NOT_CONFIGURED"
    | "DATABASE_CONNECTION_ERROR"
    | "RATE_LIMITED"
    | "UNAUTHORIZED"
    | "INTERNAL_ERROR";
  error: string;
  fieldErrors?: Record<string, string[]>;
}
