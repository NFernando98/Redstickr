import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
    const handleClear = () => {
        onSearchChange('');
    };

    return (
        <div className="relative">
            <Input
                type="text"
                placeholder="Search by product name or item number..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pr-10" // Add padding to the right to make space for the clear button
            />
            {searchTerm && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={handleClear}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};

export default SearchBar;