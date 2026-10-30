import { PrismaClient } from "@prisma/client";
const db=new PrismaClient();
async function main(){
  await db.community.upsert({where:{name_city:{name:"演示小区",city:"郑州"}},update:{},create:{name:"演示小区",city:"郑州",district:"郑东新区"}});
  console.log("演示小区已创建");
}
main().finally(()=>db.$disconnect());
