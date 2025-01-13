import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { notFound } from "next/navigation";

// Define a Product interface for type safety
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPercentage?: number;
  priceWithoutDiscount?: number;
  rating: number;
  ratingCount: number;
  tags: string[];
  sizes: string[];
  imageUrl: string;
}

// Dynamic route page component
export default async function ProductPage({ params }: { params:Promise<{ slug: string }> })


 {
  const {slug}=await params
  // Fetch product details by slug
  const product: Product | null = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      _id,
      name,
      description,
      price,
      discountPercentage,
      priceWithoutDiscount,
      rating,
      ratingCount,
      tags,
      sizes,
      "imageUrl": image.asset->url
    }`,
    { slug: params.slug }
  );

  // If no product found, show a 404 page
  if (!product) {
    notFound();
  }

  return (
    
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <Image
        src={urlFor(product.imageUrl).url()}
        alt={product.name}
        width={600}
        height={600}
        className="rounded-lg"
      />
      <div className="mt-6">
        <p className="text-lg">Price: <strong>${product.price}</strong></p>
        {product.discountPercentage && (
          <p className="text-sm text-red-600">
            Discount: {product.discountPercentage}% (Original: ${product.priceWithoutDiscount})
          </p>
        )}
        <p className="mt-4 text-gray-700">{product.description}</p>
        <div className="mt-6">
          <strong>Tags:</strong> {product.tags?.join(", ")}
        </div>
        <div className="mt-4">
          <strong>Sizes:</strong> {product.sizes?.join(", ")}
        </div>
        <div className="mt-6">
          <strong>Rating:</strong> {product.rating} ({product.ratingCount} reviews)
        </div>
      </div>
    </div>
  );
}

// Generate static parameters for dynamic routes
export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(`*[_type == "product"]{ "slug": slug.current }`);
  return slugs.map((slug) => ({ slug: slug.slug }));
}