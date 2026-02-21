import React from 'react';

interface ExamScheduleFormProps {
    value: { date: string; time: string } | null;
    onChange: (field: string, value: any) => void;
}

const publicHolidays = [
    '2025-01-15',
    '2025-01-16',
    '2025-01-26',
    '2025-02-26',
    '2025-03-14',
    '2025-03-30',
    '2025-03-31',
    '2025-04-05',
    '2025-04-06',
    '2025-04-14',
    '2025-04-18',
    '2025-05-12',
    '2025-06-07',
    '2025-07-06',
    '2025-08-15',
    '2025-08-16',
    '2025-08-27',
    '2025-09-05',
    '2025-09-30',
    '2025-10-02',
    '2025-10-20',
    '2025-11-05',
    '2025-12-25',
];

const timeSlots = [
    { label: '11:00 AM - 1:00 PM', value: '11:00' },
    { label: '02:00 PM - 04:00 PM', value: '14:00' },
];

function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export const ExamScheduleForm: React.FC<ExamScheduleFormProps> = ({ value, onChange }) => {
    const minDate = addDays(new Date(), 2).toISOString().split('T')[0];

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value;
        if (publicHolidays.includes(selectedDate)) {
            alert('Selected date is a public holiday. Please choose another date.');
            return;
        }
        onChange("examSchedule", { date: selectedDate, time: value?.time ?? '' });
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange("examSchedule", { date: value?.date ?? '', time: e.target.value });
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-2">Select Exam Date & Time</h2>
            <input
                type="date"
                className="block w-full p-2 border rounded-lg"
                value={value?.date ?? ''}
                min={minDate}
                onChange={handleDateChange}
            />
            <select
                className="block w-full p-2 border rounded-lg"
                value={value?.time ?? ''}
                onChange={handleTimeChange}
            >
                <option value="" disabled>
                    Select a time slot
                </option>
                {timeSlots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                        {slot.label}
                    </option>
                ))}
            </select>
            <p className="text-sm text-gray-500">
                * Public holidays are not allowed. Exam date must be at least 2 days from today.
            </p>
        </div>
    );
};
