import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parse, isBefore } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface TimeSelectionProps {
  doctorId: number;
  date: Date;
  onTimeSelect: (time: string) => void;
  selectedTime: string | null;
}

export default function TimeSelection({ 
  doctorId, 
  date, 
  onTimeSelect, 
  selectedTime 
}: TimeSelectionProps) {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  
  // Get doctor's appointments for this date
  const { data: appointments = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/appointments?doctorId=${doctorId}&date=${date.toISOString().split('T')[0]}`],
  });
  
  // Calculate available time slots
  useEffect(() => {
    const generateTimeSlots = () => {
      // Default working hours (9 AM - 5 PM)
      const startHour = 9;
      const endHour = 17;
      const interval = 30; // 30 minute intervals
      
      const slots: string[] = [];
      const now = new Date();
      const isToday = date.getDate() === now.getDate() && 
                       date.getMonth() === now.getMonth() && 
                       date.getFullYear() === now.getFullYear();
      
      // Generate all possible time slots
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Skip time slots in the past for today
          if (isToday) {
            const slotTime = new Date(date);
            slotTime.setHours(hour, minute);
            
            if (isBefore(slotTime, now)) {
              continue;
            }
          }
          
          slots.push(timeString);
        }
      }
      
      // Remove booked slots
      const bookedSlots = appointments.map((appointment: any) => appointment.startTime);
      const availableSlots = slots.filter(slot => !bookedSlots.includes(slot));
      
      setAvailableTimeSlots(availableSlots);
    };
    
    generateTimeSlots();
  }, [date, appointments]);
  
  if (isLoading) {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-200">Select Time</label>
        <Skeleton className="h-24 w-full bg-gray-700" />
      </div>
    );
  }
  
  if (availableTimeSlots.length === 0) {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-200">Select Time</label>
        <div className="p-4 border border-gray-600 bg-gray-700 rounded-lg text-center">
          <p className="text-gray-300">No available time slots for this date</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2 text-gray-200">Select Time</label>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {availableTimeSlots.map((time) => (
          <div 
            key={time}
            className={`time-slot border rounded-lg py-2 px-3 text-center cursor-pointer ${
              selectedTime === time 
                ? 'border-blue-600 bg-blue-900 bg-opacity-30'
                : 'border-gray-600 bg-gray-700 hover:border-blue-500'
            }`}
            onClick={() => onTimeSelect(time)}
          >
            <span className={`text-sm ${selectedTime === time ? 'text-blue-400 font-medium' : 'text-gray-200'}`}>
              {format(parse(time, 'HH:mm', new Date()), 'h:mm a')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
