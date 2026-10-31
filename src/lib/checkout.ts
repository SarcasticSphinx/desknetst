import { OrderDraftBuilder, type CheckoutInput,type PricedVariant } from "./patterns";
type Receipt={token:string};
type Draft=ReturnType<OrderDraftBuilder["build"]>;
export interface CheckoutTransaction {
 findVariant(id:string):Promise<PricedVariant|null>;
 reserve(id:string,quantity:number):Promise<boolean>;
 save(draft:Draft):Promise<Receipt>;
}
export interface OrderStore {
 findExisting(key:string):Promise<Receipt|null>;
 transaction<T>(fn:(tx:CheckoutTransaction)=>Promise<T>):Promise<T>;
}
export function parseCheckout(raw:unknown):CheckoutInput{
 if(!raw||typeof raw!=="object")throw new Error("Invalid checkout");
 const x=raw as Record<string,unknown>;
 const text=(key:string,min:number,max:number)=>{const v=x[key];if(typeof v!=="string"||v.trim().length<min||v.trim().length>max)throw new Error(`Check ${key}`);return v.trim();};
 const customer=text("customer",2,80),phone=text("phone",7,20),address=text("address",10,300),requestKey=text("requestKey",36,36);
 if(!/^[+\d\s-]{7,20}$/.test(phone)||!/^\d{7,15}$/.test(phone.replace(/\D/g,"")))throw new Error("Check phone number");
 if(!/^[0-9a-f-]{36}$/i.test(requestKey))throw new Error("Invalid checkout key");
 if(x.delivery!=="standard"&&x.delivery!=="express")throw new Error("Invalid delivery");
 if(!Array.isArray(x.items)||x.items.length<1||x.items.length>30)throw new Error("Your cart is empty or too large");
 const items=x.items.map((item:unknown)=>{
  if(!item||typeof item!=="object")throw new Error("Invalid cart line");
  const line=item as Record<string,unknown>;
  if(typeof line.variantId!=="string"||line.variantId.length>100||!line.variantId||typeof line.quantity!=="number"||!Number.isInteger(line.quantity)||line.quantity<1||line.quantity>50)throw new Error("Invalid quantity");
  return {variantId:line.variantId,quantity:line.quantity};
 });
 if(new Set(items.map(x=>x.variantId)).size!==items.length)throw new Error("Duplicate product options");
 return {customer,phone,address,delivery:x.delivery,requestKey,items};
}
export async function placeOrder(raw:unknown,store:OrderStore){
 const input=parseCheckout(raw);
 const existing=await store.findExisting(input.requestKey);if(existing)return existing;
 return store.transaction(async tx=>{
  const builder=new OrderDraftBuilder(input);
  for(const item of [...input.items].sort((a,b)=>a.variantId.localeCompare(b.variantId))){
   const variant=await tx.findVariant(item.variantId);
   if(!variant)throw new Error("This product option is unavailable");
   if(!await tx.reserve(variant.id,item.quantity))throw new Error("Not enough stock. Update your cart and try again.");
   builder.add(variant,item.quantity);
  }
  return tx.save(builder.build());
 });
}
