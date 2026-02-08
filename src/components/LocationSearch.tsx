import * as React from 'react'
import {
    Check, ChevronsUpDown, Search

} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { LOCATIONS } from '@/lib/routeOptimization'

interface LocationSearchProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    disabledValue?: string
    variant?: 'source' | 'destination'
}

export function LocationSearch({
    value,
    onChange,
    placeholder = "Search location...",
    disabledValue,
    variant = 'source'
}: LocationSearchProps) {
    const [open, setOpen] = React.useState(false)

    const locationsByRegion = LOCATIONS.reduce((acc, loc) => {
        if (!acc[loc.region]) acc[loc.region] = []
        acc[loc.region].push(loc)
        return acc
    }, {} as Record<string, typeof LOCATIONS>)

    const selectedLocation = LOCATIONS.find(l => l.id === value)

    const variantColor = variant === 'source' ? 'emerald' : 'red'

    return (
        <Popover open={open} onOpenChange={setOpen} modal={false}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full h-16 justify-between rounded-2xl border-border bg-card/50 hover:bg-card/80 hover:border-primary/50 transition-all text-base font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        {selectedLocation ? (
                            <div className="flex flex-col items-start">
                                <span className="font-medium">{selectedLocation.name}</span>
                                <span className="text-xs text-muted-foreground capitalize">{selectedLocation.region.replace('_', ' ')}</span>
                            </div>
                        ) : (
                            placeholder
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start" sideOffset={8} avoidCollisions={false}>

                <Command>
                    <CommandInput placeholder="Type to search cities, states..." className="h-12" />
                    <CommandList
                        className="max-h-[300px] overflow-y-auto overscroll-contain"
                        onWheel={(e) => e.stopPropagation()}
                    >
                        <CommandEmpty>No location found.</CommandEmpty>
                        {Object.entries(locationsByRegion).map(([region, locs]) => (
                            <CommandGroup
                                key={region}
                                heading={
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        {region.replace('_', ' ')} Zone
                                    </span>
                                }
                            >
                                {locs.map((loc) => {
                                    const isDisabled = loc.id === disabledValue
                                    return (
                                        <CommandItem
                                            key={loc.id}
                                            value={`${loc.name} ${loc.region}`}
                                            onSelect={() => {
                                                if (!isDisabled) {
                                                    onChange(loc.id)
                                                    setOpen(false)
                                                }
                                            }}
                                            disabled={isDisabled}
                                            className={cn(
                                                "cursor-pointer",
                                                isDisabled && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === loc.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex flex-col">
                                                <span>{loc.name}</span>
                                            </div>
                                            {value === loc.id && (
                                                <div className={`ml-auto w-2 h-2 rounded-full bg-${variantColor}-400`} />
                                            )}
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
