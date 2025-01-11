import { client } from "@/sanity/lib/client";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";

// Create an image URL builder
const builder = imageUrlBuilder(client);

// Function to generate the image URL
const urlFor = (source: { _ref: string }) => builder.image(source);

// Define the Product interface
interface Productts {
  _id: string;
  name: string;
  description: string;
  price: number;
  slug:any,
  discountPercentage?: number;
  priceWithoutDiscount?: number;
  rating?: number;
  ratingCount?: number;
  tags?: string[];
  sizes?: string[];
  image: { asset: { _ref: string } }[];
}

const productQuery = `*[_type == "product"] {
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
  image
}`;

export default async function Products() {
  // Ensure TypeScript knows that we're fetching an array of Productts
  const products: Productts[] = await client.fetch(productQuery);
  console.log("PRODUCT:",products , products[0].slug.current) // Correct type assertion

  return (
    
    <div>
      <div className="grid grid-cols-4 gap-4 p-4">
        {products.map((product: Productts, index: number) => (  // Ensure product is of type Productts
          <div key={index} className="border rounded-lg p-4">
            {product.image && (
              <Link href={`/groq/${product.slug.current}`}>
              <Image
                src={urlFor(product.image.asset).width(500).url()}
                alt={product.name}
                height={200}
                width={300}
                className="object-cover rounded-lg"
              /> </Link>
            )}
            <h2 className="text-lg font-bold mt-2">{product.name}</h2>
            <p className="text-blue-950 font-bold">£{product.price}</p>
            {product.discountPercentage && (
              <h1> £{product.priceWithoutDiscount}</h1>
            )}
            {product.rating && (
              <p className="text-yellow-500">Rating: {product.rating}</p>
            )}
            <p className="text-sm">Tags: {product.tags?.join(", ")}</p>
            <p className="text-sm">Sizes: {product.sizes?.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}