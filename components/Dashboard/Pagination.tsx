import React from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
}

function Pagination({ currentPage, totalPages, setCurrentPage, }: Props) {
    function goToPage(page: number) {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }

    return (
        <div className={`${totalPages > 1 ? "w-full flex justify-end" : "hidden"}`}>
            <div className="flex flex-row gap-4">
                <Button className='border !text-black !border-gray-200 !bg-transparent shadow-none border-none'
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}>
                        <ChevronLeft />
                </Button>
                {/* {currentPage - 1 > 0 && <Button onClick={() => goToPage(currentPage - 1)} className='bg-gray-300 !border-none  !text-black px-3 py-1 rounded-sm'>{currentPage - 1} </Button>} */}
                <Button onClick={() => goToPage(currentPage)} className='bg-[#0128AE] hover:bg-[#0128AE]/70 rounded-none !border-none !text-white px-3 py-1'>{currentPage}</Button>
                {currentPage + 1 < totalPages && <Button onClick={() => goToPage(currentPage + 1)} className='bg-transparent rounded-none shadow-none hover:bg-gray-50 !border-none  !text-black px-3 py-1'>{currentPage + 1} </Button>}
                {currentPage + 2 < totalPages && <p>...</p> }
                {/* {currentPage + 5 < totalPages ? (
                    <p className='flex flex-row gap-2 items-center'>
                        ...<Button onClick={() => goToPage(currentPage + 5)} className='bg-gray-300 !border-none  !text-black px-3 py-1 '>{currentPage + 5}</Button>
                    </p>
                ) : currentPage !== totalPages ? <Button onClick={() => goToPage(totalPages)} className='bg-gray-300 !border-none !text-black px-3 py-1'>{totalPages}</Button> : ""} */}

                <Button
                    className='border !text-black !border-gray-200 !bg-transparent shadow-none border-none'
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}>
                    <ChevronRight />
                </Button>
            </div>
        </div>
    )
}

export default Pagination