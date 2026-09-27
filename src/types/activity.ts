export interface ActivityImage {
  id: string;
  driveUrl: string;
  directUrl: string;
  thumbnailUrl: string;
  previewUrl: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  titleEn?: string;
  date: string;
  timestamp?: string;
  eventDateTimestamp: number;
  year: number;
  month: number;
  day: number;
  formattedDateBn: string;
  formattedDateEn: string;
  description: string;
  category: string;
  categoryBn: string;
  images: ActivityImage[];
  isFuture: boolean;
  status: 'ongoing' | 'completed';
}

