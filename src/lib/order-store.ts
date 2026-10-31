import "server-only";
import { getDb } from "./db";
import type { OrderStore } from "./checkout";
export const orderStore:OrderStore={
 findExisting:requestKey=>getDb().order.findUnique({where:{requestKey},select:{token:true}}),
 transaction:fn=>getDb().$transaction(async db=>fn({
  findVariant:id=>db.variant.findUnique({where:{id},include:{product:{select:{name:true}}}}),
  reserve:async(id,quantity)=>(await db.variant.updateMany({where:{id,stock:{gte:quantity}},data:{stock:{decrement:quantity}}})).count===1,
  save:async({items,...data})=>db.order.create({data:{...data,items:{create:items}},select:{token:true}})
 }))
};
