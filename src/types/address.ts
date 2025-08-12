export type Address = {
  id: string;
  country: string;
  city: string;
  line1: string;
  line2?: string | null;
  phone?: string | null;
  zip?: string | null;
  isDefault: boolean;
};
