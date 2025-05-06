export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export class CoffeeService {
  private baseUrl: string = "http://localhost:4000/api/v1";
  private apiKey: string = process.env.NEXT_PUBLIC_API_KEY || "";

  private async fetcher<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "x-api-key": this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  async getProducts(): Promise<Product[]> {
    return this.fetcher<Product[]>("/products");
  }
}

// Create a singleton instance
export const coffeeService = new CoffeeService();
