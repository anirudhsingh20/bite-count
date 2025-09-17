import { Plus, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import MacroNutrientsCard from './macro-nutrients-card';
import NutritionCard from './nutrition-card';
// import useDashboard from './hooks/use-dashboard';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import AddFoodModal from '../../components/AddFoodModal';
import type { FoodItem } from '../../components/AddNewFoodModal';
import { useAppSelector } from '../../store/hooks';
import { getLoggedMeals, type FoodLog } from './api-handlers';
import { MEAL_TYPES } from './constants';
import DashboardHeader from './header';
import { getDateStringFromDateDifference } from './helpers';

interface DashboardFoodItem extends FoodItem {
  id: string;
  quantity: number;
  userId?: string;
  userName?: string;
}

const Dashboard = () => {
  // const { mealTypes } = useDashboard();

  const [dateDifferenceFromToday, setDateDifferenceFromToday] = useState<0| 1 | 2>(0);

  const logDateEpoch = useMemo(() => {
    return startOfDay(subDays(new Date(), dateDifferenceFromToday)).getTime();
  }, [dateDifferenceFromToday]);

  const { user } = useAppSelector((state) => state.auth);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<
    'breakfast' | 'lunch' | 'dinner' | 'snack' | ''
  >('');
  const [meals, setMeals] = useState<Record<string, DashboardFoodItem[]>>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  });

  // Calculate nutrition data from meals
  const calculateNutritionData = () => {
    const allFoods = Object.values(meals).flat();
    const totalCalories = allFoods.reduce(
      (sum, food) => sum + food.calories * food.quantity,
      0
    );
    const totalProtein = allFoods.reduce(
      (sum, food) => sum + food.protein * food.quantity,
      0
    );
    const totalCarbs = allFoods.reduce(
      (sum, food) => sum + (food.carbs || 0) * food.quantity,
      0
    );
    const totalFat = allFoods.reduce(
      (sum, food) => sum + (food.fat || 0) * food.quantity,
      0
    );

    return {
      calories: { consumed: Math.round(totalCalories), goal: 2000 },
      protein: { consumed: Math.round(totalProtein * 10) / 10, goal: 180 },
      carbs: Math.round(totalCarbs * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
    };
  };

  const nutritionData = calculateNutritionData();

  const handleAddFood = (food: FoodItem, quantity: number) => {
    const dashboardFood: DashboardFoodItem = {
      ...food,
      id: food._id || Date.now().toString(),
      quantity,
      userId: food.user,
      userName: undefined, // You might want to fetch this from user data
    };
    setMeals((prev) => ({
      ...prev,
      [selectedMealType]: [...(prev?.[selectedMealType] || []), dashboardFood],
    }));
  };

  const handleAddMultipleFoods = async (
    foods: Array<{ food: FoodItem; quantity: number }>
  ) => {
    const dashboardFoods: DashboardFoodItem[] = foods.map(
      ({ food, quantity }) => ({
        ...food,
        id: food._id || Date.now().toString(),
        quantity,
        userId: food.user,
        userName: undefined, // You might want to fetch this from user data
      })
    );

    setMeals((prev) => ({
      ...prev,
      [selectedMealType]: [
        ...(prev?.[selectedMealType] || []),
        ...dashboardFoods,
      ],
    }));

    // Also refresh from API to sync with backend
    await fetchLoggedMeals();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRemoveFood = (_mealType: string, _foodId: string) => {
    // check and update this flow
    // setMeals(prev => ({
    //   ...prev,
    //   [mealType]: prev[mealType].filter(food => food.id !== foodId)
    // }));
  };

  const openAddModal = (
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ) => {
    setSelectedMealType(mealType);
    setIsAddModalOpen(true);
  };

  const fetchLoggedMeals = useCallback(async () => {
    if (!user?._id) {
      toast.error('User not found');
      return;
    }
    const startDateEpoch = startOfDay(subDays(new Date(), dateDifferenceFromToday)).getTime(); // 00:00:00
    const endDateEpoch = endOfDay(subDays(new Date(), dateDifferenceFromToday)).getTime(); // 23:59:59
    const response = await getLoggedMeals(
      user?._id || '',
      `startDate=${startDateEpoch}&endDate=${endDateEpoch}`
    );
    console.info(response);
    if (response.success && response.data) {
      const meals = response.data?.reduce(
        (
          acc: Record<
            'breakfast' | 'lunch' | 'dinner' | 'snack',
            DashboardFoodItem[]
          >,
          log: FoodLog
        ) => ({
          ...acc,
          [log.mealType]: [
            ...(acc?.[log.mealType] || []),
            {
              ...log,
              id: log._id,
              quantity: log.quantity,
              userId: log.user,
              emoji: log.meal?.emoji,
              name: log.meal?.name,
              protein: log.meal?.protein,
              carbs: log.meal?.carbs,
              fat: log.meal?.fat,
              calories: log.meal?.calories,
              servingSize: log.meal?.servingSize,
            },
          ],
        }),
        {} as Record<
          'breakfast' | 'lunch' | 'dinner' | 'snack',
          DashboardFoodItem[]
        >
      );
      setMeals(meals);
    } else {
      toast.error(
        response.message ?? 'Some error occurred while fetching data'
      );
    }
  }, [user?._id, dateDifferenceFromToday]);

  useEffect(() => {
    fetchLoggedMeals();
  }, [fetchLoggedMeals]);

  return (
    <div className='flex flex-col h-full w-full bg-gray-50'>
      {/* Header */}
      <DashboardHeader
        dateDifferenceFromToday={dateDifferenceFromToday}
        setDateDifferenceFromToday={setDateDifferenceFromToday}
      />

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
          {MEAL_TYPES.map((mealType) => (
            <div key={mealType}>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-lg font-semibold text-gray-600 capitalize'>
                  {mealType === 'snack' ? 'Snacks' : mealType}
                </h3>
                <Button
                  size='sm'
                  className='w-8 h-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-200 hover:scale-105'
                  onClick={() =>
                    openAddModal(
                      mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack'
                    )
                  }
                >
                  <Plus size={16} className='text-white' />
                </Button>
              </div>
              {meals[mealType] && meals[mealType].length > 0 ? (
                <div className='space-y-2'>
                  {meals[mealType].map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className='bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <div className='text-2xl'>{item.emoji}</div>
                          <div>
                            <div className='flex items-center gap-2'>
                              <span className='font-medium text-gray-900'>
                                {item.name}
                              </span>
                              {item.userName && (
                                <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>
                                  {item.userName}
                                </span>
                              )}
                            </div>
                            <div className='text-xs text-gray-500'>
                              {item.quantity} x {item.servingSize}
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center gap-3'>
                          <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <span>
                              {Math.round(item.calories * item.quantity)} kcal
                            </span>
                            <div className='w-px h-4 bg-gray-300'></div>
                            <span>
                              {Math.round(item.protein * item.quantity * 10) /
                                10}
                              g protein
                            </span>
                          </div>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleRemoveFood(mealType, item.id)}
                            className='w-6 h-6 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full'
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='bg-gray-100 rounded-lg p-6 text-center text-gray-500'>
                  <div className='text-4xl mb-2'>🍽️</div>
                  <p className='text-sm'>No items added yet</p>
                  <p className='text-xs text-gray-400'>
                    Tap the + button to add food
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom spacing for navigation */}
        <div className='h-20'></div>
      </div>

      {/* Add Food Modal */}
      <AddFoodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        mealType={
          selectedMealType as 'breakfast' | 'lunch' | 'dinner' | 'snack'
        }
        logDateEpoch={logDateEpoch}
        dateString={getDateStringFromDateDifference(dateDifferenceFromToday)}
        onAddFood={handleAddFood}
        onAddMultipleFoods={handleAddMultipleFoods}
      />
    </div>
  );
};

export default Dashboard;
