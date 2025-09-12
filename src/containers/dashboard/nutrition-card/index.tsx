import ProgressBar from './progress-bar';

const NutritionCard = ({
  label,
  value,
  goal,
  unit,
  color,
}: {
  label: string;
  value: number;
  goal: number;
  unit: string;
  color: string;
}) => {
  return (
    <div className='bg-white rounded-xl p-4 shadow-sm flex flex-col gap-1 justify-between'>
      <div className=''>
        <h3 className='text-sm font-medium text-gray-600 mb-1'>{label}</h3>
        <div className='text-xl font-bold text-gray-900'>
          {value} / {goal} {unit}
        </div>
      </div>
      <ProgressBar current={value} goal={goal} color={color} />
    </div>
  );
};

export default NutritionCard;
