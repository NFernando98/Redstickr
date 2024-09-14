import { Card, CardContent } from '@/components/ui/card';

export default function FeatureCard({ title, description, imageSrc, imageAlt, isReversed }: any) {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                    <div className="md:w-1/2">
                        <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
                    </div>
                    <div className="md:w-1/2 p-6 flex flex-col justify-center">
                        <h3 className="text-3xl font-bold mb-4">{title}</h3>
                        <p className="text-xl">{description}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}