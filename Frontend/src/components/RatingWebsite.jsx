// import React, { useState, Component } from 'react'
// import { Toaster, toast } from 'sonner'
// import { StarIcon, SparklesIcon } from 'lucide-react'
// export function RatingComponent() {
//   const [rating, setRating] = useState<number | null>(null)
//   const [hover, setHover] = useState<number | null>(null)
//   const [submitted, setSubmitted] = useState(false)
//   const handleRating = (value: number) => {
//     setRating(value)
//     setSubmitted(true)
//     toast.success('Thank you for your feedback!', {
//       description: `You rated us ${value} out of 5 stars.`,
//       duration: 4000,
//     })
//   }
//   const getRatingDescription = () => {
//     const value = hover !== null ? hover : rating
//     if (!value) return "We'd love your feedback!"
//     const descriptions: Record<number, string> = {
//       1: "We'll work harder to improve",
//       2: 'We appreciate your honesty',
//       3: 'Thanks for the feedback',
//       4: "We're glad you like it",
//       5: 'Wow! Thank you so much!',
//     }
//     return descriptions[value]
//   }
//   return (
//     <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
//       <Toaster position="top-center" richColors />
//       {/* Decorative elements */}
//       <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-100 rounded-full opacity-50"></div>
//       <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-100 rounded-full opacity-50"></div>
//       <div className="relative z-10">
//         <div className="flex items-center mb-6">
//           <SparklesIcon className="text-purple-500 mr-2 h-6 w-6" />
//           <h2 className="text-2xl font-bold text-gray-800">
//             Rate Your Experience
//           </h2>
//         </div>
//         <p className="text-gray-600 mb-8">
//           How would you rate your experience with our service? Your feedback
//           helps us improve.
//         </p>
//         <div className="flex justify-center mb-6">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <button
//               key={star}
//               onClick={() => handleRating(star)}
//               onMouseEnter={() => setHover(star)}
//               onMouseLeave={() => setHover(null)}
//               className="focus:outline-none transition-transform mx-1"
//             >
//               <StarIcon
//                 className={`h-10 w-10 transition-all duration-200 ${(hover !== null ? star <= hover : star <= (rating || 0)) ? 'fill-yellow-400 text-yellow-400 scale-110' : 'text-gray-300'} ${hover !== null && star <= hover ? 'animate-pulse' : ''}`}
//               />
//             </button>
//           ))}
//         </div>
//         <div className="text-center min-h-[2rem] mb-4">
//           <p
//             className={`text-lg font-medium transition-opacity duration-300 ${hover !== null || rating !== null ? 'text-purple-600' : 'text-gray-500'}`}
//           >
//             {getRatingDescription()}
//           </p>
//         </div>
//         {submitted && (
//           <div className="mt-6 text-center">
//             <p className="text-green-600 font-medium">
//               Thank you for your feedback!
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
