'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Send, Bot, User, Mic, Search, Maximize2, Minimize2 } from 'lucide-react'
import { useTaskContext } from '@/contexts/TaskContext'
import { Resizable } from 're-resizable'
import { filterTasksByQuery } from '@/utils/filterUtils'

export default function ChatAssistant({ onClose, statusColors }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I can help you find and manage tasks. Try asking me something like "Show me overdue tasks" or "What tasks are assigned to John?"'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef(null)
  
  // Use the context for tasks and filtering
  const { tasks, setFilteredTasks, setSearchQuery, clearFiltered } = useTaskContext()
  
  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!inputValue.trim() || isProcessing) return
    
    const userQuery = inputValue.trim()
    setInputValue('')
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: userQuery
    }
    setMessages(prev => [...prev, userMessage])
    
    // Show processing state
    setIsProcessing(true)
    
    // Process the query
    try {
      // Use the shared filter utility
      const filteredResults = filterTasksByQuery(tasks, userQuery);
      
      // If null is returned, it means "show all tasks"
      if (filteredResults === null) {
        clearFiltered();
        
        // Add bot response to chat
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          text: `I've reset all filters. Now showing all ${tasks.length} tasks.`
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsProcessing(false);
        return;
      }
      
      // Create bot response
      let responseText = '';
      
      if (filteredResults.length > 0) {
        // Update global filtered tasks through context
        setFilteredTasks(filteredResults);
        
        responseText = `I found ${filteredResults.length} task${filteredResults.length === 1 ? '' : 's'} that match your query. I've updated all views to show these tasks.`;
      } else {
        responseText = "I couldn't find any tasks matching your query. Try something like 'show overdue tasks' or 'maintenance department tasks'.";
      }
      
      // Add bot response to chat
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: responseText
      }
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error processing query:', error)
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: "Sorry, I encountered an error processing your request."
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false);
    }
  }
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <motion.div
      className="fixed bottom-20 right-6 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      <Resizable
        defaultSize={{ width: 380, height: 500 }}
        minWidth={320}
        minHeight={400}
        maxWidth={600}
        maxHeight={700}
        enable={{
          top: true,
          right: true,
          bottom: false,
          left: true,
          topRight: true,
          bottomRight: false,
          bottomLeft: false,
          topLeft: true
        }}
        className={`${isExpanded ? 'fixed top-4 right-4 bottom-4 left-4 w-auto h-auto' : ''}`}
      >
        <Card className="bg-zinc-900 border border-zinc-800 shadow-xl h-full flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-indigo-900/40 text-indigo-400">
                <Bot className="h-4 w-4" />
              </div>
              <h2 className="text-base font-semibold text-white">Hotel Task Assistant</h2>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleExpand}
                className="h-7 w-7 text-zinc-400 hover:text-white"
              >
                {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="h-7 w-7 text-zinc-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-0 flex-grow flex flex-col overflow-hidden">
            <div className="flex-grow overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg ${
                      message.type === 'bot'
                        ? 'bg-zinc-800 text-white'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {message.type === 'bot' ? (
                        <Bot className="h-3 w-3 text-indigo-400" />
                      ) : (
                        <User className="h-3 w-3 text-white" />
                      )}
                      <span className="text-xs font-medium">
                        {message.type === 'bot' ? 'Assistant' : 'You'}
                      </span>
                    </div>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-3 py-2 rounded-lg bg-zinc-800 text-white">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Bot className="h-3 w-3 text-indigo-400" />
                      <span className="text-xs font-medium">Assistant</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-3 border-t border-zinc-800 shrink-0">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about tasks..."
                    className="bg-zinc-800 border-zinc-700 text-white pr-10 text-sm h-9"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-zinc-400"
                  >
                    <Mic className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={!inputValue.trim() || isProcessing}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-3"
                >
                  {isProcessing ? (
                    <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </Button>
              </form>
              
              <div className="mt-2">
                <p className="text-xs text-zinc-500">Suggested: 
                  <button 
                    onClick={() => setInputValue("Show me overdue tasks")}
                    className="ml-1 text-indigo-400 hover:text-indigo-300 text-xs"
                  >
                    overdue tasks
                  </button>,
                  <button 
                    onClick={() => setInputValue("Show tasks due today")}
                    className="ml-1 text-indigo-400 hover:text-indigo-300 text-xs"
                  >
                    due today
                  </button>,
                  <button 
                    onClick={() => setInputValue("Show all tasks")}
                    className="ml-1 text-indigo-400 hover:text-indigo-300 text-xs"
                  >
                    all tasks
                  </button>,
                  <button 
                    onClick={() => setInputValue("Show housekeeping tasks")}
                    className="ml-1 text-indigo-400 hover:text-indigo-300 text-xs"
                  >
                    housekeeping tasks
                  </button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Resizable>
    </motion.div>
  )
}
