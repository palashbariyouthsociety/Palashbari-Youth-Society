export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  driveUrl: string;
  fileId?: string;
  category: 'leadership' | 'secretariat' | 'member';
  order: number;
}
