export type CartLine = { variantId: string; productId: string; name: string; option: string; image: string; price: number; stock: number; quantity: number };
export function addLine(cart: CartLine[], item: CartLine): CartLine[] {
 const existing=cart.find(x=>x.variantId===item.variantId);
 const quantity=(existing?.quantity??0)+1;
 if(quantity>item.stock)throw new Error("Not enough stock for this option");
 return existing?cart.map(x=>x.variantId===item.variantId?{...x,quantity}:x):[...cart,{...item,quantity:1}];
}
export function changeQuantity(cart: CartLine[],id:string,quantity:number):CartLine[]{
 const item=cart.find(x=>x.variantId===id);
 if(!Number.isInteger(quantity)||quantity<0||quantity>(item?.stock??0))throw new Error("Invalid quantity or stock limit");
 return quantity===0?cart.filter(x=>x.variantId!==id):cart.map(x=>x.variantId===id?{...x,quantity}:x);
}
export const subtotal=(cart:CartLine[])=>cart.reduce((sum,x)=>sum+x.price*x.quantity,0);
export const money=(paisa:number)=>new Intl.NumberFormat("en-BD",{style:"currency",currency:"BDT",maximumFractionDigits:0}).format(paisa/100);
