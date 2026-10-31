import { NextRequest,NextResponse } from "next/server";
import { placeOrder } from "@/lib/checkout";
import { orderStore } from "@/lib/order-store";
export async function POST(request:NextRequest){
 if(request.headers.get("origin")!==request.nextUrl.origin)return NextResponse.json({error:"Invalid origin"},{status:403});
 try{return NextResponse.json(await placeOrder(await request.json(),orderStore),{status:201});}
 catch(error){
  if(error&&typeof error==="object"&&"code" in error&&error.code==="P2002"){
   return NextResponse.json({error:"An order may already exist. Retry with the same checkout details."},{status:409});
  }
  const message=error instanceof Error?error.message:"Unable to place order";
  const expected=/Check |Invalid |cart |Duplicate |unavailable|stock/.test(message);
  return NextResponse.json({error:expected?message:"Unable to place order. Please try again."},{status:expected?400:500});
 }
}
