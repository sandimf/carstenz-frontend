import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GridPattern } from "@/components/ui/grid-pattern"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { landingContent } from "@/data/landing"


export function Hero() {
    const { version, title, description, footer } = landingContent.hero
    const links = landingContent.link 
    const router = useRouter()
    const [loadingLink, setLoadingLink] = useState<number | null>(null)

    const handleLinkClick = (link: (typeof links)[0], index: number) => {
        if (link.disabled) return
        setLoadingLink(index)
        router.push(link.route)
    }

    return (
        <div className="relative min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
            <GridPattern
                squares={[
                    [4, 4],
                    [5, 1],
                    [8, 2],
                    [5, 3],
                    [5, 5],
                    [10, 10],
                ]}
                strokeDasharray="4 2"
                className={cn(
                    "absolute inset-0 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
                )}
            />

            <main className="relative z-10">
                <div className="container mx-auto px-6 py-13 max-w-6xl">
                    <div className="text-center mb-16">
                        <div className="z-10 flex mb-8 items-center justify-center">
                            <div
                                className={cn(
                                    "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                                )}
                            >
                                <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                                    <span>{version}</span>
                                </AnimatedShinyText>
                            </div>
                        </div>

                        <h1 className="bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white text-transparent mb-3 tracking-tight leading-none dark:from-white dark:to-slate-900/10">
                            {title}
                            <br />
                        </h1>

                        <p className="text-6sm md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-normal">
                            {description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-3">
                            {links.map((link, index) => (
                                <Button
                                    key={index}
                                    size="lg"
                                    className={cn(
                                        "min-w-[250px] px-6 py-3 text-base rounded-md font-medium transition-colors flex items-center justify-center",
                                        index === 0
                                            ? ""
                                            : ""
                                    )}
                                    onClick={() => handleLinkClick(link, index)}
                                    disabled={loadingLink === index}
                                >
                                    {loadingLink === index && (
                                        <Spinner variant="ellipsis" className="h-4 w-4 mr-2" />
                                    )}
                                    {link.title}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800">
                    <div className="container mx-auto px-6 py-12 max-w-6xl text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {footer}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
