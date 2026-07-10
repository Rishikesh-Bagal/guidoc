import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { scannerService } from '../services/scannerService';
import Tesseract from 'tesseract.js';
import jsPDF from 'jspdf';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { 
  UploadCloud, 
  FileText, 
  Download, 
  Copy, 
  Save, 
  Check, 
  Loader2, 
  X,
  Image as ImageIcon
} from 'lucide-react';
import './ScannerPage.css';

// Set up PDF.js worker
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${getDocument.version}/pdf.worker.min.mjs`;

export default function ScannerPage() {
  const { currentUser } = useAuth();
  
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [extractedRawText, setExtractedRawText] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    address: '',
    documentNumber: '',
    issueDate: '',
    expiryDate: ''
  });
  
  const [documentType, setDocumentType] = useState('Aadhaar Card');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile) => {
    setFile(selectedFile);
    resetState();
    
    // Create preview
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      runOCR(url);
    } else if (selectedFile.type === 'application/pdf') {
      try {
        setIsProcessing(true);
        setOcrProgress(5); // Initial progress for PDF conversion
        const imageUrl = await convertPdfToImage(selectedFile);
        setPreviewUrl(imageUrl);
        runOCR(imageUrl);
      } catch (error) {
        console.error('Error processing PDF:', error);
        alert('Failed to process PDF file. Please try an image instead.');
        setIsProcessing(false);
      }
    } else {
      alert('Unsupported file type. Please upload PDF, JPG, or PNG.');
    }
  };

  const convertPdfToImage = async (pdfFile) => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1); // Only process first page for simplicity
    
    const scale = 2; // Higher scale for better OCR
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    
    await page.render(renderContext).promise;
    return canvas.toDataURL('image/png');
  };

  const runOCR = async (imageUrl) => {
    setIsProcessing(true);
    try {
      const result = await Tesseract.recognize(
        imageUrl,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          }
        }
      );
      
      const text = result.data.text;
      setExtractedRawText(text);
      parseExtractedText(text);
    } catch (error) {
      console.error('OCR Error:', error);
      alert('Failed to extract text from the document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const parseExtractedText = (text) => {
    // This is a simplified regex parsing for demonstration.
    // In a real-world scenario, you might use a more robust AI model or complex regex.
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    const newFormData = { ...formData };
    
    // Naive heuristic parsing
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('dob') || lowerLine.includes('date of birth') || lowerLine.includes('year of birth')) {
        const match = line.match(/\d{2}[/-]\d{2}[/-]\d{4}/) || line.match(/\d{4}/);
        if (match) newFormData.dob = match[0];
      }
      
      if (lowerLine.match(/\b(male|female|transgender)\b/)) {
        const match = lowerLine.match(/\b(male|female|transgender)\b/);
        if (match) newFormData.gender = match[0].charAt(0).toUpperCase() + match[0].slice(1);
      }
      
      if (lowerLine.includes('name') && !lowerLine.includes('father')) {
        const parts = line.split(/name[:\s]+/i);
        if (parts.length > 1) newFormData.name = parts[1].trim();
      }
      
      // Look for typical document numbers (e.g. 12 digits for Aadhaar, alphanumeric for PAN)
      if (line.match(/^\d{4}\s\d{4}\s\d{4}$/) || line.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
        newFormData.documentNumber = line;
      }
    });

    setFormData(newFormData);
  };

  const resetState = () => {
    setExtractedRawText('');
    setOcrProgress(0);
    setFormData({
      name: '',
      dob: '',
      gender: '',
      address: '',
      documentNumber: '',
      issueDate: '',
      expiryDate: ''
    });
    setSaveSuccess(false);
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    resetState();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      await scannerService.saveScan(
        currentUser.uid,
        documentType,
        formData,
        file?.name || 'unknown'
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert('Failed to save document data.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = `
Document Type: ${documentType}
Name: ${formData.name}
DOB: ${formData.dob}
Gender: ${formData.gender}
Document Number: ${formData.documentNumber}
Address: ${formData.address}
Issue Date: ${formData.issueDate}
Expiry Date: ${formData.expiryDate}
    `.trim();
    
    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Extracted Document Data', 20, 20);
    
    doc.setFontSize(12);
    let y = 40;
    const addLine = (label, value) => {
      doc.text(`${label}: ${value || 'N/A'}`, 20, y);
      y += 10;
    };
    
    addLine('Document Type', documentType);
    addLine('Name', formData.name);
    addLine('DOB', formData.dob);
    addLine('Gender', formData.gender);
    addLine('Document Number', formData.documentNumber);
    addLine('Address', formData.address);
    addLine('Issue Date', formData.issueDate);
    addLine('Expiry Date', formData.expiryDate);
    
    doc.save(`${documentType.replace(/\s+/g, '_')}_extracted.pdf`);
  };

  return (
    <div className="scanner-page">
      <div className="scanner-header">
        <h1>AI Document Scanner</h1>
        <p>Upload a government ID to automatically extract its details.</p>
      </div>

      {!file ? (
        <div 
          className={`upload-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg, image/png, application/pdf"
            hidden
          />
          <UploadCloud className="upload-icon" size={48} />
          <h3>Drag & Drop your document here</h3>
          <p>or click to browse</p>
          <span className="upload-hint">Supports PDF, JPG, PNG</span>
        </div>
      ) : (
        <div className="scanner-workspace">
          {/* Document Preview Panel */}
          <div className="panel preview-panel">
            <div className="panel-header">
              <h3>Document Preview</h3>
              <button className="icon-btn" onClick={clearFile} title="Clear Document">
                <X size={20} />
              </button>
            </div>
            
            <div className="preview-container">
              {previewUrl ? (
                <img src={previewUrl} alt="Document Preview" className="document-image" />
              ) : (
                <div className="preview-placeholder">
                  <ImageIcon size={48} />
                  <span>Loading preview...</span>
                </div>
              )}
              
              {isProcessing && (
                <div className="processing-overlay">
                  <Loader2 className="spin-icon" size={40} />
                  <p>Extracting text... {ocrProgress}%</p>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${ocrProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Extracted Data Panel */}
          <div className="panel data-panel">
            <div className="panel-header">
              <h3>Extracted Information</h3>
              <select 
                value={documentType} 
                onChange={(e) => setDocumentType(e.target.value)}
                className="doc-type-select"
              >
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="Income Certificate">Income Certificate</option>
              </select>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Extracted Name" />
              </div>
              
              <div className="form-group">
                <label>Document Number</label>
                <input type="text" name="documentNumber" value={formData.documentNumber} onChange={handleInputChange} placeholder="e.g. 1234 5678 9012" />
              </div>
              
              <div className="form-group half">
                <label>Date of Birth</label>
                <input type="text" name="dob" value={formData.dob} onChange={handleInputChange} placeholder="DD/MM/YYYY" />
              </div>
              
              <div className="form-group half">
                <label>Gender</label>
                <input type="text" name="gender" value={formData.gender} onChange={handleInputChange} placeholder="Male / Female" />
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" placeholder="Extracted Address" />
              </div>
              
              <div className="form-group half">
                <label>Issue Date</label>
                <input type="text" name="issueDate" value={formData.issueDate} onChange={handleInputChange} placeholder="DD/MM/YYYY" />
              </div>
              
              <div className="form-group half">
                <label>Expiry Date</label>
                <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} placeholder="DD/MM/YYYY" />
              </div>
            </div>
            
            <div className="action-buttons">
              <button 
                className={`action-btn ${saveSuccess ? 'success' : 'primary'}`} 
                onClick={handleSave}
                disabled={isProcessing || isSaving}
              >
                {isSaving ? <Loader2 className="spin-icon" size={18} /> : (saveSuccess ? <Check size={18} /> : <Save size={18} />)}
                <span>{saveSuccess ? 'Saved' : 'Save to Cloud'}</span>
              </button>
              
              <button className="action-btn secondary" onClick={handleCopy} disabled={isProcessing}>
                {copySuccess ? <Check size={18} /> : <Copy size={18} />}
                <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
              </button>
              
              <button className="action-btn secondary" onClick={handleDownloadPDF} disabled={isProcessing}>
                <Download size={18} />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
