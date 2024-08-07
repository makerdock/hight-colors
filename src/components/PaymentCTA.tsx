"use client"

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import useColorStore from "~/stores/useColorStore"
import ShineBorder from "./magicui/shine-border"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "./ui/dropdown-menu"

export function PaymentCta() {
    const {
        mintArrow, mintError, mintArrowWithHigher,
    } = useColorStore();
    return (
        <>

            <DropdownMenu>
                <DropdownMenuTrigger className="hover:outline-none focus:outline-none">
                    <ShineBorder
                        className="text-center text-sm font-bold uppercase w-full tracking-widest shadow-lg cursor-pointer"
                        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                        borderWidth={2}
                    >
                        <span>Mint</span>
                    </ShineBorder>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={mintArrow}
                    >Pay with 0.004 Eth</DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={mintArrowWithHigher}
                    >Pay with 100 $HIGHER</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {/* {!!mintError?.length && <div className="text-red-500 text-sm font-medium mt-1">{mintError}</div>} */}
        </>

    )
}
