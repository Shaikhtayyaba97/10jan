import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link"; // Link ko import karain
import { urlFor } from "@/sanity/lib/image"; // Ensure this is correctly imported

// TypeScript Interface for Product
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  slug: { current: string };
  discountPercentage: number;
  priceWithoutDiscount: number;
  rating: number;
  ratingCount: number;
  tags: string[];
  sizes: string[];
  imageUrl: string;
}

// Assign the component to a variable first
const SpecificSlugs = async () => {
  // Fetching only specific slugs
  const query = await client.fetch(
    `*[_type == "product" && (slug.current == "a" || slug.current == "c")] {
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
      "imageUrl": image.asset->url
    }`
  );

  console.log("Fetched Data:", query); // Debugging purpose

  return (
    <div>
      <h1>Products with Specific Slugs (a, c):</h1>
      {query.length > 0 ? (
        query.map((product: Product) => (
          <div key={product._id} className="border p-4 m-4">
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="text-sm">Price: ${product.price}</p>
            <p className="text-sm">
              Price Without Discount: ${product.priceWithoutDiscount}
            </p>
            <p className="text-sm">Discount: {product.discountPercentage}%</p>
            <p className="text-sm">Rating: {product.rating} ({product.ratingCount} reviews)</p>
            <p className="text-sm">Tags: {product.tags ? product.tags.join(", ") : "None"}</p>
            <p className="text-sm">Sizes: {product.sizes ? product.sizes.join(", ") : "None"}</p>
            
            {/* Wrap the image in Link */}
            {product.imageUrl && (
              <Link href={`/groq/${product.slug.current}`}>
                <Image
                  src={urlFor(product.imageUrl).url()}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="rounded"
                />
              </Link>
            )}

            <p className="text-sm">Slug: {product.slug.current}</p>
          </div>
        ))
      ) : (
        <p>No products found with the specified slugs.</p>
      )}
    </div>
  );
};

// Exporting the component after assigning it to a variable
export default SpecificSlugs;