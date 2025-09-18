import React, { useEffect, useMemo, useState } from 'react';
import { X, Flame, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppSelector } from '../store/hooks';
import { addFood } from '../containers/dashboard/api-handlers';
import { toast } from 'sonner';

export interface FoodItem {
  _id?: string;
  name: string;
  protein: number;
  calories: number;
  fat?: number;
  carbs?: number;
  quantity: number;
  quantityUnit: any;
  tags?: string[];
  emoji?: string;
  user?: string;
}

interface FoodItemForm
  extends Omit<FoodItem, 'protein' | 'carbs' | 'fat' | 'calories' | 'quantity' | 'quantityUnit'> {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  quantity: string;
  quantityUnit: string | null;
}

interface AddNewFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: string;
  onAddFood: (food: FoodItem, servings: number) => void;
  onAddMultipleFoods?: (foods: Array<{ food: FoodItem; servings: number }>) => void;
  quantityUnits: string[];
  defaultQuantityId: string | null;
  }

const AddNewFoodModal: React.FC<AddNewFoodModalProps> = ({
  isOpen,
  onClose,
  mealType,
  onAddFood,
  onAddMultipleFoods,
  quantityUnits,
  defaultQuantityId,
}) => {
  const [servings, setServings] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [foodItems, setFoodItems] = useState<Array<{ food: FoodItem; servings: number }>>([]);
  const [isMultiAddMode, setIsMultiAddMode] = useState(false);


  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Food name is required')
      .min(2, 'Food name must be at least 2 characters')
      .max(50, 'Food name must be less than 50 characters'),
    calories: Yup.number()
      .required('Calories is required')
      .min(0, 'Calories must be 0 or greater')
      .max(10000, 'Calories must be less than 10,000'),
    protein: Yup.number()
      .required('Protein is required')
      .min(0, 'Protein must be 0 or greater')
      .max(1000, 'Protein must be less than 1,000g'),
    carbs: Yup.number()
      .min(0, 'Carbs must be 0 or greater')
      .max(1000, 'Carbs must be less than 1,000g'),
    fat: Yup.number()
      .min(0, 'Fat must be 0 or greater')
      .max(1000, 'Fat must be less than 1,000g'),
    emoji: Yup.string().required('Food icon is required'),
    user: Yup.string().required('User assignment is required'),
  });

  const { user } = useAppSelector((state) => state.auth);

  // Initial form values
  const initialValues: FoodItemForm = useMemo(() => {
    return {
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      emoji: '🍽️',
      user: user?._id || '',
      quantity: '1', // check and update
      quantityUnit: defaultQuantityId || null,
    };
  }, [defaultQuantityId]);

  const handleAddNewFood = async (values: FoodItemForm) => {
    try {
      const foodItem: FoodItem = {
        name: values.name,
        calories: parseFloat(values.calories),
        protein: parseFloat(values.protein),
        carbs: parseFloat(values.carbs) || 0,
        fat: parseFloat(values.fat) || 0,
        quantity: parseFloat(values.quantity),
        quantityUnit: values.quantityUnit!,
        emoji: values.emoji,
        user: user?._id,
      };

      setIsAdding(true);
      const response = await addFood(foodItem);
      console.info(response);
      if (response.success) {
        if (isMultiAddMode) {
          // Add to the list of food items
          setFoodItems(prev => [...prev, { food: foodItem, servings: servings }]);
          toast.success('Food item added to list');
          // Reset form for next item
          formik.resetForm();
          setServings(1);
        } else {
          // Single add mode
          toast.success('Food item added successfully');
          onAddFood(foodItem, servings);
          setServings(1);
          onClose();
        }
      } else {
        throw new Error('Failed to add food item');
      }
    } catch (error) {
      console.error(error);
      toast.error((error as Error)?.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddAllFoods = async () => {
    if (foodItems.length === 0) return;
    
    try {
      setIsAdding(true);
      if (onAddMultipleFoods) {
        onAddMultipleFoods(foodItems);
        toast.success(`${foodItems.length} food items added successfully`);
      } else {
        // Fallback to adding one by one
        for (const item of foodItems) {
          onAddFood(item.food, item.servings);
        }
        toast.success(`${foodItems.length} food items added successfully`);
      }
      setFoodItems([]);
      setIsMultiAddMode(false);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add food items');
    } finally {
      setIsAdding(false);
    }
  };

  const removeFoodFromList = (index: number) => {
    setFoodItems(prev => prev.filter((_, i) => i !== index));
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleAddNewFood,
  });

  const selectedQuantityUnit: any = useMemo(() => {
    return quantityUnits.find((unit: any) => unit?._id === formik.values.quantityUnit);
  }, [formik.values.quantityUnit, quantityUnits]);


  useEffect(() => {
    console.info(selectedQuantityUnit, selectedQuantityUnit?.defaultValue);
    if (selectedQuantityUnit) {
      formik.setFieldValue('quantity', selectedQuantityUnit?.defaultValue || 1);
    }
  }, [selectedQuantityUnit]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='relative flex flex-col min-h-0 h-full bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 ease-out'>
        {/* Header */}
        <div className='sticky top-0 bg-white border-b border-gray-100 p-4'>
          <div className='flex items-center justify-between'>
             <div>
               <h2 className='text-xl font-bold text-gray-900'>
                 Add New Food Item
               </h2>
               <p className='text-sm text-gray-500'>
                 Create a custom food item for {mealType}
               </p>
               <div className='flex items-center gap-2 mt-2'>
                 <button
                   type='button'
                   onClick={() => setIsMultiAddMode(!isMultiAddMode)}
                   className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                     isMultiAddMode
                       ? 'bg-blue-500 text-white border-blue-500'
                       : 'bg-gray-100 text-gray-600 border-gray-300'
                   }`}
                 >
                   {isMultiAddMode ? 'Multi-Add Mode' : 'Single Add Mode'}
                 </button>
                 {isMultiAddMode && foodItems.length > 0 && (
                   <span className='text-xs text-blue-600 font-medium'>
                     {foodItems.length} items ready
                   </span>
                 )}
               </div>
             </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={onClose}
              className='rounded-full hover:bg-gray-100'
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 flex flex-col min-h-0 h-full overflow-y-auto p-4'>
          <form
            onSubmit={formik.handleSubmit}
            className='space-y-4 flex flex-col flex-1 min-h-0 h-full justify-between'
          >
            <div className='flex flex-col flex-1 gap-4'>
              {/* Food Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Food Name *
                </label>
                <input
                  type='text'
                  name='name'
                  placeholder='e.g., Grilled Chicken Breast'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formik.errors.name && formik.touched.name
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-200'
                  }`}
                />
                {formik.errors.name && formik.touched.name && (
                  <div className='text-red-500 text-xs mt-1'>
                    {formik.errors.name}
                  </div>
                )}
              </div>

              {/* Serving Size */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Serving Size *
                </label>
                <div className='flex gap-2'>
                  {/* Quantity Input with +/- buttons */}
                  <div className='flex items-center border border-gray-200 rounded-xl overflow-hidden'>
                    <button
                      type='button'
                      onClick={() => {
                        const newQuantity = parseInt(formik.values.quantity) - (selectedQuantityUnit?.incrementValue || 1);
                        formik.setFieldValue('quantity', newQuantity <= 0 ? 0.1 : newQuantity);
                      }}
                        className='px-3 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium transition-colors'
                    >
                      —
                    </button>
                    <input
                      type='number'
                      name='quantity'
                      value={formik.values.quantity}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className='w-16 px-2 py-3 text-center border-0 focus:outline-none focus:ring-0'
                      min='1'
                    />
                    <button
                      type='button'
                      onClick={() => formik.setFieldValue('quantity', parseInt(formik.values.quantity) + (selectedQuantityUnit?.incrementValue || 1))}
                      className='px-3 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium transition-colors'
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Unit Dropdown */}
                  <Select value={formik.values.quantityUnit || ''} onValueChange={(value) => formik.setFieldValue('quantityUnit', value)}>
                    <SelectTrigger className='flex-1 py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {quantityUnits.map((unit: any) => (
                        <SelectItem key={unit?._id} value={unit?._id}>{unit?.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Nutrition Information */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Calories *
                  </label>
                  <input
                    type='number'
                    name='calories'
                    placeholder='165'
                    value={formik.values.calories}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formik.errors.calories && formik.touched.calories
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200'
                    }`}
                  />
                  {formik.errors.calories && formik.touched.calories && (
                    <div className='text-red-500 text-xs mt-1'>
                      {formik.errors.calories}
                    </div>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Protein (g) *
                  </label>
                  <input
                    type='number'
                    step='0.1'
                    name='protein'
                    placeholder='31.0'
                    value={formik.values.protein}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formik.errors.protein && formik.touched.protein
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200'
                    }`}
                  />
                  {formik.errors.protein && formik.touched.protein && (
                    <div className='text-red-500 text-xs mt-1'>
                      {formik.errors.protein}
                    </div>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Carbs (g)
                  </label>
                  <input
                    type='number'
                    step='0.1'
                    name='carbs'
                    placeholder='0.0'
                    value={formik.values.carbs}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formik.errors.carbs && formik.touched.carbs
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200'
                    }`}
                  />
                  {formik.errors.carbs && formik.touched.carbs && (
                    <div className='text-red-500 text-xs mt-1'>
                      {formik.errors.carbs}
                    </div>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Fat (g)
                  </label>
                  <input
                    type='number'
                    step='0.1'
                    name='fat'
                    placeholder='3.6'
                    value={formik.values.fat}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formik.errors.fat && formik.touched.fat
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200'
                    }`}
                  />
                  {formik.errors.fat && formik.touched.fat && (
                    <div className='text-red-500 text-xs mt-1'>
                      {formik.errors.fat}
                    </div>
                  )}
                </div>
              </div>

              {/* Food Icon */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Food Icon *
                </label>
                <div className='flex items-center gap-2'>
                  <span className='text-2xl'>{formik.values.emoji}</span>
                  <select
                    name='emoji'
                    value={formik.values.emoji}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formik.errors.emoji && formik.touched.emoji
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <option value='🍽️'>🍽️ General</option>
                    <option value='🍗'>🍗 Meat</option>
                    <option value='🐟'>🐟 Fish</option>
                    <option value='🥚'>🥚 Eggs</option>
                    <option value='🥛'>🥛 Dairy</option>
                    <option value='🍚'>🍚 Rice/Grains</option>
                    <option value='🍞'>🍞 Bread</option>
                    <option value='🥗'>🥗 Vegetables</option>
                    <option value='🍎'>🍎 Fruits</option>
                    <option value='🥜'>🥜 Nuts</option>
                    <option value='🥑'>🥑 Avocado</option>
                    <option value='🍠'>🍠 Sweet Potato</option>
                  </select>
                </div>
                {formik.errors.emoji && formik.touched.emoji && (
                  <div className='text-red-500 text-xs mt-1'>
                    {formik.errors.emoji}
                  </div>
                )}
              </div>

              {/* Nutrition Preview */}
              {formik.values.name &&
                formik.values.calories !== '' &&
                formik.values.protein !== '' && (
                  <div className='bg-blue-50 border border-blue-200 rounded-xl p-4'>
                    <h4 className='text-sm font-medium text-gray-700 mb-3'>
                      Nutrition Preview
                    </h4>
                    <div className='grid grid-cols-2 gap-3'>
                      <div className='flex items-center gap-2'>
                        <Flame className='text-red-500' size={16} />
                        <div>
                          <p className='text-xs text-gray-500'>Calories</p>
                          <p className='font-semibold text-gray-900'>
                            {Math.round(
                              parseFloat(formik.values.calories) * servings
                            )}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Zap className='text-blue-500' size={16} />
                        <div>
                          <p className='text-xs text-gray-500'>Protein</p>
                          <p className='font-semibold text-gray-900'>
                            {Math.round(
                              parseFloat(formik.values.protein) * servings * 10
                            ) / 10}
                            g
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Food Items List (Multi-Add Mode) */}
              {isMultiAddMode && foodItems.length > 0 && (
                <div className='bg-gray-50 border border-gray-200 rounded-xl p-4'>
                  <h4 className='text-sm font-medium text-gray-700 mb-3'>
                    Added Food Items ({foodItems.length})
                  </h4>
                  <div className='space-y-2 max-h-32 overflow-y-auto'>
                    {foodItems.map((item, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200'
                      >
                        <div className='flex items-center gap-3'>
                          <span className='text-lg'>{item.food.emoji}</span>
                          <div>
                            <p className='text-sm font-medium text-gray-900'>
                              {item.food.name}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {item.servings} X {item.food?.quantity}{item.food.quantityUnit?.shortName} • {item.food.calories} cal
                            </p>
                          </div>
                        </div>
                        <button
                          type='button'
                          onClick={() => removeFoodFromList(index)}
                          className='text-red-500 hover:text-red-700 p-1'
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex gap-3 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                className='flex-1'
              >
                Cancel
              </Button>
              
              {isMultiAddMode ? (
                <>
                  <Button
                    type='submit'
                    disabled={formik.isSubmitting || isAdding}
                    className='flex-1 bg-green-500 hover:bg-green-600 text-white disabled:opacity-50'
                  >
                    {isAdding ? (
                      <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        Adding...
                      </div>
                    ) : (
                      'Add to List'
                    )}
                  </Button>
                  <Button
                    type='button'
                    onClick={handleAddAllFoods}
                    disabled={foodItems.length === 0 || isAdding}
                    className='flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50'
                  >
                    {isAdding ? (
                      <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        Adding All...
                      </div>
                    ) : (
                      <>
                      {(foodItems.length > 0) ? (foodItems.length > 1 ? `Add All (${foodItems.length})` : `Add ${foodItems?.[0]?.food.name}`) : `Select items to add`}
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  type='submit'
                  disabled={formik.isSubmitting || isAdding}
                  className='flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50'
                >
                  {isAdding ? (
                    <div className='flex items-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      Adding...
                    </div>
                  ) : (
                    `Add to ${mealType}`
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewFoodModal;
