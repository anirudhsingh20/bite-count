import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Minus, Flame, Zap } from 'lucide-react';
import { Button } from './ui/button';
import AddNewFoodModal from './AddNewFoodModal';
import { getFoods, logMeals, type CreateBulkFoodLogRequest } from '../containers/dashboard/api-handlers';
import { toast } from 'sonner';
import type { FoodItem } from './AddNewFoodModal';
import { useAppSelector } from '../store/hooks';
import { getStartDateEpoch, getCurrentEpoch } from '../lib/date';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  onAddFood: (food: FoodItem, quantity: number) => void;
  onAddMultipleFoods?: (foods: Array<{ food: FoodItem; quantity: number }>) => void;
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  mealType,
  onAddFood,
  onAddMultipleFoods,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [foodData, setFoodData] = useState<FoodItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedFoodId, setExpandedFoodId] = useState<string | null>(null);
  const [showAddNewFoodModal, setShowAddNewFoodModal] = useState(false);
  const [isFoodFetching, setIsFoodFetching] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<Array<{ food: FoodItem; quantity: number }>>([]);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  const fetchFoodData = async () => {
    try {
      setIsLoading(true);
      setIsFoodFetching(true);
      const response = await getFoods();
      if (response.success && response.data) {
        setFoodData(response.data);
      } else {
        throw new Error('Some error occurred while fetching data');
      }
    } catch (error) {
      console.error(error);
      toast.error((error as Error)?.message);
    } finally {
      setIsFoodFetching(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFoods(foodData);
    } else {
      const filtered = foodData.filter((food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFoods(filtered);
    }
  }, [searchQuery, foodData]);

  const handleIncrementAndAdd = (food: FoodItem) => {
    const currentQuantity = itemQuantities[food._id || ''] || 0;
    const newQuantity = currentQuantity + 1;
    
    setItemQuantities(prev => ({ ...prev, [food._id || '']: newQuantity }));
    
    // Update or add the food item with the new total quantity
    setSelectedFoods(prev => {
      const existingIndex = prev.findIndex(item => item.food._id === food._id);
      if (existingIndex !== -1) {
        // Update existing item with new quantity
        const updated = [...prev];
        updated[existingIndex] = { food, quantity: newQuantity };
        return updated;
      } else {
        // Add new item
        return [...prev, { food, quantity: newQuantity }];
      }
    });
    // toast.success('Food added to list');
  };

  const handleDecrement = (food: FoodItem) => {
    const currentQuantity = itemQuantities[food._id || ''] || 1;
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      setItemQuantities(prev => ({ ...prev, [food._id || '']: newQuantity }));
      
      // Update the existing item with new quantity
      setSelectedFoods(prev => {
        const existingIndex = prev.findIndex(item => item.food._id === food._id);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = { food, quantity: newQuantity };
          return updated;
        }
        return prev;
      });
    } else {
      // If quantity is 1, remove the item completely
      setItemQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[food._id || ''];
        return newQuantities;
      });
      
      setSelectedFoods(prev => prev.filter(item => item.food._id !== food._id));
      setExpandedFoodId(null);
      // toast.success('Food removed from list');
    }
  };

  const handleInitialAdd = (food: FoodItem) => {
    const isAlreadySelected = selectedFoods.some(item => item.food._id === food._id);
    
    if (isAlreadySelected) {
      // If already selected, just expand the view
      setExpandedFoodId(food._id || '');
    } else {
      // If not selected, add to list and expand
      setExpandedFoodId(food._id || '');
      setItemQuantities(prev => ({ ...prev, [food._id || '']: 1 }));
      setSelectedFoods(prev => [...prev, { food, quantity: 1 }]);
      // toast.success('Food added to list');
    }
  };

  const handleAddAllSelectedFoods = async () => {
    if (selectedFoods.length === 0) return;
    
    setIsAdding(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      if (onAddMultipleFoods) {
        const requestBody: CreateBulkFoodLogRequest = {
          user: user?._id || '',
          mealType: mealType,
          items: selectedFoods.map(item => ({
            meal: item.food._id || '',
            quantity: item.quantity,
          })),
          logDate: getStartDateEpoch(),
          loggedAt: getCurrentEpoch(),        
        };
        const response = await logMeals(requestBody);
        if (response.success) {
          toast.success(`${selectedFoods.length} food items added successfully`);
        } else {
          toast.error('Failed to add food items');
        }
        console.info(response);
        onAddMultipleFoods(selectedFoods);
        toast.success(`${selectedFoods.length} food items added successfully`);
      } else {
        // check and update this flow
        // Fallback to adding one by one
        for (const item of selectedFoods) {
          onAddFood(item.food, item.quantity);
        }
        toast.success(`${selectedFoods.length} food items added successfully`);
      }
      setSelectedFoods([]);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add food items');
    } finally {
      setIsAdding(false);
    }
  };


  if (!isOpen) return null;

  return (
    <>
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
                  Add to {mealType}
                </h2>
                <p className='text-sm text-gray-500'>
                  Search and add food items
                </p>
                {selectedFoods.length > 0 && (
                  <div className='flex items-center gap-2 mt-2'>
                    <span className='text-xs text-blue-600 font-medium'>
                      {selectedFoods.length} item{selectedFoods.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                )}
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

            {/* Search Bar */}
            <div className='relative mt-4'>
              <Search
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                size={20}
              />
              <input
                type='text'
                disabled={isFoodFetching || isLoading}
                placeholder='Search for food items...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            {/* Add New Food Button */}
            <div className='mt-3'>
              <Button
                disabled={isFoodFetching || isLoading}
                onClick={() => setShowAddNewFoodModal(true)}
                variant='outline'
                className='w-full border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600'
              >
                <Plus size={16} className='mr-2' />
                Add New Food Item
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className='flex-1 flex flex-col h-full min-h-0 overflow-y-auto'>
            {/* Food List View */}
            <div className='flex-1 overflow-y-auto p-4 space-y-3'>
              {filteredFoods.length === 0 ? (
                <div className='text-center py-8'>
                  <Search className='mx-auto text-gray-300 mb-2' size={48} />
                  <p className='text-gray-500'>No food items found</p>
                  <p className='text-sm text-gray-400'>
                    Try a different search term
                  </p>
                </div>
              ) : (
                filteredFoods.map((food) => {
                  const isExpanded = expandedFoodId === food._id;
                  const isSelected = selectedFoods.some(item => item.food._id === food._id);
                  const foodQuantity = itemQuantities[food._id || ''] || 1;

                  return (
                    <div
                      key={food._id}
                      className='flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all group'
                    >
                      <div className='text-3xl'>{food.emoji ?? '🍽️'}</div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2'>
                          <h3 className='font-medium text-gray-900'>
                            {food.name}
                          </h3>
                          {food.user === user?._id && (
                            <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>
                              You added
                            </span>
                          )}
                        </div>
                        <p className='text-sm text-gray-500'>
                          {food.servingSize}
                        </p>
                        <div className='flex items-center gap-4 mt-1'>
                          <div className='flex items-center gap-1 text-xs text-gray-500'>
                            <Flame className='text-red-400' size={12} />
                            <span>
                              {Math.round(food.calories * foodQuantity)} cal
                            </span>
                          </div>
                          <div className='flex items-center gap-1 text-xs text-gray-500'>
                            <Zap className='text-blue-400' size={12} />
                            <span>
                              {Math.round(food.protein * foodQuantity * 10) /
                                10}
                              g protein
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Selector or Add Button */}
                      {(isExpanded || isSelected) ? (
                        <div className='flex items-center gap-2'>
                          <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handleDecrement(food)}
                            className='w-8 h-8 p-0 rounded-full hover:bg-gray-100'
                          >
                            <Minus size={16} />
                          </Button>

                          <span className='text-lg font-semibold text-gray-900 min-w-[24px] text-center'>
                            {foodQuantity}
                          </span>

                          <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handleIncrementAndAdd(food)}
                            className='w-8 h-8 p-0 rounded-full hover:bg-gray-100'
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleInitialAdd(food)}
                          className='w-8 h-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600 text-white'
                        >
                          <Plus size={16} />
                        </Button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='p-4 border-t border-gray-100'>
            <div className='flex gap-3'>
              <Button
                onClick={handleAddAllSelectedFoods}
                disabled={selectedFoods.length === 0 || isAdding}
                className={`flex-1 text-white disabled:opacity-50 ${
                  selectedFoods.length === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isAdding ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    Adding All...
                  </div>
                ) : (
                  `Add All (${selectedFoods.length})`
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Food Modal */}
      <AddNewFoodModal
        isOpen={showAddNewFoodModal}
        onClose={() => setShowAddNewFoodModal(false)}
        mealType={mealType}
        onAddFood={onAddFood}
        onAddMultipleFoods={onAddMultipleFoods}
      />
    </>
  );
};

export default AddFoodModal;
