const ProgressBar = ({ current, goal, color = "bg-blue-500" }: { current: number; goal: number; color?: string }) => {
    const percentage = Math.min((current / goal) * 100, 100);
    return (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
                className={`h-2 rounded-full ${color}`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;