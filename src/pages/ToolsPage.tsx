import { useState } from 'react';
import { QrCode } from '@phosphor-icons/react';
import { adminToolsApi } from '@/api/admin/tools/client';

function ToolsPage() {
  const [mode, setMode] = useState<'qrcode' | 'barcode'>('qrcode');
  const [value, setValue] = useState('');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(80);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');
    if (!value.trim()) {
      return setError('Please enter a value to encode.');
    }

    setLoading(true);
    try {
      const payload = {
        value: value.trim(),
        width: Number(width) || 2,
        height: Number(height) || 80,
      };

      const response =
        mode === 'qrcode'
          ? await adminToolsApi.generateQrCode(payload)
          : await adminToolsApi.generateBarcode(payload);

      setImageUrl(response.dataUrl);
    } catch (err) {
      setError('Unable to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Tools</h1>
          <p className="mt-2 text-sm text-slate-600">
            Generate QR codes or barcode images from any value. When scanned, the generated code will return the entered text.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
          <QrCode size={20} className="text-slate-500" />
          Quick code generation
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-800">Code type</label>
            <div className="flex flex-wrap gap-2">
              {['qrcode', 'barcode'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMode(option as 'qrcode' | 'barcode')}
                  className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                    mode === option
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {option === 'qrcode' ? 'QR Code' : 'Barcode'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-800">Value</label>
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Enter the text or URL to encode"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-800">Width</label>
              <input
                type="number"
                value={width}
                onChange={(event) => setWidth(Number(event.target.value))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                min={1}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-800">Height</label>
              <input
                type="number"
                value={height}
                onChange={(event) => setHeight(Number(event.target.value))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                min={10}
              />
            </div>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Generating…' : `Generate ${mode === 'qrcode' ? 'QR Code' : 'Barcode'}`}
          </button>
          <p className="text-sm text-slate-500">The value you enter is the scanned payload.</p>
        </div>
      </div>

      {imageUrl && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Generated Output</h2>
              <p className="mt-1 text-sm text-slate-500">Scan this code to confirm the encoded value.</p>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <img
              src={imageUrl}
              alt="Generated QR or barcode"
              className="max-h-[320px] max-w-full rounded-3xl border border-slate-200 bg-white p-4"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolsPage;
