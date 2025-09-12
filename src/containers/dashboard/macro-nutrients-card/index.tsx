const MacroNutrientsCard = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => {
  return (
    <div className='bg-white rounded-xl p-2 shadow-sm text-center'>
      <h4 className='text-xs font-medium text-gray-600'>{label}</h4>
      <div className='text-md font-bold text-gray-900'>{value}g</div>
    </div>
  );
};

export default MacroNutrientsCard;
