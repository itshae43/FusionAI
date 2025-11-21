import { DatasetFolder } from '@/types';

export default function FolderCard({ folder }: { folder: DatasetFolder }) {
  return (
    <div 
      className={`
        ${folder.color} 
        p-6 rounded-3xl relative cursor-pointer hover:scale-[1.02] transition-transform duration-200 h-48 flex flex-col justify-between
      `}
    >
      <div>
        <h3 className="text-xl font-semibold">{folder.name}</h3>
      </div>
      
      <div className="flex items-end justify-between">
        <div className={`w-10 h-10 rounded-lg ${folder.iconColor} shadow-sm`}></div>
        <span className="text-sm font-medium opacity-60">{folder.count} Items</span>
      </div>
    </div>
  );
}
