'use client';

import React, { useState } from 'react';
import { X, Save, UploadCloud } from 'lucide-react';
import RichEditor from '../RichEditor';
import SingleImageUpload from '../uploads/SingleImageUpload';
import MultipleImageUpload from '../uploads/MultipleImageUpload';
import { TABLE_SCHEMAS } from '../../schemas';
import { uploadFile } from '../../config/database';

// Fonction utilitaire pour comparer les objets
const deepEqual = (obj1: any, obj2: any): boolean => JSON.stringify(obj1) === JSON.stringify(obj2);

interface FormModalProps {
  table: string;
  item: Record<string, any> | null;
  onClose: () => void;
  onSave: (data: Record<string, any>) => Promise<void>;
}

/**
 * Modal dynamique contenant le formulaire d'édition/création
 */
export default function FormModal({ table, item, onClose, onSave }: FormModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>(item || {});
  const [originalData] = useState<Record<string, any>>(item || {});
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = !deepEqual(formData, originalData);
  const schema = TABLE_SCHEMAS[table] || [];
  const isProfileTable = table === 'profiles';

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadFile(file);
        handleChange(key, url);
      } catch (err) {
        alert("Erreur d'upload du document");
      }
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isDirty) return onClose();
    
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la sauvegarde dans la base de données');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-2xl font-bold text-gray-800">
            {item ? 'Modifier' : 'Ajouter'} {table}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="space-y-6">
            {schema.map((field) => {
              const { key, label, type, options } = field;
              
              switch (type) {
                case 'text':
                case 'email':
                case 'number':
                case 'date':
                case 'datetime-local':
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input
                        type={type}
                        disabled={isProfileTable && key === 'email'}
                        value={formData[key] || ''}
                        onChange={(e) => handleChange(key, type === 'number' ? Number(e.target.value) : e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow disabled:bg-gray-100"
                        placeholder={`Saisir ${label.toLowerCase()}...`}
                      />
                    </div>
                  );
                case 'file_url':
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={formData[key] || ''}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition-shadow"
                          placeholder="URL du document ou uploader..."
                        />
                        <label className="bg-gray-100 p-3 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-200">
                          <UploadCloud size={20} className="text-gray-600" />
                          <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, key)} />
                        </label>
                      </div>
                    </div>
                  );
                case 'select':
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <select
                        value={formData[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition-shadow"
                      >
                        <option value="">Sélectionner...</option>
                        {options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  );
                case 'textarea':
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <textarea
                        rows={4}
                        value={formData[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition-shadow"
                      />
                    </div>
                  );
                case 'rich_text':
                  return (
                    <div key={key} className="col-span-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                      <RichEditor
                        content={formData[key] || ''}
                        setContent={(val) => handleChange(key, val)}
                      />
                    </div>
                  );
                case 'single_image':
                  return (
                    <SingleImageUpload
                      key={key}
                      label={label}
                      url={formData[key]}
                      onUpload={(url) => handleChange(key, url)}
                      onRemove={() => handleChange(key, '')}
                    />
                  );
                case 'multiple_images':
                  return (
                    <MultipleImageUpload
                      key={key}
                      label={label}
                      urls={formData[key] || []}
                      onUpload={(newUrls) => handleChange(key, [...(formData[key] || []), ...newUrls])}
                      onRemove={(index) => {
                        const newArray = [...(formData[key] || [])];
                        newArray.splice(index, 1);
                        handleChange(key, newArray);
                      }}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          {!isDirty ? (
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Fermer
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70"
              >
                {isSaving ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Save size={18} />
                )}
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
