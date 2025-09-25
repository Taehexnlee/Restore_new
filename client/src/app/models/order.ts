// Mirror the server's OrderDto shape
export interface ShippingAddress {
    name: string;
    line1: string;
    line2?: string;              // Optional because the server may return null
    city: string;
    state: string;
    postal_code: string;
    country: string;
  }
  
  export interface PaymentSummary {
    last4: number | string;             // Server returns an int
    brand: string;
    expMonth: number;
    expYear: number;
  }
  
  export interface OrderItem {
    productId: number;
    name: string;
    pictureUrl: string;
    price: number;               // cents
    quantity: number;
  }
  
  export interface Order {
    id: number;
    buyerEmail: string;
    shippingAddress: ShippingAddress;
    orderDate: string;           // ISO string
    orderItems: OrderItem[];
    subtotal: number;            // cents
    deliveryFee: number;         // cents
    discount: number;            // cents
    total: number;               // cents
    orderStatus: string;         // "Pending" | "PaymentReceived" | "PaymentFailed" ...
    paymentSummary: PaymentSummary;
  }
  
  // Payload sent to the server as CreateOrderDto
  export interface CreateOrder {
    shippingAddress: ShippingAddress;
    paymentSummary: PaymentSummary;
  }
