import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Minus, Flame, Zap } from 'lucide-react';
import { Button } from './ui/button';
import AddNewFoodModal from './AddNewFoodModal';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  quantity: number;
  image?: string;
  userId?: string;
  userName?: string;
}

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: string;
  onAddFood: (food: FoodItem, quantity: number) => void;
}

const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Grilled Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    serving: '100g',
    quantity: 1,
    image: '🍗'
    // No userId/userName - visible to all users
  },
  {
    id: '2',
    name: 'Brown Rice',
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    serving: '100g',
    quantity: 1,
    image: '🍚'
    // No userId/userName - visible to all users
  },
  {
    id: '3',
    name: 'Avocado',
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    serving: '100g',
    quantity: 1,
    image: '🥑'
    // No userId/userName - visible to all users
  },
  {
    id: '4',
    name: 'Greek Yogurt',
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    serving: '100g',
    quantity: 1,
    image: '🥛'
    // No userId/userName - visible to all users
  },
  {
    id: '5',
    name: 'Banana',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    serving: '100g',
    quantity: 1,
    image: '🍌'
    // No userId/userName - visible to all users
  },
  {
    id: '6',
    name: 'Almonds',
    calories: 579,
    protein: 21,
    carbs: 22,
    fat: 50,
    serving: '100g',
    quantity: 1,
    image: '🥜'
    // No userId/userName - visible to all users
  },
  {
    id: '7',
    name: 'Salmon Fillet',
    calories: 208,
    protein: 25,
    carbs: 0,
    fat: 12,
    serving: '100g',
    quantity: 1,
    image: '🐟'
    // No userId/userName - visible to all users
  },
  {
    id: '8',
    name: 'Sweet Potato',
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    serving: '100g',
    quantity: 1,
    image: '🍠'
    // No userId/userName - visible to all users
  },
  {
    id: '9',
    name: 'John\'s Special Smoothie',
    calories: 250,
    protein: 15,
    carbs: 30,
    fat: 8,
    serving: '1 cup',
    quantity: 1,
    image: '🥤',
    userId: '1',
    userName: 'John Doe'
  },
  {
    id: '10',
    name: 'Jane\'s Protein Bowl',
    calories: 400,
    protein: 35,
    carbs: 25,
    fat: 12,
    serving: '1 bowl',
    quantity: 1,
    image: '🥗',
    userId: '2',
    userName: 'Jane Smith'
  }
];

const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  mealType,
  onAddFood
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>(mockFoodItems);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedFoodId, setExpandedFoodId] = useState<string | null>(null);
  const [showAddNewFoodModal, setShowAddNewFoodModal] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFoods(mockFoodItems);
    } else {
      const filtered = mockFoodItems.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFoods(filtered);
    }
  }, [searchQuery]);

  const handleAddFood = async (food: FoodItem, customQuantity?: number) => {
    const quantityToAdd = customQuantity || quantity;
    setIsAdding(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onAddFood(food, quantityToAdd);
    setExpandedFoodId(null);
    setQuantity(1);
    setIsAdding(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative flex flex-col min-h-0 h-full bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 ease-out">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add to {mealType}</h2>
                <p className="text-sm text-gray-500">Search and add food items</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </Button>
            </div>
            
            {/* Search Bar */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Add New Food Button */}
            <div className="mt-3">
              <Button
                onClick={() => setShowAddNewFoodModal(true)}
                variant="outline"
                className="w-full border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
              >
                <Plus size={16} className="mr-2" />
                Add New Food Item
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col h-full min-h-0 overflow-y-auto">
            {/* Food List View */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredFoods.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="mx-auto text-gray-300 mb-2" size={48} />
                  <p className="text-gray-500">No food items found</p>
                  <p className="text-sm text-gray-400">Try a different search term</p>
                </div>
              ) : (
                filteredFoods.map((food) => {
                  const isExpanded = expandedFoodId === food.id;
                  const foodQuantity = isExpanded ? quantity : 1;
                  
                  return (
                    <div key={food.id} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all group">
                      <div className="text-3xl">{food.image}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">
                            {food.name}
                          </h3>
                          {food.userName && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {food.userName}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{food.serving}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Flame className="text-red-400" size={12} />
                            <span>{Math.round(food.calories * foodQuantity)} cal</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Zap className="text-blue-400" size={12} />
                            <span>{Math.round(food.protein * foodQuantity * 10) / 10}g protein</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quantity Selector or Add Button */}
                      {isExpanded ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </Button>
                          
                          <span className="text-lg font-semibold text-gray-900 min-w-[24px] text-center">
                            {quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </Button>
                          
                          <Button
                            onClick={() => handleAddFood(food, quantity)}
                            disabled={isAdding}
                            className="ml-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-full disabled:opacity-50"
                          >
                            {isAdding ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              'Add'
                            )}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => {
                            setExpandedFoodId(food.id);
                            setQuantity(1);
                          }}
                          className="w-8 h-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
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
        </div>
      </div>

      {/* Add New Food Modal */}
      <AddNewFoodModal
        isOpen={showAddNewFoodModal}
        onClose={() => setShowAddNewFoodModal(false)}
        mealType={mealType}
        onAddFood={onAddFood}
      />
    </>
  );
};

export default AddFoodModal;