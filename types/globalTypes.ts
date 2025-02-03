export interface Product {
    _id: string;
    Title: string;
    VariantSKU: string;
    VariantPrice: number;
    ImageSrc: string;
  }
  
  export interface PaginatedResponse {
    products: Product[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }