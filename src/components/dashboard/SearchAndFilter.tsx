
import { Search, ListFilter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchAndFilter = ({ searchQuery, setSearchQuery }: SearchAndFilterProps) => {
  return (
    <div className="mb-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search requests..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button variant="outline">
        <ListFilter size={16} className="mr-2" />
        Filter
      </Button>
    </div>
  );
};

export default SearchAndFilter;
