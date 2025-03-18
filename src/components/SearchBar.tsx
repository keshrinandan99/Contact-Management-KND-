
import { Search } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

export const SearchBar = ({ 
  onSearch, 
  placeholder = "Search contacts...", 
  className,
  initialValue = ""
}: SearchBarProps) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
  };
  
  return (
    <div className={cn(
      "relative w-full transition-all duration-200 ease-in-out",
      isFocused ? "scale-[1.01]" : "",
      className
    )}>
      <div className={cn(
        "flex items-center w-full rounded-xl border border-border bg-background px-3 py-2",
        isFocused ? "border-primary/50 ring-2 ring-primary/20" : "hover:border-primary/30",
      )}>
        <Search className="h-4 w-4 text-muted-foreground mr-2" />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {value && (
          <button
            onClick={() => {
              setValue("");
              onSearch("");
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
