export type CheckoutInput = {
  customer: string;
  phone: string;
  address: string;
  delivery: "standard" | "express";
  requestKey: string;
  items: { variantId: string; quantity: number }[];
};
export type PricedVariant = {
  id: string;
  label: string;
  price: number;
  stock: number;
  product: { name: string };
};
export interface DeliveryPolicy {
  fee(): number;
}
export class StandardDelivery implements DeliveryPolicy {
  fee() {
    return 6000;
  }
}
export class ExpressDelivery implements DeliveryPolicy {
  fee() {
    return 12000;
  }
}
export class DeliveryStrategy {
  private policy: DeliveryPolicy;
  constructor(delivery: "standard" | "express") {
    this.policy =
      delivery === "express" ? new ExpressDelivery() : new StandardDelivery();
  }
  fee() {
    return this.policy.fee();
  }
}
// Provider-specific COD terminology is converted to the order format.
export class CashOnDeliveryProvider {
  prepare() {
    return { method: "COD", state: "AWAITING_DELIVERY" };
  }
}
export class CashOnDeliveryAdapter {
  constructor(private provider = new CashOnDeliveryProvider()) {}
  record() {
    const receipt = this.provider.prepare();
    return {
      payment: receipt.method === "COD" ? "CASH_ON_DELIVERY" : "UNKNOWN",
      status: receipt.state === "AWAITING_DELIVERY" ? "PLACED" : "PENDING",
    };
  }
}
export class OrderDraftBuilder {
  private items: {
    variantId: string;
    name: string;
    option: string;
    unitPrice: number;
    quantity: number;
  }[] = [];
  constructor(private input: CheckoutInput) {}
  add(variant: PricedVariant, quantity: number) {
    this.items.push({
      variantId: variant.id,
      name: variant.product.name,
      option: variant.label,
      unitPrice: variant.price,
      quantity,
    });
    return this;
  }
  build() {
    const subtotal = this.items.reduce(
      (sum, x) => sum + x.unitPrice * x.quantity,
      0,
    );
    const shipping = new DeliveryStrategy(this.input.delivery).fee();
    return {
      customer: this.input.customer,
      phone: this.input.phone,
      address: this.input.address,
      delivery: this.input.delivery,
      requestKey: this.input.requestKey,
      subtotal,
      shipping,
      total: subtotal + shipping,
      ...new CashOnDeliveryAdapter().record(),
      items: this.items,
    };
  }
}
