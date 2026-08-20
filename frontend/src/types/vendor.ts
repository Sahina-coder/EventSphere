export interface Vendor {
  id: number;
  name: string;
  service_type: string;
  phone: string;
  email: string;
  availability: string;
}

export interface VendorCreate {
  name: string;
  service_type: string;
  phone: string;
  email: string;
  availability?: string;
}