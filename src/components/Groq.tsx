'use client'
import { client } from "@/sanity/lib/client"; // Sanity client import karein
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react"; // Hooks import karein

const Products = () => {
  const [products, setProducts] = useState<any[]>([]); // Products ko store karne ke liye state
  const [loading, setLoading] = useState<boolean>(true); // Loading ko track karne ke liye state

  // Fetching data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
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
          "imageUrl": image.asset->url
        }`
      );
      setProducts(query); // Fetched data ko state mein store karein
      setLoading(false); // Loading ko false kar dein
    };

    fetchData(); // Function call to fetch data
  }, []); // Empty array means this runs only once when component mounts

  if (loading) {
    return <p>Loading...</p>; // Loading message show karein jab tak data fetch hota hai
  }

  if (!products.length) {
    return <p>No products found.</p>; // Agar products nahi hain to message show karein
  }

  return (
    <div>
      {products.map((product: any) => (
        <div key={product._id} className="product-card">
          <h1>{product.name}</h1>
          <p>{product.price}</p>
          <Link href={`/groq/${product.slug.current}`}>
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={100}
              height={100}
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Products;