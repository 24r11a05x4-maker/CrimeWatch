import React, { useState } from 'react';
import {
  Shield,
  EyeOff,
  UserCheck,
  FileText,
  Upload,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  X,
  FileCheck,
  Cpu,
  Clock,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { CrimeCategory, ReportPriority, Coordinates } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigation } from '../../context/NavigationContext';
import { useLanguage } from '../../context/LanguageContext';
import { CrimeMapComponent } from '../../components/map/CrimeMapComponent';
import { LocationSelectorPanel } from '../../components/map/LocationSelectorPanel';

interface UploadedFilePreview {
  fileName: string;
  fileType: 'image' | 'video' | 'document';
  fileSize: string;
  fileUrl: string;
}

export const ReportCrimePage: React.FC = () => {
  const { currentUser, isCitizen } = useAuth();
  const { createReport } = useData();
  const { navigateTo, setTrackRefQuery } = useNavigation();
  const { t } = useLanguage();

  // Multi-step state: 1 to 6
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedReportRef, setSubmittedReportRef] = useState<string | null>(null);
  const [aiAnalysisPreview, setAiAnalysisPreview] = useState<{
    suggestedCategory?: string;
    confidence?: number;
    reasoning?: string;
    priority?: string;
    humanReviewRecommended?: boolean;
  } | null>(null);

  // Form State
  const [isAnonymous, setIsAnonymous] = useState<boolean>(!currentUser);
  const [reporterName, setReporterName] = useState<string>(currentUser?.name || '');
  const [reporterEmail, setReporterEmail] = useState<string>(currentUser?.email || '');
  const [reporterPhone, setReporterPhone] = useState<string>(currentUser?.phone || '');

  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>(
    new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  );
  const [category, setCategory] = useState<CrimeCategory>('Theft');
  const [additionalInfo, setAdditionalInfo] = useState<string>('');

  // Evidence
  const [evidenceList, setEvidenceList] = useState<UploadedFilePreview[]>([]);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);

  // Location
  const [locationAddress, setLocationAddress] = useState<string>('Uppal, Hyderabad, Telangana');
  const [areaDistrict, setAreaDistrict] = useState<string>('Uppal');
  const [coordinates, setCoordinates] = useState<Coordinates>({ lat: 17.4018, lng: 78.5602 });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle mock file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEvidenceError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // File size check: 15MB limit
    if (file.size > 15 * 1024 * 1024) {
      setEvidenceError('File exceeds maximum allowed size of 15MB.');
      return;
    }

    let fileType: 'image' | 'video' | 'document' = 'document';
    if (file.type.startsWith('image/')) fileType = 'image';
    else if (file.type.startsWith('video/')) fileType = 'video';
    else if (
      file.type.includes('pdf') ||
      file.type.includes('doc') ||
      file.type.includes('text') ||
      file.name.endsWith('.pdf') ||
      file.name.endsWith('.txt')
    ) {
      fileType = 'document';
    } else {
      setEvidenceError('Unsupported file type. Please upload images (PNG, JPG), video (MP4), or documents (PDF).');
      return;
    }

    const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const fakeUrl = URL.createObjectURL(file);

    setEvidenceList((prev) => [
      ...prev,
      {
        fileName: file.name,
        fileType,
        fileSize: sizeStr,
        fileUrl: fakeUrl,
      },
    ]);
  };

  const removeEvidence = (index: number) => {
    setEvidenceList((prev) => prev.filter((_, i) => i !== index));
  };

  // Step Nav Validations
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!description.trim() || description.trim().length < 15) {
      newErrors.description = 'Please provide a clear description of the incident (at least 15 characters).';
    }
    if (!date) newErrors.date = 'Date is required.';
    if (!time) newErrors.time = 'Time is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};
    if (!locationAddress.trim()) {
      newErrors.location = 'Please provide an approximate location address or landmark.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 2 && !validateStep2()) return;
    if (step === 4 && !validateStep4()) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Final Submit
  const handleSubmitReport = async () => {
    setSubmitting(true);
    try {
      const created = await createReport({
        anonymous: isAnonymous,
        reporterName: isAnonymous ? undefined : (reporterName || currentUser?.name),
        reporterEmail: isAnonymous ? undefined : (reporterEmail || currentUser?.email),
        reporterPhone: isAnonymous ? undefined : (reporterPhone || currentUser?.phone),
        description,
        additionalInfo,
        category,
        date,
        time,
        location: locationAddress,
        areaDistrict,
        coordinates,
        evidence: evidenceList,
      });

      setSubmittedReportRef(created.referenceId);
      setAiAnalysisPreview({
        suggestedCategory: created.aiSuggestedCategory,
        confidence: created.aiConfidence,
        reasoning: created.aiReasoning,
        priority: created.aiUrgencyPriority,
        humanReviewRecommended: created.aiHumanReviewRecommended,
      });

      setStep(6);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10">
      {/* Header & Step Tracker */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Report an Incident</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Multi-step secure submission with AI classification and encrypted logging.
            </p>
          </div>
          {step <= 5 && (
            <div className="text-right">
              <span className="text-xs font-semibold text-blue-400">Step {step} of 5</span>
              <div className="text-[11px] text-slate-500">
                {step === 1 && 'Reporting Mode'}
                {step === 2 && 'Incident Info'}
                {step === 3 && 'Evidence'}
                {step === 4 && 'Location'}
                {step === 5 && 'Final Review'}
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {step <= 5 && (
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* STEP 1: Reporting Type */}
      {step === 1 && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">How would you like to report this incident?</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Choose between confidential registered reporting or completely anonymous submission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option A: Registered User */}
            <div
              onClick={() => setIsAnonymous(false)}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                !isAnonymous
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-900/20'
                  : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    !isAnonymous ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Report as Registered User</h3>
                  <span className="text-xs text-blue-400">Recommended for updates</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your report will be linked to your Crime Watch account. You can view case status changes, receive direct investigator notifications, and securely manage your report history.
              </p>
            </div>

            {/* Option B: Anonymous */}
            <div
              onClick={() => setIsAnonymous(true)}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                isAnonymous
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-900/20'
                  : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isAnonymous ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Report Anonymously</h3>
                  <span className="text-xs text-emerald-400">Strict Confidentiality</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                No name, email, or telephone details are stored. You will receive a unique reference ID to track progress publicly without ever disclosing your personal identity.
              </p>
            </div>
          </div>

          {/* Privacy Explanation Callout */}
          <div className="bg-slate-900/80 border border-slate-700/80 p-4 rounded-xl flex items-start space-x-3 text-xs text-slate-300">
            <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Privacy Assurance:</strong>
              Whether you choose registered or anonymous reporting, reporter personal identifiers are strictly segregated and NEVER published to the public crime map or public statistics.
            </div>
          </div>

          {!isAnonymous && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Reporter Details (Kept Confidential)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-700">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <span>Continue to Incident Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Incident Information */}
      {step === 2 && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Incident Information</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Provide details regarding the occurrence. Don't worry if you are unsure of the exact legal category; AI analysis will assist officers during review.
            </p>
          </div>

          <div className="space-y-4">
            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Incident Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what occurred in as much detail as possible (e.g., items taken, suspect descriptions, vehicles, direction of travel)..."
                className={`w-full bg-slate-900 border rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
                  errors.description ? 'border-red-500' : 'border-slate-700'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Date of Incident *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Approximate Time *
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Initial Category Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Initial Crime Category (Optional Guidance)
                </label>
                <span className="text-[11px] text-blue-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI will verify & suggest classification
                </span>
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CrimeCategory)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Theft">Theft</option>
                <option value="Vehicle Theft">Vehicle Theft</option>
                <option value="Assault">Assault</option>
                <option value="Burglary">Burglary</option>
                <option value="Vandalism">Vandalism</option>
                <option value="Fraud">Fraud</option>
                <option value="Cyber Crime">Cyber Crime</option>
                <option value="Harassment">Harassment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Additional Info */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Additional Information or Witness Details
              </label>
              <textarea
                rows={2}
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Any potential witnesses, nearby security cameras, or distinguishing identifiers..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-650 text-slate-300 font-medium text-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Continue to Evidence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Evidence Upload */}
      {step === 3 && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Upload Supporting Evidence</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Attach photos, video recordings, receipts, or documents. Uploading evidence is optional but helps investigators substantiate the case.
            </p>
          </div>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-2xl p-8 text-center bg-slate-900/40 transition-colors">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            />
            <label htmlFor="file-upload" className="cursor-pointer block space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white">Click to select a file</span>
                <span className="text-xs text-slate-400 block mt-1">
                  Supports Images (PNG, JPG), Videos (MP4), Documents (PDF) up to 15MB
                </span>
              </div>
            </label>
          </div>

          {evidenceError && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{evidenceError}</span>
            </div>
          )}

          {/* Attached Files List */}
          {evidenceList.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Attached Files ({evidenceList.length})
              </h4>
              <div className="space-y-2">
                {evidenceList.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-medium text-white truncate">{file.fileName}</p>
                        <p className="text-[10px] text-slate-400 uppercase">
                          {file.fileType} • {file.fileSize}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeEvidence(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-650 text-slate-300 font-medium text-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Continue to Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Location */}
      {step === 4 && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Incident Location</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Pin the incident location on the interactive OpenStreetMap map or use your browser location.
            </p>
          </div>

          {/* Location Selector Panel Component */}
          <LocationSelectorPanel
            initialCoordinates={coordinates}
            initialAddress={locationAddress}
            initialDistrict={areaDistrict}
            onConfirmLocation={(selection) => {
              setCoordinates(selection.coordinates);
              setLocationAddress(selection.address);
              setAreaDistrict(selection.district);
            }}
          />

          {/* Status summary of confirmed location */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Selected Incident Location for Report:
              </span>
              <span className="text-[11px] font-mono text-blue-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                Lat: {coordinates.lat.toFixed(5)}, Lng: {coordinates.lng.toFixed(5)}
              </span>
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{locationAddress}</span>
              <span className="text-xs text-slate-400 font-normal">({areaDistrict})</span>
            </div>
            {errors.location && (
              <p className="text-xs text-red-400 mt-1">{errors.location}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-650 text-slate-300 font-medium text-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Review Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Final Review */}
      {step === 5 && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Review Before Submission</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Please verify the entered incident details before final encrypted transmission to law enforcement.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* Reporting Mode Summary */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px] uppercase">Submission Type</span>
                <span className="font-semibold text-white">
                  {isAnonymous ? 'Anonymous Reporting' : 'Registered User Reporting'}
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isAnonymous ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {isAnonymous ? 'Confidential' : 'Account Linked'}
              </span>
            </div>

            {/* Incident Summary */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase">Category</span>
                  <span className="font-semibold text-white">{category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase">Date & Time</span>
                  <span className="text-white">
                    {date} at {time}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] uppercase mb-1">Location</span>
                <span className="text-white font-medium">
                  {locationAddress} ({areaDistrict})
                </span>
                <span className="block text-[11px] font-mono text-slate-400 mt-0.5">
                  Coordinates: {coordinates.lat}, {coordinates.lng}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] uppercase mb-1">Description</span>
                <p className="text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800 whitespace-pre-wrap">
                  {description}
                </p>
              </div>

              {additionalInfo && (
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase mb-1">Additional Details</span>
                  <p className="text-slate-300 italic">{additionalInfo}</p>
                </div>
              )}

              <div>
                <span className="text-slate-400 block text-[11px] uppercase mb-1">
                  Evidence Items ({evidenceList.length})
                </span>
                {evidenceList.length === 0 ? (
                  <span className="text-slate-500 italic">No files attached</span>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {evidenceList.map((e, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 text-xs border border-slate-700"
                      >
                        {e.fileName} ({e.fileSize})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Assistant Explanation Box */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs text-purple-200 flex items-start space-x-3">
              <Cpu className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold mb-0.5">AI Classification Pipeline:</strong>
                Upon submission, Crime Watch’s Gemini AI classification engine will assess incident markers, assign an initial confidence score, and flag priority for police investigator review.
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <button
              onClick={handleBack}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-650 text-slate-300 font-medium text-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleSubmitReport}
              disabled={submitting}
              className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 flex items-center space-x-2 transition-all cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting & Analyzing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Submit Crime Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Submission Success & Reference ID */}
      {step === 6 && submittedReportRef && (
        <div className="bg-slate-800/90 border border-emerald-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-8 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Report Successfully Submitted</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your incident report has been securely encrypted and delivered to the law enforcement intake queue.
            </p>
          </div>

          {/* Reference ID Card */}
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-xl">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Official Reference ID
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-extrabold text-blue-400 tracking-wider py-1">
              {submittedReportRef}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Save this reference number to monitor the investigation progress on the Track Report page.
            </p>
          </div>

          {/* Submission Details & AI Analysis Result */}
          <div className="max-w-md mx-auto grid grid-cols-2 gap-3 text-left text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block text-[11px]">Submission Date:</span>
              <span className="font-semibold text-slate-200">{new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Current Status:</span>
              <span className="font-semibold text-blue-400">Submitted</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-800">
              <span className="text-slate-400 block text-[11px]">AI Suggested Classification (Advisory):</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-semibold text-purple-300">
                  {aiAnalysisPreview?.suggestedCategory || category}
                </span>
                {aiAnalysisPreview?.confidence && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    {Math.round(aiAnalysisPreview.confidence * 100)}% Confidence
                  </span>
                )}
              </div>
              {aiAnalysisPreview?.humanReviewRecommended && (
                <div className="mt-1 text-[11px] text-amber-400 font-medium">
                  • Human Review Recommended
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setTrackRefQuery(submittedReportRef);
                navigateTo('track');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-900/40 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Track Report Progress</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (currentUser && currentUser.role === 'Citizen') navigateTo('citizen-overview');
                else navigateTo('home');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 font-semibold text-sm transition-colors cursor-pointer"
            >
              <span>Return to Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
