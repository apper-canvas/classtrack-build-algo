import { useEffect, useRef, useState, useMemo } from 'react';

const ApperFileFieldComponent = ({ config, elementId }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(false);
  const elementIdRef = useRef(elementId);
  const existingFilesRef = useRef([]);

  // Update elementIdRef when elementId changes
  useEffect(() => {
    elementIdRef.current = elementId;
  }, [elementId]);

  // Memoize existingFiles to prevent unnecessary re-renders
  const memoizedExistingFiles = useMemo(() => {
    if (!config.existingFiles || !Array.isArray(config.existingFiles)) {
      return [];
    }
    
    // Detect if files have actually changed
    const currentFiles = config.existingFiles;
    const prevFiles = existingFilesRef.current;
    
    if (currentFiles.length !== prevFiles.length) {
      return currentFiles;
    }
    
    if (currentFiles.length > 0 && prevFiles.length > 0) {
      // Check if first file ID/id changed (indicates different files)
      const currentFirstId = currentFiles[0]?.Id || currentFiles[0]?.id;
      const prevFirstId = prevFiles[0]?.Id || prevFiles[0]?.id;
      
      if (currentFirstId !== prevFirstId) {
        return currentFiles;
      }
    }
    
    // Return previous reference if no changes detected
    return prevFiles;
  }, [config.existingFiles]);

  // Initial mount effect
  useEffect(() => {
    const initializeSDK = async () => {
      let attempts = 0;
      const maxAttempts = 50;
      
      while (attempts < maxAttempts) {
        if (window.ApperSDK && window.ApperSDK.ApperFileUploader) {
          try {
            const { ApperFileUploader } = window.ApperSDK;
            elementIdRef.current = `file-uploader-${elementId}`;
            
            await ApperFileUploader.FileField.mount(elementIdRef.current, {
              ...config,
              existingFiles: memoizedExistingFiles
            });
            
            mountedRef.current = true;
            existingFilesRef.current = memoizedExistingFiles;
            setIsReady(true);
            setError(null);
            return;
          } catch (mountError) {
            console.error('Failed to mount ApperFileFieldComponent:', mountError);
            setError(`Mount failed: ${mountError.message}`);
            return;
          }
        }
        
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      throw new Error('ApperSDK not available after 5 seconds');
    };

    initializeSDK().catch(error => {
      console.error('Failed to initialize ApperFileFieldComponent:', error);
      setError(error.message);
    });

    // Cleanup on unmount
    return () => {
      try {
        if (mountedRef.current && window.ApperSDK && elementIdRef.current) {
          const { ApperFileUploader } = window.ApperSDK;
          ApperFileUploader.FileField.unmount(elementIdRef.current);
        }
      } catch (unmountError) {
        console.error('Error during unmount:', unmountError);
      } finally {
        mountedRef.current = false;
        existingFilesRef.current = [];
      }
    };
  }, [elementId, config.fieldKey, config.fieldName, config.tableName, config.apperProjectId, config.apperPublicKey]);

  // File update effect
  useEffect(() => {
    if (!isReady || !window.ApperSDK || !config.fieldKey) {
      return;
    }

    // Deep equality check
    const filesChanged = JSON.stringify(memoizedExistingFiles) !== JSON.stringify(existingFilesRef.current);
    
    if (!filesChanged) {
      return;
    }

    try {
      const { ApperFileUploader } = window.ApperSDK;
      
      // Check if files need format conversion
      let filesToUpdate = memoizedExistingFiles;
      
      if (memoizedExistingFiles.length > 0) {
        // Detect format and convert if needed
        const hasIdField = memoizedExistingFiles[0]?.hasOwnProperty('Id');
        
        if (hasIdField) {
          // Convert from API format to UI format
          filesToUpdate = ApperFileUploader.toUIFormat(memoizedExistingFiles);
        }
      }

      if (filesToUpdate.length > 0) {
        ApperFileUploader.FileField.updateFiles(config.fieldKey, filesToUpdate);
      } else {
        ApperFileUploader.FileField.clearField(config.fieldKey);
      }
      
      existingFilesRef.current = memoizedExistingFiles;
    } catch (updateError) {
      console.error('Error updating files:', updateError);
      setError(`Update failed: ${updateError.message}`);
    }
  }, [memoizedExistingFiles, isReady, config.fieldKey]);

  // Error UI
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700 text-sm">File upload error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div id={`file-uploader-${elementId}`} className="min-h-[100px]">
        {!isReady && (
          <div className="flex items-center justify-center p-8 bg-slate-50 rounded-md">
            <div className="text-sm text-slate-600">Loading file uploader...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApperFileFieldComponent;