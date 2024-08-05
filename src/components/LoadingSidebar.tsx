import React from 'react'
import BlurIn from './magicui/blur-in'
import Particles from './magicui/particles'
import AnimatedGradientText from './magicui/animated-gradient-text'
import classNames from 'classnames'

const LoadingSidebar = () => {
    return (
        <div
            className='relative w-full h-full flex items-center justify-center px-6 overflow-hidden'
        >
            <Particles
                className="absolute inset-0"
                quantity={100}
                ease={80}
                color={"#000"}
                refresh
            />
            {/* <h3 className='text-3xl'>Loading...</h3> */}
            <BlurIn
                // word="Minting your arrow"
                className="text-2xl font-bold text-black dark:text-white text-center absolute"
            >

                <AnimatedGradientText>
                    {/* 🎉 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{" "} */}
                    <span
                        className={classNames(
                            `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                        )}
                    >
                        Minting your arrow
                    </span>
                    {/* <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" /> */}
                </AnimatedGradientText>

            </BlurIn>

        </div>
    )
}

export default LoadingSidebar