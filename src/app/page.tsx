import Products from "@/components/Groq"
import SpecificSlug from "@/components/Pro"


export default function Home(){
  return(
    <div>
      <div>
        <SpecificSlug/>
        <Products/>
        
      </div>
    </div>
  )
}