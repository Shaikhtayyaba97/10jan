import { client } from "@/sanity/lib/client";
import React  from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
const Products= async ()=>{
  const query = await client.fetch(
    `*[_type == "product"] {
      _id,
      name,
      description,
      price,
      slug,
      discountPercentage,
      priceWithoutDiscount,
      rating,
      ratingCount,
      tags,
      sizes,
      "imageUrl" : image.asset->url
    }`
    
  );
  console.log(query)
  return(
    <div>
      {query.map ((product:any)=>{
        return(
          <div key={product._id}>
            <h1>{product.name}</h1>
            <p>{product.price}</p>
            <Link href={`/groq/${product.slug.current}`}>
            <Image src={urlFor(product.imageUrl).url()}
            alt={product.name} width={100} height={100}/></Link>
            
          </div>
        )
      })}
    </div>
  )
}
export default Products