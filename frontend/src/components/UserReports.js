import React, { useEffect, useState } from 'react';
import { request } from '../helpers/axios_helper';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function UserReports({userId,closeModal}) {
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Number of items per page
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserReports();
  }, []);
  const fetchUserReports = async () => {
    try {
      const response = await request('get', `/reports/inactive/user/${userId}`);
      setReports(response.data);
    } catch (error) {
        console.log(error);
      toast.error('Не удалось получить неактивные отчеты пользователя.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleViewReport = (report) => {
    navigate(`/read-report`, { state: { report } });
  };

  const getTotalPages = () => Math.ceil(reports.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentReports = reports.slice(startIndex, endIndex);

  return (
    <div className="bg-white mx-auto max-w-screen-lg p-4 rounded">
      {currentReports.map((report) => (
        <div key={report.id} className="border border-gray-300 rounded p-4 mb-4">
          <div>
            <strong>Дата начала:</strong> {formatDate(report.startDate)}
          </div>
          <div>
            <strong>Дата завершения:</strong> {formatDate(report.endDate)}
          </div>
          {report.comment !== null && (
            <div>
              <strong>Комментарий:</strong> {report.comment}
            </div>
          )}
          <button
            onClick={() => handleViewReport(report)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none mt-4"
          >
            Посмотреть
          </button>
        </div>
      ))}
      <div className="flex items-center mt-4 px-4 py-2">
        {currentPage === 1 ? (
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 rounded-lg border bg-gray-200 mr-2"
          >
            ❮
          </button>
        ) : (
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 rounded-lg border bg-sky-200 mr-2 text-blue-600"
          >
            ❮
          </button>
        )}
        <span className="font-semibold text-blue-600">
          {currentPage}/{getTotalPages()}
        </span>
        {currentPage === getTotalPages() ? (
          <button
            disabled={currentPage === getTotalPages()}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 rounded-lg border bg-gray-200 ml-2"
          >
            ❯
          </button>
        ) : (
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 rounded-lg border bg-sky-200 ml-2 text-blue-600"
          >
            ❯
          </button>
        )}
      </div>
    </div>
  );
}