"use client";

import { FC } from 'react'
import { useRouter } from 'next/navigation';
import { HiArrowSmLeft } from "react-icons/hi";

const BackButton: FC = () => {
    const router = useRouter();

    return (
        <button onClick={() => router.back()} className="h-6 w-6 flex items-center justify-center text-black/60">
            <HiArrowSmLeft />
        </button>
    )
}

export default BackButton