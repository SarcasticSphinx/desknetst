export type CheckoutInput={customer:string;phone:string;address:string;delivery:"standard"|"express";requestKey:string;items:{variantId:string;quantity:number}[]};
export type PricedVariant={id:string;label:string;price:number;stock:number;product:{name:string}};
export class DeliveryStrategy {
 constructor(private delivery:"standard"|"express"){}
 fee(){return this.delivery==="express"?12000:6000;}
}
export class CashOnDeliveryAdapter {
 record(){return {payment:"CASH_ON_DELIVERY",status:"PLACED"};}
}
export class OrderDraftBuilder {
 private items:{variantId:string;name:string;option:string;unitPrice:number;quantity:number}[]=[];
 constructor(private input:CheckoutInput){}
 add(variant:PricedVariant,quantity:number){this.items.push({variantId:variant.id,name:variant.product.name,option:variant.label,unitPrice:variant.price,quantity});return this;}
 build(){
  const subtotal=this.items.reduce((sum,x)=>sum+x.unitPrice*x.quantity,0);
  const shipping=new DeliveryStrategy(this.input.delivery).fee();
  return {customer:this.input.customer,phone:this.input.phone,address:this.input.address,delivery:this.input.delivery,requestKey:this.input.requestKey,subtotal,shipping,total:subtotal+shipping,...new CashOnDeliveryAdapter().record(),items:this.items};
 }
}
