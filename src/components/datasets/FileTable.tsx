import { FileText, MoreHorizontal, UploadCloud } from 'lucide-react';
import { FileItem } from '@/types';

export default function FileTable({ files }: { files: FileItem[] }) {
  return (
    <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-100">
            <th className="px-6 py-4 font-medium">Name</th>
            <th className="px-6 py-4 font-medium">Added By</th>
            <th className="px-6 py-4 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, i) => (
            <tr 
              key={file.id} 
              className={`
                group hover:bg-white transition-colors
                ${i !== files.length - 1 ? 'border-b border-gray-100' : ''}
              `}
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 group-hover:border-black transition-colors">
                    <FileText size={20} />
                  </div>
                  <span className="font-medium text-gray-900">{file.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-orange-200"></div> 
                    <span className="text-gray-600">{file.addedBy}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                 <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-black transition">
                    <MoreHorizontal size={20} />
                 </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center">
          <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition">
              <UploadCloud size={16} />
              Upload New File
          </button>
      </div>
    </div>
  );
}
