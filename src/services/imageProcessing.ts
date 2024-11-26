import axios from 'axios';

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dpcqnc3qv/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // Updated preset
const MAGIC_API_KEY = 'cm3wufq740003mh03zzw010sb';
const COMBO_ID = '24119045';

export async function uploadToCloudinary(imageData: string): Promise<string> {
  try {
    // Remove data URL prefix if present
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    
    // Debug: Log Base64 data (trimmed to avoid large logs)
    console.log('Base64 Data:', base64Data.substring(0, 100));

    // Create form data
    const formData = new FormData();
    formData.append('file', `data:image/jpeg;base64,${base64Data}`);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    // Debug: Log FormData contents
    console.log('FormData:', formData);

    // Axios request with explicit headers
    const uploadResponse = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Debug: Log the response from Cloudinary
    console.log('Cloudinary Response:', uploadResponse.data);

    if (!uploadResponse.data?.secure_url) {
      throw new Error('No secure URL in response');
    }
    
    return uploadResponse.data.secure_url;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios-specific error details
      console.error('Axios Error:', error.response?.data || error.message);
    } else {
      console.error('Upload Error:', error);
    }
    throw new Error('Failed to upload image');
  }
}


export async function initiateProcessing(imageUrl: string): Promise<string> {
  try {
    const response = await axios.post(
      'https://api.magicapi.dev/api/v1/capix/photolab/photolab/v1/',
      `image_url=${encodeURIComponent(imageUrl)}&combo_id=${COMBO_ID}`,
      {
        headers: {
          'x-magicapi-key': MAGIC_API_KEY,
          'content-type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!response.data?.request_id) {
      throw new Error('No request ID received');
    }

    return response.data.request_id;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Processing initiation failed');
    }
    throw new Error('Failed to initiate processing');
  }
}

export async function pollResult(requestId: string, maxRetries = 10): Promise<string> {
  try {
    let retries = 0;
    while (retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await axios.post(
        'https://api.magicapi.dev/api/v1/capix/photolab/result/',
        `request_id=${requestId}`,
        {
          headers: {
            'x-magicapi-key': MAGIC_API_KEY,
            'content-type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data?.result && typeof response.data.result === 'string' && response.data.result.includes('http')) {
        return response.data.result;
      }

      retries++;
    }
    throw new Error('Processing timeout');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Result polling failed');
    }
    throw new Error('Failed to get processing result');
  }
}