import React, { useEffect, useState } from 'react';
import { request } from '../helpers/axios_helper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactModal from 'react-modal';
import NewReport from './NewReport';

export default function Templates() {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [creatingTemplate, setCreatingTemplate] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  

  const handleFilterDateChange = (event) => {
    setFilterDate(event.target.value);
  };

  const formatTemplateDate = (date) => {
    const templateDate = new Date(date);
    const formattedDate = templateDate.toLocaleDateString(); // Форматирование в стандартный формат даты
    return formattedDate;
  };

  const formatFilterDate = (date) => {
    const filterDate = new Date(date);
    const day = String(filterDate.getDate()).padStart(2, '0');
    const month = String(filterDate.getMonth() + 1).padStart(2, '0');
    const year = filterDate.getFullYear();
    return `${day}.${month}.${year}`; // Форматирование в 'день.месяц.год'
  };

  const filteredTemplates = templates.filter((template) => {
    if (filterDate === '') {
      return true; // Вернуть все шаблоны, если фильтр по дате не задан
    }
    // Преобразовать дату шаблона и значения фильтра в соответствующий формат
    const templateDate = formatTemplateDate(template.date);
    const formattedFilterDate = formatFilterDate(filterDate);
    return templateDate === formattedFilterDate;
  });

  useEffect(() => {
    fetchServices();
    fetchTemplates();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await request('get', '/services');
      setServices(response.data);
    } catch (error) {
      toast.error('Не удалось получить список услуг.');
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await request('get', '/template');
      setTemplates(response.data.reverse());
    } catch (error) {
      toast.error('Не удалось получить список шаблонов.');
    }
  };

  const handleServiceSelection = (event, service) => {
    if (event.target.checked) {
      setSelectedServices([...selectedServices, service]);
    } else {
      setSelectedServices(selectedServices.filter((id) => id !== service));
    }
  };

  const handleSelectAllServices = () => {
    const allServiceIds = services.map((service) => service);
    setSelectedServices(allServiceIds);
  };

  const handleDeselectAllServices = () => {
    setSelectedServices([]);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastTemplate = currentPage * itemsPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - itemsPerPage;
  const currentTemplates = filteredTemplates.slice(indexOfFirstTemplate, indexOfLastTemplate);

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const createTemplate = async () => {
    try {
      if (templateName.length > 0 && selectedServices.length >0)
      {
      setCreatingTemplate(true);
      const response = await request('post', '/template', { name: templateName });
      const template = response.data;

      for (const service of selectedServices) {
        const templateData = {
          template,
          service,
        };

        await request('post', '/template/data/create', templateData);
      }

      toast.success('Шаблон успешно создан.');
      fetchTemplates();
      setCreatingTemplate(false);
      setTemplateName('');
      setSelectedServices([]);
    }
    else {
      toast.error('Шаблон должен иметь название, а также необходимо выбрать хотя бы одну услугу для создания шаблона');
    }
    } catch (error) {
      toast.error('Не удалось создать шаблон.');
      setCreatingTemplate(false);
    }
  };

  const handleCreateReport = (template) => {
    setSelectedTemplate(template);
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setSelectedTemplate(null);
    setIsReportModalOpen(false);
  };
  const getTotalPages = () => Math.ceil(filteredTemplates.length / itemsPerPage);


  return (
    <>
      <div className="mx-auto p-4">
      <div className="p-2 shadow-lg border">
        <h2 className="text-xl font-bold mb-4">Создание шаблона</h2>
        <form>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Введите название шаблона"
            className="w-full border border-gray-300 focus:outline-none focus:border-sky-500 rounded-md px-4 py-2 mb-2"
            required
          />
          <h2 className="text-md font-bold mb-4">Услуги</h2>
          <div className="space-y-2 mb-4 max-w-7xl max-h-96 overflow-y-auto">
            <div className="flex items-center">
              <button
                type="button"
                onClick={handleSelectAllServices}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none mr-2"
              >
                Выбрать все
              </button>
              <button
                type="button"
                onClick={handleDeselectAllServices}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none"
              >
                Снять выбор
              </button>
            </div>
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`flex items-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-200'}`}
              >
                <input
                  type="checkbox"
                  value={service}
                  checked={selectedServices.includes(service)}
                  onChange={(event) => handleServiceSelection(event, service)}
                  className="form-checkbox mr-2"
                />
                <label className="text-gray-700">{`${index + 1}. ${service.name}`}</label>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={createTemplate}
            disabled={creatingTemplate}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            {creatingTemplate ? 'Создание...' : 'Создать шаблон'}
          </button>
        </form>
      </div>
      <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Список шаблонов</h2>
          <div className="flex items-center">
            <input
              type="date"
              value={filterDate}
              onChange={handleFilterDateChange}
              className="border border-gray-300 focus:outline-none focus:border-sky-500 rounded-md px-4 py-2 mb-2"
              placeholder="Фильтр по дате"
            />
          </div>
          <div className="space-y-4">
            {currentTemplates.map((template, index) => (
              <div
                key={template.id}
                className="bg-gray-100 shadow-lg rounded p-4 flex items-center justify-between"
              >
                <div className="flex">
                  <div className="w-32">{formatTemplateDate(template.date)}</div>
                  <div className="ml-4 font-semibold">{template.name}</div>
                </div>
                <button
                  onClick={() => handleCreateReport(template)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none"
                >
                  Создать отчет
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center mt-4 px-4 py-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === 1 ? "bg-gray-200" : "bg-sky-200 text-blue-600"
          } mr-2`}
        >
          ❮
        </button>
        <span className="font-semibold text-blue-600">
          {currentPage}/{getTotalPages()}
        </span>
        <button
          disabled={currentTemplates.length < itemsPerPage}
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`px-4 py-2 rounded-lg border ${
            currentTemplates.length < itemsPerPage ? "bg-gray-200" : "bg-sky-200 text-blue-600"
          } ml-2`}
        >
          ❯
        </button>
      </div>
        </div>
      </div>
      <ReactModal
        isOpen={isReportModalOpen}
        onRequestClose={closeReportModal}
        contentLabel="Создание отчета"
        className="Modal"
        overlayClassName="Overlay"
      >
        <NewReport template={selectedTemplate} closeModal={closeReportModal}/>
      </ReactModal>
    </>
  );
}
