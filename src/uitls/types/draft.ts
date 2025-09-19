export type Role = 'owner' | 'admin';
export type DraftStatus = 'active' | 'in-progress' | 'done';
export type DraftStateItemStatus = 'available' | 'empty';

export interface DraftItem {
  id: string;
  name: string;
  unit?: string;
  qty?: number;
  available?: boolean;
  price?: number;
  subtotal?: number;
};

export interface Draft {
    id: string;
    title: string;
    status: DraftStatus;
    items: DraftItem[];
    createdAt: Date;
    updatedAt: Date;
    backupItems?: DraftItem[];
    totalPrice?: number;
}