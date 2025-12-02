export type Payment = {
  order: string;
  amount: number;
  tip: number;
  type: string;
  paidAt: string;
};

export type PaymentMethod = "tarjeta" | "efectivo"