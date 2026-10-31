import { describe, expect, it, vi } from "vitest";
import { parseCheckout, placeOrder, type OrderStore } from "./checkout";
import { DeliveryStrategy, CashOnDeliveryAdapter, OrderDraftBuilder } from "./patterns";
const request={customer:"Test Student",phone:"01700000000",address:"Campus road, Rajshahi",delivery:"standard",requestKey:"11111111-1111-4111-8111-111111111111",items:[{variantId:"lamp-warm",quantity:2}]};
const variant={id:"lamp-warm",label:"Warm",price:10000,stock:4,product:{name:"Lamp"}};
function mockStore(){return {findExisting:vi.fn().mockResolvedValue(null), transaction:vi.fn(async(fn)=>fn({findVariant:vi.fn().mockResolvedValue(variant),reserve:vi.fn().mockResolvedValue(true),save:vi.fn().mockResolvedValue({token:"receipt"})}))} as unknown as OrderStore;}
describe("checkout",()=>{
 it("parses a valid guest request",()=>expect(parseCheckout(request).customer).toBe("Test Student"));
 it("rejects empty cart",()=>expect(()=>parseCheckout({...request,items:[]})).toThrow());
 it("rejects invalid contact",()=>expect(()=>parseCheckout({...request,phone:"123"})).toThrow());
 it("rejects invalid quantities",()=>expect(()=>parseCheckout({...request,items:[{variantId:"x",quantity:0}]})).toThrow());
 it("rejects duplicate options",()=>expect(()=>parseCheckout({...request,items:[...request.items,...request.items]})).toThrow());
 it("rejects unknown delivery",()=>expect(()=>parseCheckout({...request,delivery:"drone"})).toThrow());
 it("uses server prices through a mocked store",async()=>{const store=mockStore();expect(await placeOrder(request,store)).toEqual({token:"receipt"});expect(store.transaction).toHaveBeenCalledOnce();});
 it("returns a previous receipt on retry",async()=>{const store=mockStore();vi.mocked(store.findExisting).mockResolvedValue({token:"existing"});expect(await placeOrder(request,store)).toEqual({token:"existing"});expect(store.transaction).not.toHaveBeenCalled();});
 it("rejects unknown product options",async()=>{const store=mockStore();store.transaction=async(fn)=>fn({findVariant:async()=>null,reserve:async()=>true,save:async()=>({token:"x"})});await expect(placeOrder(request,store)).rejects.toThrow("unavailable");});
 it("rejects changed stock",async()=>{const store=mockStore();store.transaction=async(fn)=>fn({findVariant:async()=>variant,reserve:async()=>false,save:async()=>({token:"x"})});await expect(placeOrder(request,store)).rejects.toThrow("stock");});
});
describe("design patterns",()=>{
 it("selects standard or express shipping",()=>{expect(new DeliveryStrategy("standard").fee()).toBe(6000);expect(new DeliveryStrategy("express").fee()).toBe(12000);});
 it("adapts COD to a payment record",()=>expect(new CashOnDeliveryAdapter().record()).toEqual({payment:"CASH_ON_DELIVERY",status:"PLACED"}));
 it("builds order snapshots and totals",()=>{const d=new OrderDraftBuilder(request).add(variant,2).build();expect(d.subtotal).toBe(20000);expect(d.total).toBe(26000);expect(d.items[0].option).toBe("Warm");});
});
