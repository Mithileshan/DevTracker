import { useParams, useNavigate } from 'react-router-dom';

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Ticket details for: {ticketId}</p>
          {/* Ticket details will be implemented here */}
        </div>
      </div>
    </div>
  );
}
