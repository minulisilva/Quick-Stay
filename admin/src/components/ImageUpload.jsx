import { useState, useEffect } from 'react';
import { Upload, X, Loader2, CheckCircle2 } from 'lucide-react';

const ImageUpload = ({ label, onUploadSuccess, currentImage, folder = 'uploads' }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage || '');
    const [error, setError] = useState('');
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        setPreview(currentImage || '');
    }, [currentImage]);

    const processFile = async (file) => {
        if (!file) {
            console.log('No file received in processFile');
            return;
        }

        console.log('Processing file:', file.name, file.type, file.size);

        // Basic validation
        const isValidType = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'].includes(file.type);
        if (!isValidType) {
            setError('Please upload a valid image (JPG, PNG, WEBP, GIF) or video (MP4, WEBM).');
            console.warn('Invalid file type:', file.type);
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            setError('File size must be less than 10MB.');
            console.warn('File too large:', file.size);
            return;
        }

        setError('');
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log('Starting upload to http://localhost:3000/api/upload...');
            const response = await fetch('http://localhost:3000/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Upload failed with status ' + response.status);
            }

            const data = await response.json();
            console.log('Upload successful! URL:', data.url);
            setPreview(data.url);
            onUploadSuccess(data.url);
        } catch (err) {
            console.error('Upload error detail:', err);
            setError('Upload failed: ' + (err.message || 'Please check your connection or server status.'));
        } finally {
            setUploading(false);
            setDragging(false);
            console.log('Upload process finished.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        processFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        console.log('File dropped:', file?.name);
        processFile(file);
    };

    const clearPreview = () => {
        setPreview('');
        onUploadSuccess('');
    };

    const isVideo = (url) => url && (url.endsWith('.mp4') || url.endsWith('.webm'));

    return (
        <div className="space-y-2">
            {label && <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>}

            <div className="relative group">
                {preview ? (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 h-32 w-full">
                        {isVideo(preview) ? (
                            <video src={preview} className="w-full h-full object-cover" controls />
                        ) : (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        )}
                        <button
                            type="button"
                            onClick={clearPreview}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                            <X size={14} />
                        </button>
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded shadow-sm">
                            <CheckCircle2 size={10} /> Uploaded
                        </div>
                    </div>
                ) : (
                    <label
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors 
                            ${uploading ? 'bg-gray-50 border-gray-300' :
                                dragging ? 'bg-blue-50 border-[#696cff]' :
                                    'bg-white border-gray-300 hover:border-[#696cff] hover:bg-blue-50/30'}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploading ? (
                                <>
                                    <Loader2 className="w-8 h-8 mb-3 text-[#696cff] animate-spin" />
                                    <p className="text-sm text-gray-500 font-medium tracking-tight">Uploading file...</p>
                                </>
                            ) : (
                                <>
                                    <Upload className={`w-8 h-8 mb-3 ${dragging ? 'text-[#696cff]' : 'text-gray-400'}`} />
                                    <p className="text-sm text-gray-400 font-medium">{dragging ? 'Drop to upload' : 'Click or drag to upload'}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Images or Videos (Max 10MB)</p>
                                </>
                            )}
                        </div>
                        <input type="file" className="hidden" onChange={handleFileChange} disabled={uploading} accept="image/*,video/*" />
                    </label>
                )}
            </div>

            {error && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tight">{error}</p>}
        </div>
    );
};

export default ImageUpload;
