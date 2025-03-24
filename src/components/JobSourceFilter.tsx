
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface JobSourceFilterProps {
  sources: string[];
  selectedSources: string[];
  onSourceChange: (sources: string[]) => void;
}

const JobSourceFilter = ({ 
  sources, 
  selectedSources, 
  onSourceChange 
}: JobSourceFilterProps) => {
  
  const toggleSource = (source: string) => {
    if (selectedSources.includes(source)) {
      onSourceChange(selectedSources.filter(s => s !== source));
    } else {
      onSourceChange([...selectedSources, source]);
    }
  };
  
  const isAllSelected = sources.length === selectedSources.length;
  const isNoneSelected = selectedSources.length === 0;
  
  const handleSelectAll = () => {
    if (isAllSelected) {
      onSourceChange([]);
    } else {
      onSourceChange([...sources]);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <span>Sources</span>
          <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
            {selectedSources.length || "0"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Job Sources</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={isAllSelected}
          onCheckedChange={handleSelectAll}
        >
          {isAllSelected ? "Deselect All" : "Select All"}
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {sources.map((source) => (
          <DropdownMenuCheckboxItem
            key={source}
            checked={selectedSources.includes(source)}
            onCheckedChange={() => toggleSource(source)}
          >
            <span className="flex items-center gap-2">
              {source}
              {source === 'LinkedIn Jobs' && (
                <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  New
                </span>
              )}
            </span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default JobSourceFilter;
