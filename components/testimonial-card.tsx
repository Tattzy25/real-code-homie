import Image from "next/image"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  avatarUrl: string
}

export function TestimonialCard({ quote, author, role, avatarUrl }: TestimonialCardProps) {
  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm border border-purple-900/50 rounded-lg p-6 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10">
      <div className="flex items-start mb-4">
        <svg className="h-8 w-8 text-purple-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-gray-300 italic">{quote}</p>
      </div>
      <div className="flex items-center mt-6">
        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
          <Image src={avatarUrl || "/placeholder.svg"} alt={author} width={40} height={40} className="object-cover" />
        </div>
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  )
}
