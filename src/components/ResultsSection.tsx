import { AlertTriangle, CheckCircle, Upload } from 'lucide-react';
import { Button } from './ui/button';
import type { DetectionResult } from '../App';

interface ResultsSectionProps {
  result: DetectionResult;
  previewUrl: string;
  fileName: string;
  onReset: () => void;
  fileType?: string;
}

export function ResultsSection({
  result,
  previewUrl,
  fileName,
  onReset,
  fileType
}: ResultsSectionProps) {
  const isVideo = fileType?.startsWith('video/');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-gray-700" />
          <h2 className="text-gray-800">Upload Media</h2>
        </div>
        <Button
          onClick={onReset}
          variant="outline"
          className="text-sm"
        >
          Upload New File
        </Button>
      </div>

      <p className="text-gray-500 text-sm">
        Select an image or video file to analyze for AI generation
      </p>

      {/* Preview */}
      <div className="border-2 border-gray-200 rounded-lg p-6 bg-white">
        <div className="text-center space-y-3">
          {isVideo ? (
            <video
              src={previewUrl}
              alt="Analyzed media"
              className="max-h-80 mx-auto rounded-lg"
              controls
            />
          ) : (
            <img
              src={previewUrl}
              alt="Analyzed media"
              className="max-h-80 mx-auto rounded-lg"
            />
          )}
          
          {/* Detection Badge Below Image */}
          <div className="flex justify-center pt-2">
            <div className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-md border-2
              ${result.isAiGenerated 
                ? 'bg-red-50 border-red-300' 
                : 'bg-green-50 border-green-300'
              }
            `}>
              {result.isAiGenerated ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white text-xs">✕</span>
                  </div>
                  <span className="text-red-700 font-medium">AI-Generated</span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-green-700 font-medium">Real</span>
                </>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 text-sm">{fileName}</p>
        </div>
      </div>

      {/* Result Badge */}
      <div className={`
        flex items-start gap-3 p-4 rounded-lg border-2
        ${result.isAiGenerated 
          ? 'bg-red-50 border-red-200' 
          : 'bg-green-50 border-green-200'
        }
      `}>
        {result.isAiGenerated ? (
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        ) : (
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        )}
        <div>
          <h3 className={`${result.isAiGenerated ? 'text-red-800' : 'text-green-800'} mb-1`}>
            {result.isAiGenerated ? 'AI-Generated Content Detected' : 'Authentic Content Detected'}
          </h3>
          <p className="text-gray-600 text-sm">
            Confidence: {result.confidence.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Findings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-gray-800 mb-4">Analysis Findings</h3>
        <div className="space-y-4 text-sm">
          {result.findings.map((finding, index) => {
            // Check if it's a header (starts with **)
            const isHeader = finding.startsWith('**');
            
            if (isHeader) {
              const text = finding.replace(/\*\*/g, '');
              return (
                <p key={index} className="text-red-600 font-medium mt-4 first:mt-0">
                  {text}
                </p>
              );
            }
            
            return (
              <p key={index} className="text-gray-700 leading-relaxed">
                {finding}
              </p>
            );
          })}
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-gray-800 mb-4">Technical Details</h3>
        <div className="space-y-4">
          <DetailItem
            label="AI Pattern Analysis"
            value={result.technicalDetails.aiPatterns}
          />
          <DetailItem
            label="Metadata Verification"
            value={result.technicalDetails.metadata}
          />
          <DetailItem
            label="Artifact Detection"
            value={result.technicalDetails.artifacts}
          />
          <DetailItem
            label="Consistency Check"
            value={result.technicalDetails.consistency}
          />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <span className="font-medium">Note:</span> This analysis is based on AI detection algorithms 
          and should be used as a guide. Always verify critical information through multiple sources.
        </p>
      </div>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div>
      <p className="text-gray-700 font-medium text-sm mb-1">{label}:</p>
      <p className="text-gray-600 text-sm">{value}</p>
    </div>
  );
}