'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ExternalLink, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from 'next/image'

export default function Page() {
  const router = useRouter()
  const [loadingLink, setLoadingLink] = useState<number | null>(null)

  const links = [
    {
      title: "Screening Form",
      description: "Pemeriksaan kesehatan sebelum mendaki gunung",
      route: "/carstensz/form",
      disabled: false,
      icon: Shield,
    },
  ]

  const handleLinkClick = (link: typeof links[0], index: number) => {
    if (link.disabled) return
    setLoadingLink(index)
    router.push(link.route)
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      <main className="relative z-10">
        <div className="w-full px-6 py-12 lg:py-20 lg:px-16">
          <div className="mb-16">

            {/* Image */}
            <div className="w-full mb-6">
              <Image
                src="/logo.jpg"
                alt="cartens"
                width={1000}
                height={800}
		priority
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Carstensz Pyramid Expedition
              <br />
              <span className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white">
                Medical Pre‑Screening Form
              </span>
            </h1>

            {/* Paragraph */}
            <p className="text-sm md:text-base lg:text-lg text-gray-800 dark:text-gray-300 mb-12 leading-relaxed max-w-full">
              <span className='mb-4 block'><span className='font-bold'>Hi Carstensz climbers, </span>you're on the roster for the Carstensz Pyramid summit this month.</span>
              <span className='block mt-4'>
                I am <span className='font-bold'>Chandra Sembiring, MD</span>, Expedition Medical Doctor Lead (High-Altitude & Wilderness Medicine), operating the medical post at Basecamp <span className='font-bold'>Yellow Valley</span>. We provide on-site assessment, oxygen therapy, altitude-illness management, trauma stabilization, and coordinate evacuation. Evacuation is weather-dependent and delays can occur; timely, honest pre-screening helps us plan your acclimatization and risk mitigation. Your data is confidential and used only by the medical/safety team for clinical decisions and emergencies. We do not share it without your consent except in life-threatening situations (retained up to 12 months for safety audit).
              </span>
            </p>

            {/* Buttons */}
            <div className="w-full flex flex-col gap-4 lg:flex-row lg:gap-6">
              {links.map((link, index) => (
                <Button
                  key={index}
                  size="lg"
                  className={cn(
                    "flex-1 px-6 py-3 text-base rounded-md font-medium flex items-center justify-center",
                    index === 0
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "border border-gray-300 dark:border-gray-700"
                  )}
                  onClick={() => handleLinkClick(link, index)}
                  disabled={loadingLink === index}
                >
                  {link.title}
                  <ExternalLink className="ml-2" />
                </Button>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
