import React, { useEffect, useState } from 'react';
import { request } from '../helpers/axios_helper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Templates() {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [creatingTemplate, setCreatingTemplate] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await request('get', '/services');
      setServices(response.data);
    } catch (error) {
      toast.error('Не удалось получить список услуг.');
    }
  };

  const handleServiceSelection = (event, service) => {
    if (event.target.checked) {
      setSelectedServices([...selectedServices, service]);
    } else {
      setSelectedServices(selectedServices.filter(id => id !== service));
    }
  };

  const createTemplate = async () => {
    try {
      setCreatingTemplate(true);
      const response = await request('post', '/template');
      const template = response.data;

      const templateData = selectedServices.map(service => ({
        template,
        service,
      }));

      // Отправляем данные шаблона на сервер
      await request('post', '/template_data', templateData);

      toast.success('Шаблон успешно создан.');
      setCreatingTemplate(false);
    } catch (error) {
      toast.error('Не удалось создать шаблон.');
      setCreatingTemplate(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Шаблоны</h1>
      <form>
        <div className="space-y-2 mb-4">
          {services.map(service => (
            <div key={service.id} className="flex items-center">
              <input
                type="checkbox"
                value={service}
                checked={selectedServices.includes(service)}
                onChange={event => handleServiceSelection(event, service)}
                className="form-checkbox mr-2"
              />
              <label className="text-gray-700">{service.name}</label>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={createTemplate}
          disabled={creatingTemplate}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-noneЫ"
        >
          {creatingTemplate ? 'Создание...' : 'Создать шаблон'}
        </button>
      </form>
    </>
  );
}

