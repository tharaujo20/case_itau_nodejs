export interface Client {
  id: string;
  name: string;
  email: string;
  balance: number;
  password?: number;
}

export interface CreateClient {
  name: string;
  email: string;
  balance?: number;
  password: number;
}
