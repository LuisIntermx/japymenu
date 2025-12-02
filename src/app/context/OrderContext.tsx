"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Order } from "@/types/order";

type OrderContextType = {
  order: Order;
  setOrder: (order: Order) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [order, setOrder] = useState<Order>({});

  return (
    <OrderContext.Provider value={{ order, setOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder debe usarse dentro de un OrderProvider");
  }
  return context;
};
