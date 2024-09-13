import FeatureCard from "./FeatureCard";
import { Button } from '@/components/ui/button';
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <main className="container mx-auto px-4 py-8">
                <section className="text-center mb-12">
                    <h2 className="text-7xl font-bold mb-6">Expiration Date Tracking</h2>
                    <p className="text-2xl mb-2">
                        Track and manage all your expiration dates,
                    </p>
                    <p className="text-2xl mb-6">
                        ensuring you never miss a single product.
                    </p>
                    <Button size="lg" className="bg-slate-800 hover:bg-blue-700 text-white">
                        <Link href="/sign-in" className="text-xl">
                            Get Started
                        </Link>
                    </Button>
                </section>

                <section className="space-y-8">
                    <FeatureCard
                        title="Expired Items Dashboard"
                        description="A detailed dashboard that provides a snapshot of all your expired items at a glance."
                        imageSrc="/Expired-items.png"
                        imageAlt="Expired Items Dashboard"
                        isReversed={false}
                    />

                    <FeatureCard
                        title="All Products Dashboard"
                        description="Easily manage all your products in one place with our intuitive dashboard."
                        imageSrc="/All-products.png"
                        imageAlt="All Products Dashboard"
                        isReversed={true}
                    />

                    <FeatureCard
                        title="Add Products"
                        description="Quickly add products to your inventory with our simple input form."
                        imageSrc="/Add-product.png"
                        imageAlt="Add Products Form"
                        isReversed={false}
                    />

                    <FeatureCard
                        title="Update Product Details"
                        description="Update product details and expiration dates with our easy-to-use form."
                        imageSrc="/Update-product.png"
                        imageAlt="Update Product Form"
                        isReversed={true}
                    />
                </section>

                <section className="text-center mt-12">
                    <h3 className="text-5xl font-bold mb-6">Start Tracking with RedSticker</h3>
                    <Button size="lg" className="bg-slate-800 hover:bg-blue-700 text-white">
                        <Link href="/sign-in" className="text-xl">
                            Get Started
                        </Link>
                    </Button>
                </section>
            </main>
        </div>
    )
}