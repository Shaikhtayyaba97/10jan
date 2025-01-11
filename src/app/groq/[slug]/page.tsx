"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";

// Create an image URL builder
const builder = imageUrlBuilder(client);

// Helper function to generate image URLs
const urlFor = (source: any) =>
  builder.image(source).width(500).height(300).url();

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

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Productts | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("SLUG: ",  slug.toString());
  useEffect(() => {
    if (slug) {
      console.log("Slug from URL:", slug); // Log the slug to confirm

      // Function to fetch the product data
      const fetchProduct = async () => {
        try {
          const productData = await client.fetch(
            `*[_type == "product" && slug.current == "${slug}"][0]{
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
}`);
          console.log("Product Data: ", productData,);
          if (productData) {
            console.log("Fetched product data:", productData); // Log the product data
            setProduct(productData);
          } else {
            console.warn("No product found for the given slug:", slug);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [slug]);

  // Show a loading state
  if (loading) return <div>Loading...</div>;

  // Handle the case where no product is found
  if (!product) {
    return (
      <div>Sorry, this product doesn't exist or the slug is incorrect.</div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <div className="mt-4">
        {product.image?.length > 0 && (
          <Image
            src={urlFor(product.image[0].asset)}
            alt={product.name}
            className="w-72 h-auto rounded"
          />
        )}
        <p className="mt-4">{product.description}</p>
        <p className="mt-2 text-lg font-bold">£{product.price}</p>
      </div>
    </div>
  );
}