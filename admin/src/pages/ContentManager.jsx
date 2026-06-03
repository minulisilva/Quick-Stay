import { useState, useEffect } from 'react';
import { Save, RefreshCw, Layout, Smartphone, Monitor, Info, CheckCircle2, AlertCircle, XCircle, Trash2 } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

const ContentManager = () => {
    const [pages, setPages] = useState(['global', 'home', 'about', 'dining', 'experiences', 'gallery', 'contact', 'offers', 'careers', 'awards']);
    const [selectedPage, setSelectedPage] = useState('home');
    const [sections, setSections] = useState([]);
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchContent();
    }, [selectedPage]);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/content/${selectedPage}`);
            const data = await response.json();
            setContent(data);
            setSections(Object.keys(data));
        } catch (error) {
            console.error('Error fetching content:', error);
            setMessage({ type: 'error', text: 'Failed to load content' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateFieldByPath = (section, path, value) => {
        setContent(prev => {
            // Truly immutable deep update
            const newContent = JSON.parse(JSON.stringify(prev)); // Deep clone to avoid any shared references
            const parts = path.split('.');
            let current = newContent[section];

            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (part.includes('[')) {
                    const matches = part.match(/(.*)\[(\d+)\]/);
                    const name = matches[1];
                    const index = parseInt(matches[2]);
                    current = current[name][index];
                } else {
                    current = current[part];
                }
            }

            const finalPart = parts[parts.length - 1];
            if (finalPart.includes('[')) {
                const matches = finalPart.match(/(.*)\[(\d+)\]/);
                const name = matches[1];
                const index = parseInt(matches[2]);
                current[name][index] = value;
            } else {
                current[finalPart] = value;
            }

            return newContent;
        });
    };

    const handleUpdateArrayField = (section, path, index, value) => {
        handleUpdateFieldByPath(section, `${path}[${index}]`, value);
    };

    const handleDeleteSection = async (section) => {
        if (!window.confirm(`Are you sure you want to delete the "${section}" section? This action cannot be undone.`)) {
            return;
        }
        
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const response = await fetch(`http://localhost:3000/content/${selectedPage}/${section}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Remove section from local state
                setContent(prev => {
                    const newContent = { ...prev };
                    delete newContent[section];
                    return newContent;
                });
                setSections(sections.filter(s => s !== section));
                setMessage({ type: 'success', text: `Section "${section}" deleted successfully!` });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting section:', error);
            setMessage({ type: 'error', text: `Error: ${error.message}` });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleSaveSection = async (section) => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const response = await fetch('http://localhost:3000/content', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    page: selectedPage,
                    section: section,
                    data: content[section]
                })
            });

            if (response.ok) {
                setMessage({ type: 'success', text: `Section "${section}" updated successfully!` });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save');
            }
        } catch (error) {
            console.error('Error saving content:', error);
            setMessage({ type: 'error', text: `Error: ${error.message}` });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const isMediaField = (key, value) => {
        const lowerKey = key.toLowerCase();
        // Refined detection: must be a string and either have media keywords in key OR look like a URL/Path
        if (typeof value !== 'string') return false;

        const hasMediaKeyword = lowerKey.includes('image') || lowerKey.includes('img') || lowerKey.includes('banner') || lowerKey.includes('logo') || lowerKey.includes('avatar');
        const looksLikeUrl = /^(https?:\/\/|\/|data:image\/)/i.test(value);

        // If it's a very long text, it's likely not just a URL unless it's a data URI
        if (value.length > 500 && !value.startsWith('data:image/')) return false;

        return hasMediaKeyword || looksLikeUrl;
    };

    const renderField = (section, key, value, parentKey = '') => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        // Handle Arrays (like features, or lists of objects)
        if (Array.isArray(value)) {
            return (
                <div key={fullKey} className="space-y-4 p-4 bg-white/50 rounded-xl border border-gray-100 mb-4">
                    <label className="text-xs font-bold text-[#696cff] uppercase tracking-wider block">{key.replace(/([A-Z])/g, ' $1')}</label>
                    {value.map((item, index) => (
                        <div key={index} className="pl-4 border-l-2 border-gray-100">
                            {typeof item === 'object' ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {Object.entries(item).map(([subKey, subValue]) => renderField(section, subKey, subValue, `${fullKey}[${index}]`))}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <ImageUpload
                                        currentImage={item}
                                        onUploadSuccess={(url) => {
                                            const newArr = [...value];
                                            newArr[index] = url;
                                            handleUpdateFieldByPath(section, fullKey, newArr);
                                        }}
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => {
                                                handleUpdateArrayField(section, fullKey, index, e.target.value);
                                            }}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#696cff] outline-none transition-all"
                                            placeholder="Or paste URL here..."
                                        />
                                        <button
                                            onClick={() => {
                                                const newArr = value.filter((_, i) => i !== index);
                                                handleUpdateFieldByPath(section, fullKey, newArr);
                                            }}
                                            className="p-2 text-red-400 hover:text-red-600"
                                        >
                                            <XCircle size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            const newItem = typeof value[0] === 'object' ?
                                Object.fromEntries(Object.keys(value[0]).map(k => [k, ''])) : '';
                            handleUpdateFieldByPath(section, fullKey, [...value, newItem]);
                        }}
                        className="text-xs font-bold text-[#696cff] hover:text-[#5f62e6] flex items-center gap-1"
                    >
                        + Add Item
                    </button>
                </div>
            );
        }

        // Handle Objects (nested)
        if (value !== null && typeof value === 'object') {
            return (
                <div key={fullKey} className="space-y-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block border-b border-gray-100 pb-2">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <div className="grid grid-cols-1 gap-4">
                        {Object.entries(value).map(([subKey, subValue]) => renderField(section, subKey, subValue, fullKey))}
                    </div>
                </div>
            );
        }

        // Handle Simple Fields
        const isLongText = typeof value === 'string' && value.length > 50;
        const isUrlField = typeof value === 'string' && (
            key.toLowerCase().includes('image') ||
            key.toLowerCase().includes('img') ||
            key.toLowerCase().includes('video') ||
            key.toLowerCase().includes('url') ||
            key.toLowerCase().includes('bg') ||
            key.toLowerCase().includes('poster') ||
            value.startsWith('http') ||
            value.includes('images.unsplash.com')
        );

        return (
            <div key={fullKey} className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{key.replace(/([A-Z])/g, ' $1')}</label>
                {isLongText && !isUrlField ? (
                    <textarea
                        value={value}
                        onChange={(e) => handleUpdateFieldByPath(section, fullKey, e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#696cff] outline-none transition-all resize-none"
                    />
                ) : isUrlField ? (
                    <div className="space-y-2">
                        <ImageUpload
                            currentImage={value}
                            onUploadSuccess={(url) => handleUpdateFieldByPath(section, fullKey, url)}
                        />
                        <div className="relative">
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => handleUpdateFieldByPath(section, fullKey, e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#696cff] outline-none transition-all pr-10"
                                placeholder="Or paste URL here..."
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group">
                                <Info size={16} />
                                <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    Media field detected. You can upload or paste a URL.
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleUpdateFieldByPath(section, fullKey, e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#696cff] outline-none transition-all"
                    />
                )}
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Website Content Manager</h1>
                    <p className="text-gray-500 mt-1">Manage static text, images, and videos across your hotel website.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                        {pages.map(page => (
                            <button
                                key={page}
                                onClick={() => setSelectedPage(page)}
                                className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${selectedPage === page ? 'bg-[#696cff] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                {page.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <button onClick={fetchContent} className="p-2.5 bg-white text-gray-500 rounded-lg border border-gray-200 hover:bg-gray-50 shadow-sm transition-all">
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Notification Toast */}
            {message.text && (
                <div className={`fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl z-[100] animate-in slide-in-from-right-full duration-300 ${message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <span className="font-medium">{message.text}</span>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-pulse h-[400px]"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {sections.map(section => (
                        <div key={section} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#696cff]">
                                        <Layout size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800 capitalize">{section} Section</h2>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><Monitor size={16} /></button>
                                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><Smartphone size={16} /></button>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    {Object.entries(content[section]).map(([key, value]) => renderField(section, key, value))}
                                </div>

                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <button
                                        onClick={() => handleDeleteSection(section)}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all disabled:opacity-50"
                                    >
                                        <Trash2 size={16} />
                                        Delete Section
                                    </button>
                                    <button
                                        onClick={() => handleSaveSection(section)}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-8 py-2.5 bg-[#696cff] text-white rounded-xl font-bold hover:bg-[#5f62e6] transition-all shadow-lg shadow-[#696cff]/20 disabled:opacity-50"
                                    >
                                        {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContentManager;
