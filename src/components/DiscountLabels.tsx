import { FC } from 'react';
import { addDays, format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";

interface DiscountLabelProps {
  discount: number;
  startDate: Date;
  endDate: Date;
  borderColor: string;
}

const DiscountLabel: FC<DiscountLabelProps> = ({ discount, startDate, endDate, borderColor }) => (
  <Card className={`w-32 h-28 border-2 ${borderColor}`}>
    <CardContent className="p-2 text-center flex flex-col justify-center h-full">
      <div className="text-xl font-bold">{discount}% Off</div>
      <div className="text-sm">
        {format(startDate, 'MMM. d')} - {format(endDate, 'MMM. d')}
      </div>
    </CardContent>
  </Card>
);

const DiscountLabels: FC = () => {
  const today = new Date();
  const thirtyDaysLater = addDays(today, 30);
  const sixtyDaysLater = addDays(today, 60);
  const ninetyDaysLater = addDays(today, 90);

  return (
    <div className="flex justify-center space-x-4 mb-2">
      <DiscountLabel 
        discount={50} 
        startDate={today} 
        endDate={thirtyDaysLater}
        borderColor="border-red-500"
      />
      <DiscountLabel 
        discount={35} 
        startDate={addDays(thirtyDaysLater, 1)} 
        endDate={sixtyDaysLater}
        borderColor="border-orange-500"
      />
      <DiscountLabel 
        discount={20} 
        startDate={addDays(sixtyDaysLater, 1)} 
        endDate={ninetyDaysLater}
        borderColor="border-yellow-500"
      />
    </div>
  );
};

export default DiscountLabels;