export interface EmotionEntry {
  id: string;
  userId: string;
  emotion: string;
  note?: string;
  date: string; // ISO date
}

export const emotions: EmotionEntry[] = [];
