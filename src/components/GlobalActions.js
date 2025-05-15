'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { MessageSquare, Filter, X } from "lucide-react"
import ChatAssistant from '@/components/ChatAssistant'
import VoiceQueryButton from '@/components/VoiceQueryButton'
import { useTaskContext } from '@/contexts/TaskContext'
import { STATUS_COLORS } from '@/app/utils'

export default function GlobalActions() {
  const [showChat, setShowChat] = useState(false)
  const { filteredTasks, clearFiltered } = useTaskContext()

  // Determine if filtered tasks are currently active
  const isFiltered = filteredTasks && filteredTasks.length > 0

  return (
    <>
      {/* Floating Action Buttons Container */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-row gap-3 items-center">
        {/* Voice Query Button */}
        <div>
          <VoiceQueryButton />
        </div>
        
        {/* Show All Tasks Button - Only visible when tasks are filtered */}
        {isFiltered && (
          <motion.button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 flex items-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFiltered}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <X className="h-5 w-5" />
            <span className="pr-1">Show All Tasks</span>
          </motion.button>
        )}
        
        {/* Ask About Tasks Button */}
        <motion.button
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 flex items-center gap-2 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowChat(!showChat)}
        >
          {showChat ? (
            <>
              <X className="h-5 w-5" />
              <span className="pr-1">Close Assistant</span>
            </>
          ) : (
            <>
              <MessageSquare className="h-5 w-5" />
              <span className="pr-1">Ask About Tasks</span>
            </>
          )}
        </motion.button>
      </div>
      
      {/* Chat Assistant */}
      {showChat && (
        <ChatAssistant 
          onClose={() => setShowChat(false)}
          statusColors={STATUS_COLORS}
        />
      )}
    </>
  )
}
