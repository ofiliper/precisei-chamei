import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    current: number;
    totalPages: number;
    prev: () => void;
    next: () => void;
}

export default function Pagination({ current, totalPages, prev, next }: PaginationProps) {
    const showPrevButton = current > 1;
    const showNextButton = current < totalPages;
    const totalPagesDisplay = totalPages || 1;

    return (
        <div className="flex items-center justify-end gap-4 py-3 px-2">
            <div className="flex items-center gap-2">
                <button
                    aria-label="Previous Page"
                    className={`
                        flex items-center justify-center w-9 h-9 rounded-md
                        transition-colors duration-200
                        ${showPrevButton 
                            ? 'border border-gray-200 hover:bg-gray-50 cursor-pointer' 
                            : 'opacity-50 cursor-not-allowed'}
                    `}
                    onClick={prev}
                    disabled={!showPrevButton}
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                <div className="flex items-center">
                    <input
                        type="text"
                        className="w-12 h-9 text-center text-sm font-medium 
                                 border border-gray-200 rounded-md 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={current}
                        readOnly
                        aria-label="Current Page"
                    />
                    <span className="mx-2 text-sm text-gray-600">de {totalPagesDisplay}</span>
                </div>

                <button
                    aria-label="Next Page"
                    className={`
                        flex items-center justify-center w-9 h-9 rounded-md
                        transition-colors duration-200
                        ${showNextButton
                            ? 'border border-gray-200 hover:bg-gray-50 cursor-pointer'
                            : 'opacity-50 cursor-not-allowed'}
                    `}
                    onClick={next}
                    disabled={!showNextButton}
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </div>
    );
}
