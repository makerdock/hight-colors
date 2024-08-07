"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import ShineBorder from "./magicui/shine-border"

type Checked = DropdownMenuCheckboxItemProps["checked"]

export function DropdownMenuCheckboxes() {
    const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
    const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
    const [showPanel, setShowPanel] = React.useState<Checked>(false)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <ShineBorder
                    className="text-center text-sm font-bold uppercase w-full tracking-widest shadow-lg cursor-pointer"
                    color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                    borderWidth={2}
                >
                    <span>Mint</span>
                </ShineBorder>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>Pay with Eth (0.004)</DropdownMenuItem>
                <DropdownMenuItem>Pay with $HIGHER (100)</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}
