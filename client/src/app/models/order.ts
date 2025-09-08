// 서버의 OrderDto 모양과 1:1 매칭
export interface ShippingAddress {
    name: string;
    line1: string;
    line2?: string;              // 서버에서 null 일 수 있으니 optional
    city: string;
    state: string;
    postal_code: string;
    country: string;
  }
  
  export interface PaymentSummary {
    last4: number | string              // 서버는 int
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
  
  // 서버로 보내는 CreateOrderDto
  export interface CreateOrder {
    shippingAddress: ShippingAddress;
    paymentSummary: PaymentSummary;
  } 