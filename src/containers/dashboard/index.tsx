import { Button } from '../../components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import MacroNutrientsCard from './macro-nutrients-card';
import NutritionCard from './nutrition-card';
import useDashboard from './hooks/use-dashboard';

const Dashboard = () => {
  const { mealTypes } = useDashboard();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Mock data - replace with real data from API
  const nutritionData = {
    calories: { consumed: 1250, goal: 2000 },
    protein: { consumed: 120, goal: 180 },
    carbs: 150,
    fat: 25,
  };

  const meals = {
    breakfast: [{ name: 'Oatmeal with berries', calories: 350, protein: 10 }],
    lunch: [{ name: 'Grilled chicken salad', calories: 450, protein: 40 }],
    dinner: [],
    snacks: [],
  };

  return (
    <div className='flex flex-col h-full w-full bg-gray-50'>
      {/* Header */}
      <div className='flex items-center justify-between p-4 bg-white'>
        <div className='flex items-center gap-2'>
          <Calendar size={20} className='text-gray-600' />
          <span className='text-gray-700 font-medium'>Today, {today}</span>
        </div>
        <div className='w-8 h-8 bg-gray-200 rounded-full'></div>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
        {/* Nutrition Summary Cards */}
        <div className='grid grid-cols-2 gap-4'>
          {/* Calories Card */}
          <NutritionCard
            label='Calories'
            value={nutritionData.calories.consumed}
            goal={nutritionData.calories.goal}
            unit='kcal'
            color='bg-blue-500'
          />

          {/* Protein Card */}
          <NutritionCard
            label='Protein'
            value={nutritionData.protein.consumed}
            goal={nutritionData.protein.goal}
            unit='g'
            color='bg-teal-500'
          />
        </div>

        {/* Macronutrients Cards */}
        <div className='grid grid-cols-3 gap-3'>
          <MacroNutrientsCard
            label='Protein'
            value={nutritionData.protein.consumed}
          />
          <MacroNutrientsCard label='Fat' value={nutritionData.fat} />
          <MacroNutrientsCard label='Carbs' value={nutritionData.carbs} />
        </div>

        {/* Meals Section */}
        <div className='space-y-4'>
          {/* Breakfast */}
          {mealTypes.map((mealType) => (
            <div className='flex items-center justify-between mb-3' key={mealType}>
              <h3 className='text-lg font-semibold text-gray-600 capitalize'>{mealType}</h3>
              <Button
                size='sm'
                className='w-8 h-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600'
              >
                <Plus size={16} className='text-white' />
              </Button>
            </div>
          ))}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-lg font-semibold text-gray-900'>Breakfast</h3>
              <Button
                size='sm'
                className='w-8 h-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600'
              >
                <Plus size={16} className='text-white' />
              </Button>
            </div>
            {meals.breakfast.length > 0 ? (
              <div className='space-y-2'>
                {meals.breakfast.map((item, index) => (
                  <div key={index} className='bg-gray-100 rounded-lg p-3'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium text-gray-900'>
                        {item.name}
                      </span>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <span>{item.calories} kcal</span>
                        <div className='w-px h-4 bg-gray-300'></div>
                        <span>{item.protein}g protein</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='bg-gray-100 rounded-lg p-3 text-center text-gray-500'>
                No items added yet
              </div>
            )}
          </div>

          {/* Lunch */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-lg font-semibold text-gray-900'>Lunch</h3>
              <Button
                size='sm'
                className='w-8 h-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600'
              >
                <Plus size={16} className='text-white' />
              </Button>
            </div>
            {meals.lunch.length > 0 ? (
              <div className='space-y-2'>
                {meals.lunch.map((item, index) => (
                  <div key={index} className='bg-gray-100 rounded-lg p-3'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium text-gray-900'>
                        {item.name}
                      </span>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <span>{item.calories} kcal</span>
                        <div className='w-px h-4 bg-gray-300'></div>
                        <span>{item.protein}g protein</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='bg-gray-100 rounded-lg p-3 text-center text-gray-500'>
                No items added yet
              </div>
            )}
          </div>

          {/* Dinner */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-lg font-semibold text-gray-900'>Dinner</h3>
              <Button
                size='sm'
                className='w-8 h-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600'
              >
                <Plus size={16} className='text-white' />
              </Button>
            </div>
            <div className='bg-gray-100 rounded-lg p-3 text-center text-gray-500'>
              No items added yet
            </div>
          </div>

          {/* Snacks */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-lg font-semibold text-gray-900'>Snacks</h3>
              <Button
                size='sm'
                className='w-8 h-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600'
              >
                <Plus size={16} className='text-white' />
              </Button>
            </div>
            <div className='bg-gray-100 rounded-lg p-3 text-center text-gray-500'>
              No items added yet
            </div>
          </div>
        </div>

        {/* Bottom spacing for navigation */}
        <div className='h-20'></div>
      </div>
    </div>
  );
};

export default Dashboard;
