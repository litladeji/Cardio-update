import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  User,
  Bot,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { config } from '../../utils/config';
import { getMockMessages, sendMockMessage } from '../../utils/mockData';

interface Message {
  id: string;
  sender: 'patient' | 'care-team' | 'system';
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface PatientMessagingProps {
  patientId: string;
  patientName: string;
}

export function PatientMessaging({ patientId, patientName }: PatientMessagingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchMessages();
    
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    
    // Listen for new mock messages
    const handleNewMessage = (event: CustomEvent) => {
      if (event.detail.patientId === patientId) {
        fetchMessages();
      }
    };
    
    window.addEventListener('newMockMessage', handleNewMessage as EventListener);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('newMockMessage', handleNewMessage as EventListener);
    };
  }, [patientId]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const fetchMessages = async () => {
    try {
      // Use mock data in demo mode
      if (config.useMockData) {
        const mockMessages = getMockMessages(patientId);
        setMessages(mockMessages);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/messages/${patientId}`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    setSending(true);
    try {
      // Use mock data in demo mode
      if (config.useMockData) {
        const sentMessage = sendMockMessage(patientId, newMessage, patientName);
        setNewMessage('');
        // Immediately fetch to show the sent message
        fetchMessages();
        toast.success('Message sent to care team');
        
        // Show typing indicator
        setIsTyping(true);
        // Auto-response will arrive via the event listener (see useEffect)
        // Hide typing indicator after auto-response arrives (1 second buffer)
        setTimeout(() => setIsTyping(false), 2000);
      } else {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/messages/${patientId}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              content: newMessage,
              sender: 'patient',
              senderName: patientName
            })
          }
        );
        
        if (response.ok) {
          setNewMessage('');
          fetchMessages();
          toast.success('Message sent to care team');
        } else {
          throw new Error('Failed to send message');
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };
  
  const handleCallCareTeam = () => {
    toast.info('Calling CardioGuard Care Team: 1-800-CARDIO-1');
  };
  
  const quickReplies = [
    "I'm feeling good today! 😊",
    "I have a question about my medication",
    "I need to schedule an appointment",
    "I'm experiencing some chest discomfort",
    "I'm feeling anxious about my recovery",
    "Can I exercise today?"
  ];
  
  const handleQuickReply = (reply: string) => {
    setNewMessage(reply);
  };
  
  return (
    <Card className="border-0 shadow-xl bg-white flex flex-col h-[calc(100vh-20rem)] min-h-[500px]">
      <CardHeader className="border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="relative">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <Sparkles className="w-3 h-3 text-indigo-500 absolute -top-1 -right-1" />
              </div>
              AI-Powered Care Team Chat
            </CardTitle>
            <p className="text-xs text-gray-500 mt-1">Intelligent responses • 24/7 support • Instant help</p>
          </div>
          <Button
            onClick={handleCallCareTeam}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Phone className="w-4 h-4" />
            Call Care Team
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No messages yet</p>
              <p className="text-sm mt-1">Send a message to your care team</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.sender === 'patient'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : message.sender === 'system'
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 border border-blue-100'
                      : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900'
                  } rounded-2xl p-4 shadow-md`}
                >
                  {/* Sender Info */}
                  <div className="flex items-center gap-2 mb-2">
                    {message.sender === 'patient' ? (
                      <User className="w-4 h-4" />
                    ) : message.sender === 'system' ? (
                      <Bot className="w-4 h-4 text-blue-600" />
                    ) : (
                      <div className="p-1 bg-purple-600 rounded-full">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className={`text-xs ${
                      message.sender === 'patient' 
                        ? 'text-blue-100' 
                        : message.sender === 'system'
                        ? 'text-blue-700'
                        : 'text-gray-600'
                    }`}>
                      {message.senderName}
                    </span>
                  </div>
                  
                  {/* Message Content */}
                  <p className="text-sm mb-2">{message.content}</p>
                  
                  {/* Timestamp */}
                  <div className="flex items-center justify-end gap-1 text-xs opacity-75">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}</span>
                    {message.sender === 'patient' && message.read && (
                      <CheckCircle2 className="w-3 h-3 ml-1" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 rounded-2xl p-4 shadow-md border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-700">CardioGuard AI Assistant</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick Replies */}
        <div className="px-4 py-2 border-t bg-gray-50 flex-shrink-0">
          <p className="text-xs text-gray-600 mb-2">Quick replies:</p>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, idx) => (
              <Button
                key={idx}
                onClick={() => handleQuickReply(reply)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t bg-white flex-shrink-0">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={sending || !newMessage.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {sending ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            💡 <strong>AI-Powered:</strong> Get instant, intelligent responses 24/7 • Critical issues are automatically escalated to your care team
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
